package com.example.leave.domain;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
@Entity
public class LeaveBalance {
 @Id private String employeeEmail;
 private int remainingDays;
 public LeaveBalance() {}
 public LeaveBalance(String email,int days){employeeEmail=email;remainingDays=days;}
 public String getEmployeeEmail(){return employeeEmail;} public void setEmployeeEmail(String v){employeeEmail=v;}
 public int getRemainingDays(){return remainingDays;} public void setRemainingDays(int v){remainingDays=v;}
}
