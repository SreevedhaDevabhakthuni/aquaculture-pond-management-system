
package com.klef.soa.docker.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.klef.soa.docker.dto.AquaculturePondRequest;
import com.klef.soa.docker.dto.AquaculturePondResponse;
import com.klef.soa.docker.entity.AquaculturePondEntity;
import com.klef.soa.docker.repository.AquaculturePondRepository;
import com.klef.soa.docker.service.AquaculturePondService;

@Service
public class AquaculturePondServiceImpl implements AquaculturePondService
{
    @Autowired
    private AquaculturePondRepository repo;

    @Override
    public AquaculturePondResponse savePond(AquaculturePondRequest request)
    {
        AquaculturePondEntity pond = AquaculturePondEntity.builder()
                .pondName(request.getPondName())
                .fishSpecies(request.getFishSpecies())
                .areaAcres(request.getAreaAcres())
                .active(request.getActive())
                .build();

        AquaculturePondEntity savedPond = repo.save(pond);
        return mapToResponse(savedPond);
    }

    @Override
    public List<AquaculturePondResponse> getAllPonds()
    {
        return repo.findAll()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    public AquaculturePondResponse getPondById(Long id)
    {
        Optional<AquaculturePondEntity> optional = repo.findById(id);

        if(optional.isPresent())
        {
            return mapToResponse(optional.get());
        }
        else
        {
            return null;
        }
    }

    @Override
    public AquaculturePondResponse updatePond(Long id, AquaculturePondRequest request)
    {
        Optional<AquaculturePondEntity> optional = repo.findById(id);

        if(optional.isPresent())
        {
            AquaculturePondEntity pond = optional.get();

            pond.setPondName(request.getPondName());
            pond.setFishSpecies(request.getFishSpecies());
            pond.setAreaAcres(request.getAreaAcres());
            pond.setActive(request.getActive());

            AquaculturePondEntity updatedPond = repo.save(pond);
            return mapToResponse(updatedPond);
        }
        else
        {
            return null;
        }
    }

    @Override
    public String deletePond(Long id)
    {
        boolean status = repo.existsById(id);

        if(status)
        {
            repo.deleteById(id);
            return "Pond Deleted Successfully";
        }
        else
        {
            return "Pond Id Not Found To Delete";
        }
    }

    private AquaculturePondResponse mapToResponse(AquaculturePondEntity pond)
    {
        return AquaculturePondResponse.builder()
                .id(pond.getId())
                .pondName(pond.getPondName())
                .fishSpecies(pond.getFishSpecies())
                .areaAcres(pond.getAreaAcres())
                .active(pond.getActive())
                .build();
    }
}
