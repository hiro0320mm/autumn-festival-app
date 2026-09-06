package com.example.backend.service;

import com.example.backend.dto.PositionListResponse;
import com.example.backend.entity.Positions;
import com.example.backend.repository.PositionsRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PositionsService {

    private final PositionsRepository positionsRepository;

    public PositionsService(PositionsRepository positionsRepository) {
        this.positionsRepository = positionsRepository;
    }

    public List<PositionListResponse> findByGroupId(Long groupId) {
        List<Positions> positions =
        positionsRepository.findByGroupGroupIdAndRecruitmentStatusTrue(groupId);

        return positions.stream()
                .map(position -> new PositionListResponse(
                        position.getPositionId(),
                        position.getPositionName()
                ))
                .toList();
    }
}
