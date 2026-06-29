package com.finance.dashboard.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor

public class DashboardSummaryResponse {
    private Double totalIncome;
    private Double totalExpenses;
    private Double netBalance;
}