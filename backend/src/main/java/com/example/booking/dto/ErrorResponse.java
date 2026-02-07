package com.example.booking.dto;

import java.time.OffsetDateTime;

public class ErrorResponse {

    // Simple payload returned by the GlobalExceptionHandler for consistent errors

    private OffsetDateTime timestamp = OffsetDateTime.now();
    private int status;
    private String message;
    private String path;

    public ErrorResponse(int status, String message, String path) {
        this.status = status;
        this.message = message;
        this.path = path;
    }

    public OffsetDateTime getTimestamp() {
        return timestamp;
    }

    public int getStatus() {
        return status;
    }

    public String getMessage() {
        return message;
    }

    public String getPath() {
        return path;
    }
}
