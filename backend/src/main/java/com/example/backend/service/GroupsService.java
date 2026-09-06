package com.example.backend.service;

import com.example.backend.dto.GroupListResponse;
import com.example.backend.entity.Groups;
import com.example.backend.repository.GroupsRepository;
import com.example.backend.repository.PositionsRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class GroupsService {

    private final GroupsRepository groupsRepository;
    private final PositionsService positionsService;

    public GroupsService(
            GroupsRepository groupsRepository,
            PositionsService positionsService
    ){
        this.groupsRepository = groupsRepository;
        this.positionsService = positionsService;
    }
    public List<GroupListResponse> findAll() {
        return groupsRepository.findAll().stream()
                .map(group -> new GroupListResponse(
                        group.getGroupId(),
                        group.getGroupName(),
                        positionsService.findByGroupId(group.getGroupId())
                ))
                .toList();
    }

}
