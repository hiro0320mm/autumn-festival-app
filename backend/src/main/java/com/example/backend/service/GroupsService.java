package com.example.backend.service;

import com.example.backend.dto.AdminGroupDetailResponse;
import com.example.backend.dto.AdminGroupUpdateRequest;
import com.example.backend.dto.GroupListResponse;
import com.example.backend.entity.*;
import com.example.backend.repository.GroupsRepository;
import com.example.backend.repository.PositionsRepository;
import com.example.backend.repository.StaffsRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class GroupsService {

    private final GroupsRepository groupsRepository;
    private final StaffsRepository staffsRepository;
    private final PositionsService positionsService;

    public GroupsService(
            GroupsRepository groupsRepository,
            PositionsRepository positionsRepository,
            StaffsRepository staffsRepository,
            PositionsService positionsService
    ){
        this.groupsRepository = groupsRepository;
        this.staffsRepository = staffsRepository;
        this.positionsService = positionsService;
    }

    // 一般ユーザー向け：山車組一覧用
    public List<GroupListResponse> findAll() {
        return groupsRepository.findAll().stream()
                .map(group -> new GroupListResponse(
                        group.getGroupId(),
                        group.getGroupName(),
                        group.getOfficeTel(),
                        positionsService.findByGroupId(group.getGroupId())
                ))
                .toList();
    }

    // 管理画面：山車組詳細取得
    public AdminGroupDetailResponse findById (
            Long groupId,
            Authentication authentication
    ) {
        Groups group = groupsRepository.findById(groupId)
                .orElseThrow(() ->
                        new IllegalArgumentException("指定された山車組が見つかりません")
                );

        String staffName = authentication.getName();

        Staffs staff = staffsRepository.findByStaffName(staffName)
                .orElseThrow(() ->
                        new UsernameNotFoundException("管理者が見つかりません")
                );

        if (staff.getRole() == Role.ROLE_ADMIN) {

            if (!group.getGroupId()
                    .equals(staff.getGroup().getGroupId())) {
                throw new IllegalArgumentException("この山車組の情報を閲覧する権限がありません");
            }
        } else if (staff.getRole() != Role.ROLE_SUPER_ADMIN) {
            throw new IllegalArgumentException("権限が不正です");
        }

        return new AdminGroupDetailResponse(
                group.getGroupId(),
                group.getGroupName(),
                group.getDistrict(),
                group.getOfficeAddress(),
                group.getOfficeTel(),
                group.getContactName(),
                group.getContactTel(),
                group.getDescription()
        );
    }

    // 管理画面：山車組情報編集
    public void updateGroup(
            Long groupId,
            AdminGroupUpdateRequest request,
            Authentication authentication
    ) {

        String staffName = authentication.getName();

        Staffs staff = staffsRepository.findByStaffName(staffName)
                .orElseThrow(() ->
                        new UsernameNotFoundException("管理者名が見つかりません")
                );

        Groups group = groupsRepository.findById(groupId)
                .orElseThrow(() ->
                        new IllegalArgumentException("指定された山車組は存在しません")
                );

        if (staff.getRole() == Role.ROLE_ADMIN) {
            // 一般管理者：ログイン情報に紐づいた山車組を更新
            if (!group.getGroupId()
                    .equals(staff.getGroup().getGroupId())
            ) {
                throw new IllegalArgumentException("この山車組を編集する権限がありません");
            }
        } else if (staff.getRole() != Role.ROLE_SUPER_ADMIN) {
            throw new IllegalArgumentException("権限が不正です");
        }

        group.setDistrict(request.district());
        group.setOfficeAddress(request.officeAddress());
        group.setOfficeTel(request.officeTel());
        group.setContactName(request.contactName());
        group.setContactTel(request.contactTel());
        group.setDescription(request.description());

        groupsRepository.save(group);

    }

}
