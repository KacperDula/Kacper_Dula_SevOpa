package com.example.booking.service;

import com.example.booking.dto.BookingDto;
import com.example.booking.dto.BookingRequest;
import com.example.booking.dto.BookingUpdateRequest;
import com.example.booking.entity.Booking;
import com.example.booking.entity.BookingStatus;
import com.example.booking.entity.Role;
import com.example.booking.entity.ServiceEntity;
import com.example.booking.entity.User;
import com.example.booking.exception.ForbiddenOperationException;
import com.example.booking.exception.ResourceNotFoundException;
import com.example.booking.mapper.BookingMapper;
import com.example.booking.repository.BookingRepository;
import com.example.booking.repository.ServiceRepository;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class BookingService {

    // Business rules for CRUD + ownership enforcement live here so controllers stay thin

    private final BookingRepository bookingRepository;
    private final ServiceRepository serviceRepository;

    public BookingService(BookingRepository bookingRepository, ServiceRepository serviceRepository) {
        this.bookingRepository = bookingRepository;
        this.serviceRepository = serviceRepository;
    }

    @Transactional(readOnly = true)
    public List<BookingDto> findBookings(User user) {
        List<Booking> bookings = isAdmin(user) // admins get the wide view, regular users stay scoped to themselves
                ? bookingRepository.findAll()
                : bookingRepository.findByUser(user);
        return bookings.stream().map(BookingMapper::toDto).toList();
    }

    @Transactional(readOnly = true)
    public BookingDto getBooking(Long id, User user) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));
        if (!isAdmin(user) && !booking.getUser().getId().equals(user.getId())) { // basic access control to keep bookings private
            throw new ForbiddenOperationException("You can only view your own bookings");
        }
        return BookingMapper.toDto(booking);
    }

    @Transactional
    public BookingDto createBooking(BookingRequest request, User user) {
        ServiceEntity service = serviceRepository.findById(request.getServiceId())
                .orElseThrow(() -> new ResourceNotFoundException("Service not found"));
        Booking booking = new Booking();
        booking.setDate(request.getDate());
        booking.setTime(request.getTime());
        booking.setStatus(BookingStatus.SCHEDULED); // default state until someone marks it complete/cancelled
        booking.setService(service);
        booking.setUser(user);
        return BookingMapper.toDto(bookingRepository.save(booking));
    }

    @Transactional
    public BookingDto updateBooking(Long id, BookingUpdateRequest request, User user) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));
        ensureCanModify(user, booking);

        if (request.getDate() != null) {
            booking.setDate(request.getDate());
        }
        if (request.getTime() != null) {
            booking.setTime(request.getTime());
        }
        if (request.getServiceId() != null) {
            ServiceEntity service = serviceRepository.findById(request.getServiceId())
                    .orElseThrow(() -> new ResourceNotFoundException("Service not found"));
            booking.setService(service);
        }
        if (request.getStatus() != null) {
            if (!isAdmin(user) && request.getStatus() != BookingStatus.CANCELLED) {
                throw new ForbiddenOperationException("Users can only cancel their bookings");
            }
            booking.setStatus(request.getStatus()); // admins can flip status freely, users are limited above
        }
        return BookingMapper.toDto(bookingRepository.save(booking));
    }

    @Transactional
    public BookingDto cancelBooking(Long id, User user) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));
        ensureCanModify(user, booking);
        booking.setStatus(BookingStatus.CANCELLED);
        return BookingMapper.toDto(bookingRepository.save(booking));
    }

    @Transactional
    public void deleteBooking(Long id, User user) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));
        if (!isAdmin(user)) {
            throw new ForbiddenOperationException("Only admins can delete bookings");
        }
        bookingRepository.delete(booking);
    }

    private void ensureCanModify(User user, Booking booking) { // shared helper for update/cancel paths
        if (!isAdmin(user) && !booking.getUser().getId().equals(user.getId())) { // basic access control to keep bookings private
            throw new ForbiddenOperationException("You can only manage your own bookings");
        }
    }

    private boolean isAdmin(User user) { // simple role check keeps the logic easy to read
        return user.getRole() == Role.ROLE_ADMIN;
    }
}
