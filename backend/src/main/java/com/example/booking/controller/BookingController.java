package com.example.booking.controller;

import com.example.booking.dto.BookingDto;
import com.example.booking.dto.BookingRequest;
import com.example.booking.dto.BookingUpdateRequest;
import com.example.booking.entity.User;
import com.example.booking.service.BookingService;
import com.example.booking.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/bookings")
@Tag(name = "Bookings")
@SecurityRequirement(name = "bearerAuth")
public class BookingController {

    // Booking endpoints always look up the current user so we can enforce ownership rules in the service layer

    private final BookingService bookingService;
    private final UserService userService;

    public BookingController(BookingService bookingService, UserService userService) {
        this.bookingService = bookingService;
        this.userService = userService;
    }

    @GetMapping
    @Operation(summary = "List bookings for the authenticated user (admins see all)")
    public ResponseEntity<List<BookingDto>> list() { // admins see every booking, members only see their own
        User currentUser = userService.getCurrentUser();
        return ResponseEntity.ok(bookingService.findBookings(currentUser));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get booking details")
    public ResponseEntity<BookingDto> get(@PathVariable Long id) {
        User currentUser = userService.getCurrentUser();
        return ResponseEntity.ok(bookingService.getBooking(id, currentUser));
    }

    @PostMapping
    @Operation(summary = "Create a booking")
    public ResponseEntity<BookingDto> create(@Valid @RequestBody BookingRequest request) { // new booking defaults to SCHEDULED status
        User currentUser = userService.getCurrentUser();
        return new ResponseEntity<>(bookingService.createBooking(request, currentUser), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update booking details")
    public ResponseEntity<BookingDto> update(@PathVariable Long id, @Valid @RequestBody BookingUpdateRequest request) { // lets users tweak date/time/service and admins adjust status
        User currentUser = userService.getCurrentUser();
        return ResponseEntity.ok(bookingService.updateBooking(id, request, currentUser));
    }

    @PostMapping("/{id}/cancel")
    @Operation(summary = "Cancel a booking")
    public ResponseEntity<BookingDto> cancel(@PathVariable Long id) { // shorthand endpoint so users can cancel without crafting a PATCH body
        User currentUser = userService.getCurrentUser();
        return ResponseEntity.ok(bookingService.cancelBooking(id, currentUser));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Delete a booking (admin only)")
    public ResponseEntity<Void> delete(@PathVariable Long id) { // guard rails ensure only admins can fully delete bookings
        User currentUser = userService.getCurrentUser();
        bookingService.deleteBooking(id, currentUser);
        return ResponseEntity.noContent().build();
    }
}
