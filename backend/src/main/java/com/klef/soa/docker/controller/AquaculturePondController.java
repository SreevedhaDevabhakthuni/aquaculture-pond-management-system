
package com.klef.soa.docker.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.klef.soa.docker.dto.AquaculturePondRequest;
import com.klef.soa.docker.dto.AquaculturePondResponse;
import com.klef.soa.docker.service.AquaculturePondService;

import jakarta.validation.Valid;

@CrossOrigin("*")
@RestController
@RequestMapping("/pond")
public class AquaculturePondController
{
    @Autowired
    private AquaculturePondService service;

    @GetMapping("/")
    public String home()
    {
        return "Aquaculture Pond Management Project";
    }

    @PostMapping("/add")
    public ResponseEntity<AquaculturePondResponse> savePond(
            @Valid @RequestBody AquaculturePondRequest request)
    {
        return new ResponseEntity<>(service.savePond(request), HttpStatus.CREATED);
    }

    @GetMapping("/displayall")
    public ResponseEntity<List<AquaculturePondResponse>> getAllPonds()
    {
        return ResponseEntity.ok(service.getAllPonds());
    }

    @GetMapping("/display/id/{id}")
    public ResponseEntity<?> getPondById(@PathVariable Long id)
    {
        AquaculturePondResponse pond = service.getPondById(id);

        if(pond != null)
        {
            return ResponseEntity.ok(pond);
        }
        else
        {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Pond Id Not Found");
        }
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<?> updatePond(
            @PathVariable Long id,
            @Valid @RequestBody AquaculturePondRequest request)
    {
        AquaculturePondResponse pond = service.updatePond(id, request);

        if(pond != null)
        {
            return ResponseEntity.ok(pond);
        }
        else
        {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Pond Id Not Found to Update");
        }
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deletePond(@PathVariable Long id)
    {
        String output = service.deletePond(id);

        if(output.equals("Pond Id Not Found To Delete"))
        {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(output);
        }

        return ResponseEntity.ok(output);
    }
}
