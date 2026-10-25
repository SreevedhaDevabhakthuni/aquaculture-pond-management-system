
package com.klef.soa.docker.service;

import java.util.List;

import com.klef.soa.docker.dto.AquaculturePondRequest;
import com.klef.soa.docker.dto.AquaculturePondResponse;

public interface AquaculturePondService
{
    AquaculturePondResponse savePond(AquaculturePondRequest request);
    AquaculturePondResponse updatePond(Long id, AquaculturePondRequest request);
    List<AquaculturePondResponse> getAllPonds();
    AquaculturePondResponse getPondById(Long id);
    String deletePond(Long id);
}
