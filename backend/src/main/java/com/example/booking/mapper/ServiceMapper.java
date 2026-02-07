package com.example.booking.mapper;

import com.example.booking.dto.ServiceDto;
import com.example.booking.entity.ServiceEntity;

public final class ServiceMapper {

    private ServiceMapper() {
    }

    public static ServiceDto toDto(ServiceEntity entity) {
        ServiceDto dto = new ServiceDto();
        dto.setId(entity.getId());
        dto.setName(entity.getName());
        dto.setDescription(entity.getDescription());
        dto.setDuration(entity.getDuration());
        return dto;
    }
}
