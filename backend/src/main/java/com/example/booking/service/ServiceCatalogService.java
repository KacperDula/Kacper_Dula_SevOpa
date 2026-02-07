package com.example.booking.service;

import com.example.booking.dto.ServiceDto;
import com.example.booking.dto.ServiceRequest;
import com.example.booking.entity.ServiceEntity;
import com.example.booking.exception.BadRequestException;
import com.example.booking.exception.ResourceNotFoundException;
import com.example.booking.mapper.ServiceMapper;
import com.example.booking.repository.ServiceRepository;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ServiceCatalogService {

    // CRUD around the offerings list used both by admins and the public landing page

    private final ServiceRepository serviceRepository;

    public ServiceCatalogService(ServiceRepository serviceRepository) {
        this.serviceRepository = serviceRepository;
    }

    @Transactional(readOnly = true)
    public List<ServiceDto> findAll() { // mapper keeps entities out of controller responses
        return serviceRepository.findAll().stream()
                .map(ServiceMapper::toDto)
                .toList();
    }

    @Transactional(readOnly = true)
    public ServiceDto findById(Long id) {
        ServiceEntity entity = serviceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Service not found"));
        return ServiceMapper.toDto(entity);
    }

    @Transactional
    public ServiceDto create(ServiceRequest request) { // guard against duplicate names to keep UX simple
        if (serviceRepository.existsByNameIgnoreCase(request.getName())) {
            throw new BadRequestException("Service name already exists");
        }
        ServiceEntity entity = new ServiceEntity();
        applyRequest(entity, request);
        return ServiceMapper.toDto(serviceRepository.save(entity));
    }

    @Transactional
    public ServiceDto update(Long id, ServiceRequest request) {
        ServiceEntity entity = serviceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Service not found"));
        if (!entity.getName().equalsIgnoreCase(request.getName()) &&
                serviceRepository.existsByNameIgnoreCase(request.getName())) {
            throw new BadRequestException("Service name already exists");
        }
        applyRequest(entity, request);
        return ServiceMapper.toDto(serviceRepository.save(entity));
    }

    @Transactional
    public void delete(Long id) {
        ServiceEntity entity = serviceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Service not found"));
        serviceRepository.delete(entity);
    }

    private void applyRequest(ServiceEntity entity, ServiceRequest request) { // shared hydrator keeps setters in one place
        entity.setName(request.getName());
        entity.setDescription(request.getDescription());
        entity.setDuration(request.getDuration());
    }
}
