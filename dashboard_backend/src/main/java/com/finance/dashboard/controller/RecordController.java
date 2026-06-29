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
import org.springframework.security.core.Authentication;

import java.time.LocalDate;
import java.util.List;

@Tag(name = "Transactions", description = "Manage financial records")
@RestController
@RequestMapping("/api/transactions")
public class RecordController {

    @Autowired
    private RecordService service;

    @PostMapping
    public ResponseEntity<Record> createRecord(
            @RequestBody Record record,
            Authentication authentication) {

        return ResponseEntity.ok(
                service.createRecord(record)
        );
    }

    @GetMapping
    public ResponseEntity<List<Record>> getAllRecords(
            @RequestParam(required = false) Type type,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate,
            @RequestParam(required = false) String search) {

        LocalDate start =
                startDate == null ? null :
                        LocalDate.parse(startDate);

        LocalDate end =
                endDate == null ? null :
                        LocalDate.parse(endDate);

        return ResponseEntity.ok(
                service.filterRecords(
                        type,
                        category,
                        start,
                        end,
                        search
                )
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<Record> getById(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                service.getRecordById(id)
        );
    }

    @PutMapping("/{id}")
    public ResponseEntity<Record> updateRecord(
            @PathVariable Long id,
            @RequestBody Record record) {

        return ResponseEntity.ok(
                service.updateRecord(id, record)
        );
    }

    @GetMapping("/page")
    public ResponseEntity<Page<Record>> getRecordsPage(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "date") String sortBy,
            @RequestParam(defaultValue = "desc") String order) {

        return ResponseEntity.ok(
                service.getRecordsPage(
                        page,
                        size,
                        sortBy,
                        order
                )
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteRecord(
            @PathVariable Long id) {

        service.deleteRecord(id);

        return ResponseEntity.ok("Deleted");
    }

    @PostMapping("/restore/{id}")
    public ResponseEntity<String> restore(
            @PathVariable Long id,
            HttpServletRequest request) {

        service.restore(id);

        return ResponseEntity.ok("Restored");
    }

    // CSV EXPORT
    @GetMapping("/export/csv")
    public ResponseEntity<byte[]> exportCsv() throws java.io.IOException {

        // service.exportCsv() returns a ByteArrayInputStream, not a String
        try (java.io.ByteArrayInputStream csvStream = service.exportCsv()) {
            byte[] csvBytes = csvStream.readAllBytes();

            return ResponseEntity.ok()
                    .header(
                            "Content-Disposition",
                            "attachment; filename=transactions.csv"
                    )
                    .header(
                            "Content-Type",
                            "text/csv"
                    )
                    .body(csvBytes);
        }
    }
}