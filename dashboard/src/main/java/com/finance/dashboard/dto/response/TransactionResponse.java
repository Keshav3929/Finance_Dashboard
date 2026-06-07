package com.finance.dashboard.dto.response;

import com.finance.dashboard.model.Type;
import lombok.AllArgsConstructor;
import lombok.Data;
import java.time.LocalDate;

@Data
@AllArgsConstructor
public class TransactionResponse {
    private Long id;
    private Double amount;
    private Type transactionType;
    private String category;
    private LocalDate date;
    private String description;
    private Long userId;
}