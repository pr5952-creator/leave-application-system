package com.example.leave.api;
import jakarta.validation.constraints.*;
import java.time.LocalDate;
public record SubmitLeaveRequest(@NotBlank String employeeName, @NotBlank @Email String employeeEmail,
 @NotBlank String leaveType, @NotNull LocalDate startDate, @NotNull LocalDate endDate, String reason) {}
