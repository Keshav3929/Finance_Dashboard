package com.finance.dashboard.controller;

import com.finance.dashboard.model.Record;
import com.finance.dashboard.service.RecordService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@Tag(name = "Dashboard", description = "Summary and analytics APIs")
@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    @Autowired
    private RecordService recordService;

    @Operation(summary = "Get total income, expenses and net balance")
    @GetMapping("/summary")
    public ResponseEntity<Map<String, Double>> getSummary() {
        return ResponseEntity.ok(recordService.getSummary());
    }

    @Operation(summary = "Get category wise totals")
    @GetMapping("/category-totals")
    public ResponseEntity<Map<String, Double>> getCategoryTotals() {
        return ResponseEntity.ok(recordService.getCategorySummary());
    }

    @Operation(summary = "Get monthly trends")
    @GetMapping("/monthly-trends")
    public ResponseEntity<Map<Integer, Double>> getMonthlyTrends() {
        return ResponseEntity.ok(recordService.getMonthlyTrends());
    }

    @Operation(summary = "Get 5 most recent records")
    @GetMapping("/recent")
    public ResponseEntity<List<Record>> getRecentRecords() {
        return ResponseEntity.ok(recordService.getRecentRecords());
    }
}