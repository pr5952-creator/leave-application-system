
package com.example.leave.service;

import com.example.leave.api.*;
import com.example.leave.domain.*;
import io.camunda.client.CamundaClient;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.util.HashMap;
import java.util.Map;

@Service
public class LeaveService {

    private final LeaveRequestRepository requests;
    private final LeaveBalanceRepository balances;
    private final CamundaClient camunda;

    public LeaveService(
            LeaveRequestRepository requests,
            LeaveBalanceRepository balances,
            CamundaClient camunda) {
        this.requests = requests;
        this.balances = balances;
        this.camunda = camunda;
    }

    private int weekdays(LocalDate start, LocalDate end) {
        int count = 0;

        for (LocalDate d = start; !d.isAfter(end); d = d.plusDays(1)) {
            if (d.getDayOfWeek() != DayOfWeek.SATURDAY
                    && d.getDayOfWeek() != DayOfWeek.SUNDAY) {
                count++;
            }
        }

        return count;
    }

    @Transactional
    public LeaveRequest submit(SubmitLeaveRequest body) {
        if (body.endDate().isBefore(body.startDate())) {
            throw new IllegalArgumentException(
                    "End date must be on or after start date.");
        }

        LeaveRequest r = new LeaveRequest();
        r.setEmployeeName(body.employeeName().trim());
        r.setEmployeeEmail(body.employeeEmail().trim().toLowerCase());
        r.setLeaveType(body.leaveType().toUpperCase());
        r.setStartDate(body.startDate());
        r.setEndDate(body.endDate());
        r.setDays(weekdays(body.startDate(), body.endDate()));
        r.setReason(body.reason());
        r.setStatus(LeaveStatus.SUBMITTED);

        requests.save(r);
        balance(r.getEmployeeEmail());

        Map<String, Object> vars = new HashMap<>();
        vars.put("requestId", r.getId());
        vars.put("employeeEmail", r.getEmployeeEmail());
        vars.put("leaveType", r.getLeaveType());
        vars.put("days", r.getDays());
        vars.put("startDate", r.getStartDate().toString());
        vars.put("endDate", r.getEndDate().toString());

        try {
            var result = camunda.newCreateInstanceCommand()
                    .bpmnProcessId("leave-request")
                    .latestVersion()
                    .variables(vars)
                    .send()
                    .join();

            r.setProcessInstanceKey(result.getProcessInstanceKey());
            requests.save(r);
        } catch (Exception ex) {
            r.setStatus(LeaveStatus.REJECTED);
            r.setStatusMessage(
                    "Workflow could not start: " + rootMessage(ex));
            requests.save(r);
        }

        return r;
    }

    @Transactional
    public Map<String, Object> validate(Long id) {
        LeaveRequest r = requests.findById(id).orElseThrow();

        String message = "OK";
        boolean valid = true;

        if (r.getEndDate().isBefore(r.getStartDate())) {
            valid = false;
            message = "End date must not be before start date.";
        } else if ("ANNUAL".equals(r.getLeaveType())
                && balance(r.getEmployeeEmail()).getRemainingDays()
                < r.getDays()) {
            valid = false;
            message = "Insufficient annual leave balance.";
        }

        r.setStatusMessage(message);
        r.setStatus(valid
                ? LeaveStatus.PENDING_APPROVAL
                : LeaveStatus.REJECTED);

        requests.save(r);

        return Map.of(
                "valid", valid,
                "validationMessage", message);
    }

    @Transactional
    public void finalizeRequest(
            Long id,
            boolean approved,
            String comment,
            String validationMessage) {

        LeaveRequest r = requests.findById(id).orElseThrow();

        if (!"OK".equals(validationMessage)) {
            r.setStatus(LeaveStatus.REJECTED);
            r.setStatusMessage(validationMessage);
        } else if (approved) {
            r.setStatus(LeaveStatus.APPROVED);
            r.setStatusMessage(
                    comment == null || comment.isBlank()
                            ? "Approved"
                            : comment);

            if ("ANNUAL".equals(r.getLeaveType())) {
                LeaveBalance b = balance(r.getEmployeeEmail());
                b.setRemainingDays(
                        Math.max(0, b.getRemainingDays() - r.getDays()));
                balances.save(b);
            }
        } else {
            r.setStatus(LeaveStatus.REJECTED);
            r.setStatusMessage(
                    comment == null || comment.isBlank()
                            ? "Rejected by manager"
                            : comment);
        }

        requests.save(r);
    }

    @Transactional
    public void decide(Long id, DecisionRequest decision) {
        LeaveRequest r = requests.findById(id).orElseThrow();

        if (r.getStatus() != LeaveStatus.PENDING_APPROVAL) {
            throw new IllegalStateException(
                    "This request is not waiting for manager approval.");
        }

        if (r.getProcessInstanceKey() == null) {
            throw new IllegalStateException(
                    "This request has no Camunda process instance.");
        }

        var tasks = camunda.newUserTaskSearchRequest()
                .filter(f -> f.processInstanceKey(r.getProcessInstanceKey()))
                .send()
                .join()
                .items();

        if (tasks.isEmpty()) {
            throw new IllegalStateException(
                    "No Camunda manager task was found for request #" + id);
        }

        String comment = decision.comment() == null
                ? ""
                : decision.comment();

        camunda.newCompleteUserTaskCommand(tasks.get(0).getUserTaskKey())
                .variables(Map.of(
                        "approved", decision.approved(),
                        "managerComment", comment,
                        "outcome", decision.approved()
                                ? "APPROVED"
                                : "REJECTED"))
                .send()
                .join();
    }

    public LeaveBalance balance(String email) {
        String key = email.trim().toLowerCase();

        return balances.findById(key)
                .orElseGet(() -> balances.save(new LeaveBalance(key, 20)));
    }

    private String rootMessage(Throwable error) {
        Throwable current = error;

        while (current.getCause() != null) {
            current = current.getCause();
        }

        return current.getMessage() == null
                ? current.getClass().getSimpleName()
                : current.getMessage();
    }
}
