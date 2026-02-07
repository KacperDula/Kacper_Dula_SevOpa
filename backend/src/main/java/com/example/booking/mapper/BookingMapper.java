package com.example.booking.mapper;

import com.example.booking.dto.BookingDto;
import com.example.booking.dto.ServiceDto;
import com.example.booking.entity.Booking;

public final class BookingMapper {

    private BookingMapper() {
    }

    public static BookingDto toDto(Booking booking) {
        BookingDto dto = new BookingDto();
        dto.setId(booking.getId());
        dto.setDate(booking.getDate());
        dto.setTime(booking.getTime());
        dto.setStatus(booking.getStatus().name());
        dto.setUserId(booking.getUser().getId());

        ServiceDto serviceDto = ServiceMapper.toDto(booking.getService());
        dto.setService(serviceDto);
        return dto;
    }
}
