package com.example.backend.controller;

import com.example.backend.dto.GroupListResponse;
import com.example.backend.entity.Groups;
import com.example.backend.service.GroupsService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/groups-list")
public class GroupsController {

    private final GroupsService groupsService;

    public GroupsController(GroupsService groupsService) {
        this.groupsService = groupsService;
    }

    @GetMapping
    public List<GroupListResponse> findAll() {
        return groupsService.findAll();
    }

}
