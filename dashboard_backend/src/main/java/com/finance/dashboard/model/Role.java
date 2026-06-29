package com.finance.dashboard.model;

public enum Role {
    VIEWER,    // Can only view dashboard data
    ANALYST,   // Can view records and access insights
    ADMIN      // Full access — create, update, delete
}