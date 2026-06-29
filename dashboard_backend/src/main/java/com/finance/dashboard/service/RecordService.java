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
                        !r.getDate().isBefore(startDate))
                .filter(r -> endDate == null ||
                        !r.getDate().isAfter(endDate))
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
        Double totalIncome = recordRepository.getTotalIncome();
        Double totalExpenses = recordRepository.getTotalExpenses();
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
            categoryMap.put((String) row[0], (Double) row[1]);
        }
        return categoryMap;
    }

    // Monthly trends
    public Map<Integer, Double> getMonthlyTrends() {
        List<Object[]> results = recordRepository.getMonthlyTrends();
        Map<Integer, Double> monthlyMap = new HashMap<>();
        for (Object[] row : results) {
            monthlyMap.put((Integer) row[0], (Double) row[1]);
        }
        return monthlyMap;
    }

    // Recent 5 records
    public List<Record> getRecentRecords() {
        return recordRepository.findTop5ByActiveTrueOrderByCreatedAtDesc();
    }
}