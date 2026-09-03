package com.example.backend.service;

import com.example.backend.dto.GroupListResponse;
import com.example.backend.entity.Groups;
import com.example.backend.repository.GroupsRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class GroupsService {

    private final GroupsRepository groupsRepository;

    public GroupsService(GroupsRepository groupsRepository){
        this.groupsRepository = groupsRepository;
    }
    public List<GroupListResponse> findAll() {
        return groupsRepository.findAll().stream()
                .map(group -> new GroupListResponse(
                        group.getGroupId(),
                        group.getGroupName()
                ))
                .toList();
    }

}
