package com.finance.dashboard.controller;

import com.finance.dashboard.model.Record;
import com.finance.dashboard.model.Type;
import com.finance.dashboard.service.RecordService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@Tag(name = "Transactions", description = "Manage financial records")
@RestController
@RequestMapping("/api/transactions")  //  fixed route
public class RecordController {

    @Autowired
    private RecordService service;

    @Operation(summary = "Create a new record — ADMIN only")
    @PostMapping
    public ResponseEntity<Record> createRecord(
            @RequestBody Record record,
            HttpServletRequest request) {
        String role = (String) request.getAttribute("role");
        if (!"ADMIN".equals(role) && !"ANALYST".equals(role))
            throw new RuntimeException("Access denied");
        return ResponseEntity.ok(service.createRecord(record));
    }

    @Operation(summary = "Get all records with optional filters")
    @GetMapping
    public ResponseEntity<List<Record>> getAllRecords(
            @RequestParam(required = false) Type type,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate,
            @RequestParam(required = false) String search) {
        LocalDate start = startDate == null ? null : LocalDate.parse(startDate);
        LocalDate end = endDate == null ? null : LocalDate.parse(endDate);
        return ResponseEntity.ok(
                service.filterRecords(type, category, start, end, search));
    }

    @Operation(summary = "Get record by ID")
    @GetMapping("/{id}")
    public ResponseEntity<Record> getById(@PathVariable Long id) {
        return ResponseEntity.ok(service.getRecordById(id));
    }

    @Operation(summary = "Update a record")
    @PutMapping("/{id}")
    public ResponseEntity<Record> updateRecord(
            @PathVariable Long id,
            @RequestBody Record record) {
        return ResponseEntity.ok(service.updateRecord(id, record));
    }

    @Operation(summary = "Get paginated records")
    @GetMapping("/page")
    public ResponseEntity<Page<Record>> getRecordsPage(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "date") String sortBy,
            @RequestParam(defaultValue = "desc") String order) {
        return ResponseEntity.ok(
                service.getRecordsPage(page, size, sortBy, order));
    }

    @Operation(summary = "Soft delete a record — ADMIN only")
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteRecord(
            @PathVariable Long id,
            HttpServletRequest request) {
        String role = (String) request.getAttribute("role");
        if (!"ADMIN".equals(role))
            throw new RuntimeException("Only ADMIN can delete records");
        service.deleteRecord(id);
        return ResponseEntity.ok("Record soft-deleted successfully");
    }

    @Operation(summary = "Restore a soft deleted record — ADMIN only")
    @PostMapping("/restore/{id}")
    public ResponseEntity<String> restore(
            @PathVariable Long id,
            HttpServletRequest request) {
        String role = (String) request.getAttribute("role");
        if (!"ADMIN".equals(role))
            throw new RuntimeException("Only ADMIN can restore records");
        service.restore(id);
        return ResponseEntity.ok("Record restored successfully");
    }
}