package com.finance.dashboard.repository;

import com.finance.dashboard.model.Record;
import com.finance.dashboard.model.Type;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface RecordRepository extends JpaRepository<Record, Long> {

    List<Record> findByActiveTrue();

    List<Record> findByActiveTrueAndCategoryIgnoreCase(String category);

    List<Record> findByActiveTrueAndType(Type type);

    List<Record> findByActiveTrueAndDateBetween(LocalDate start, LocalDate end);

    List<Record> findTop5ByActiveTrueOrderByCreatedAtDesc();

    @Query("SELECT COALESCE(SUM(r.amount), 0) FROM Record r WHERE r.type = 'INCOME' AND r.active = true")
    Double getTotalIncome();

    @Query("SELECT COALESCE(SUM(r.amount), 0) FROM Record r WHERE r.type = 'EXPENSE' AND r.active = true")
    Double getTotalExpenses();

    @Query("SELECT r.category, SUM(r.amount) FROM Record r WHERE r.active = true GROUP BY r.category")
    List<Object[]> getCategoryWiseTotals();

    @Query("SELECT MONTH(r.date), SUM(r.amount) FROM Record r WHERE r.active = true GROUP BY MONTH(r.date)")
    List<Object[]> getMonthlyTrends();
}