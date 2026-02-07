package com.example.booking.repository;

import com.example.booking.entity.Booking;
import com.example.booking.entity.User;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BookingRepository extends JpaRepository<Booking, Long> {
    List<Booking> findByUser(User user);
}
