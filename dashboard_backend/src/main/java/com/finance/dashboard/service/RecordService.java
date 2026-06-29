package com.finance.dashboard.service;

import com.finance.dashboard.exception.ResourceNotFoundException;
import com.finance.dashboard.model.Record;
import com.finance.dashboard.model.Type;
import com.finance.dashboard.repository.RecordRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.PrintWriter;

@Service
public class RecordService {

    @Autowired
    private RecordRepository recordRepository;

    // Create record
    public Record createRecord(Record record) {
        if (record.getAmount() <= 0)
            throw new RuntimeException("Amount must be positive");
        if (record.getCategory() == null || record.getCategory().isEmpty())
            throw new RuntimeException("Category is required");
        if (record.getDate() == null)
            record.setDate(LocalDate.now());
        record.setActive(true);
        return recordRepository.save(record);
    }

    // Get all active records
    public List<Record> getAllRecords() {
        return recordRepository.findByActiveTrue();
    }

    // Get by ID
    public Record getRecordById(Long id) {
        return recordRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Record not found with id: " + id));
    }

    // Update record
    public Record updateRecord(Long id, Record updated) {
        Record record = getRecordById(id);
        record.setAmount(updated.getAmount());
        record.setType(updated.getType());
        record.setCategory(updated.getCategory());
        record.setDate(updated.getDate());
        record.setDescription(updated.getDescription());
        return recordRepository.save(record);
    }

    // Soft delete
    public void deleteRecord(Long id) {
        Record record = getRecordById(id);
        record.setActive(false);
        recordRepository.save(record);
    }

    // Restore soft deleted record
    public void restore(Long id) {
        Record record = recordRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Record not found with id: " + id));
        record.setActive(true);
        recordRepository.save(record);
    }

    // Filter + search
    public List<Record> filterRecords(Type type, String category,
                                      LocalDate startDate, LocalDate endDate,
                                      String search) {
        return recordRepository.findByActiveTrue().stream()
                .filter(r -> type == null || r.getType() == type)
                .filter(r -> category == null ||
                        r.getCategory().equalsIgnoreCase(category))
                .filter(r -> startDate == null ||
                        (r.getDate() != null &&
                                !r.getDate().isBefore(startDate)))
                .filter(r -> endDate == null ||
                        (r.getDate() != null &&
                                !r.getDate().isAfter(endDate)))
                .filter(r -> search == null || (r.getDescription() != null &&
                        r.getDescription().toLowerCase()
                                .contains(search.toLowerCase())))
                .collect(Collectors.toList());
    }

    // Pagination
    public Page<Record> getRecordsPage(int page, int size,
                                       String sortBy, String order) {
        Sort sort = order.equalsIgnoreCase("desc")
                ? Sort.by(sortBy).descending()
                : Sort.by(sortBy).ascending();
        Pageable pageable = PageRequest.of(page, size, sort);
        List<Record> activeRecords = recordRepository.findByActiveTrue();
        int start = Math.min((int) pageable.getOffset(), activeRecords.size());
        int end = Math.min((start + pageable.getPageSize()), activeRecords.size());
        return new PageImpl<>(activeRecords.subList(start, end),
                pageable, activeRecords.size());
    }

    // Dashboard summary
    public Map<String, Double> getSummary() {
        Double totalIncomeRaw = recordRepository.getTotalIncome();
        Double totalExpensesRaw = recordRepository.getTotalExpenses();

        // Guard against null results (e.g. no matching rows) to avoid NPE on unboxing
        double totalIncome = totalIncomeRaw != null ? totalIncomeRaw : 0.0;
        double totalExpenses = totalExpensesRaw != null ? totalExpensesRaw : 0.0;
        double netBalance = totalIncome - totalExpenses;

        Map<String, Double> summary = new HashMap<>();
        summary.put("totalIncome", totalIncome);
        summary.put("totalExpense", totalExpenses);
        summary.put("netBalance", netBalance);
        return summary;
    }

    // Category wise totals
    public Map<String, Double> getCategorySummary() {
        List<Object[]> results = recordRepository.getCategoryWiseTotals();
        Map<String, Double> categoryMap = new HashMap<>();
        for (Object[] row : results) {
            if (row[0] == null || row[1] == null) {
                continue;
            }
            String category = (String) row[0];
            // Use Number cast instead of Double, since some JPA providers
            // return BigDecimal/Long for SUM() aggregates, which would
            // otherwise throw ClassCastException
            double amount = ((Number) row[1]).doubleValue();
            categoryMap.put(category, amount);
        }
        return categoryMap;
    }

    // Monthly trends
    public Map<Integer, Double> getMonthlyTrends() {

        List<Object[]> results = recordRepository.getMonthlyTrends();

        Map<Integer, Double> monthlyMap = new HashMap<>();

        for (Object[] row : results) {

            if (row[0] == null || row[1] == null) {
                continue;
            }

            Integer month = ((Number) row[0]).intValue();
            Double amount = ((Number) row[1]).doubleValue();

            monthlyMap.put(month, amount);
        }

        return monthlyMap;
    }

    // Recent 5 records
    public List<Record> getRecentRecords() {
        return recordRepository.findTop5ByActiveTrueOrderByCreatedAtDesc();
    }

    // Export active records to CSV, most recent first
    public ByteArrayInputStream exportCsv() {

        List<Record> records =
                recordRepository.findByActiveTrueOrderByDateDesc();

        ByteArrayOutputStream out = new ByteArrayOutputStream();

        // try-with-resources ensures the writer is always closed/flushed,
        // even if something throws while building the CSV
        try (PrintWriter writer = new PrintWriter(out)) {

            // CSV header
            writer.println("Id,Amount,Type,Category,Date,Description");

            // CSV rows
            for (Record r : records) {
                writer.println(String.join(",",
                        csvField(r.getId()),
                        csvField(r.getAmount()),
                        csvField(r.getType()),
                        csvField(r.getCategory()),
                        csvField(r.getDate()),
                        csvField(r.getDescription())
                ));
            }
        }

        return new ByteArrayInputStream(out.toByteArray());
    }

    // Escapes a single CSV field: wraps in quotes and doubles any embedded
    // quotes whenever the value contains a comma, quote, or newline.
    private String csvField(Object value) {
        if (value == null) {
            return "";
        }
        String s = value.toString();
        if (s.contains(",") || s.contains("\"") || s.contains("\n") || s.contains("\r")) {
            s = "\"" + s.replace("\"", "\"\"") + "\"";
        }
        return s;
    }
}