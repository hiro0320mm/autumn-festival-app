package com.example.backend.service;

import com.example.backend.dto.*;
import com.example.backend.entity.*;
import com.example.backend.repository.GroupsRepository;
import com.example.backend.repository.PositionsRepository;
import com.example.backend.repository.StaffsRepository;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PositionsService {

    private final PositionsRepository positionsRepository;
    private final GroupsRepository groupsRepository;
    private final StaffsRepository staffsRepository;

    public PositionsService(PositionsRepository positionsRepository, GroupsRepository groupsRepository, StaffsRepository staffsRepository) {
        this.positionsRepository = positionsRepository;
        this.groupsRepository = groupsRepository;
        this.staffsRepository = staffsRepository;
    }

    // 一般ユーザー向け：一覧取得用
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

    // 管理画面向け：一覧取得用
    public List<AdminPositionListResponse> findPositions(
            Authentication authentication
    ) {
        String staffName = authentication.getName();

        Staffs staff = staffsRepository.findByStaffName(staffName)
                .orElseThrow(() ->
                        new UsernameNotFoundException("管理者が見つかりません")
                );

        List<Positions> positions;

        if (staff.getRole() == Role.ROLE_SUPER_ADMIN) {
            // 特権管理者：すべてのポジションを取得
            positions = positionsRepository.findAll();

        } else if (staff.getRole() == Role.ROLE_ADMIN) {
            // 一般管理者：ログインユーザーに紐づいている山車組のポジションのみ取得
            positions = positionsRepository
                    .findByGroup_GroupId(staff.getGroup().getGroupId());

        } else {
            throw new IllegalArgumentException("権限が不正です");
        }

        return positions.stream()
                .map(position -> new AdminPositionListResponse(
                        position.getPositionId(),
                        position.getPositionName(),
                        position.getTarget(),
                        position.getMaxCapacity(),
                        position.getDeadline(),
                        position.getRecruitmentStatus(),
                        position.getGroup().getGroupId()
                ))
                .toList();
    }

    // 管理画面：ポジション詳細
    public AdminPositionDetailResponse findById(
            Long positionId,
            Authentication authentication
    ) {
        Positions position = positionsRepository.findById(positionId)
                .orElseThrow(() ->
                        new IllegalArgumentException("指定されたポジションが見つかりません")
                );

        String staffName = authentication.getName();

        Staffs staff = staffsRepository.findByStaffName(staffName)
                .orElseThrow(() ->
                        new UsernameNotFoundException("管理者が見つかりません")
                );

        if (staff.getRole() == Role.ROLE_ADMIN) {

            if (!position.getGroup().getGroupId()
                    .equals(staff.getGroup().getGroupId())) {
                throw new IllegalArgumentException("このポジションを閲覧する権限がありません");
            }
        } else if (staff.getRole() != Role.ROLE_SUPER_ADMIN) {
            throw new IllegalArgumentException("権限が不正です");
        }

        return new AdminPositionDetailResponse(
                position.getGroup().getGroupId(),
                position.getPositionId(),
                position.getPositionName(),
                position.getTarget(),
                position.getMaxCapacity(),
                position.getDeadline(),
                position.getRecruitmentStatus(),
                position.getUpdatedBy(),
                position.getUpdatedAt()
        );
    }

    // 管理画面：新規登録
    public void registerPosition(
            AdminPositionForm form,
            Authentication authentication
    ) {

        String staffName = authentication.getName();

        Staffs staff = staffsRepository.findByStaffName(staffName)
                .orElseThrow(() ->
                        new UsernameNotFoundException("管理者名が見つかりません")
                );

        Groups group;

        if (staff.getRole() == Role.ROLE_ADMIN) {
            // 一般管理者：ログイン情報に紐づいた山車組にポジションを登録
            group = staff.getGroup();
        } else if (staff.getRole() == Role.ROLE_SUPER_ADMIN) {
            // 特権管理者：指定された山車組にポジションを登録
            if (form.getGroupId() == null) {
                throw new IllegalArgumentException("山車組を指定してください");
            }

            group = groupsRepository.findById(form.getGroupId())
                    .orElseThrow(() ->
                            new IllegalArgumentException("指定された山車組がみつかりません")
                    );
        } else {
            throw new IllegalArgumentException("権限が不正です");
        }

        // ポジション名重複チェック
        if (positionsRepository.existsByGroup_GroupIdAndPositionName(
                group.getGroupId(),
                form.getPositionName()
        )) {
            throw new IllegalArgumentException("同じ山車組に同じポジション名が既に登録されています");
        }

        Positions position = new Positions();

        position.setGroup(group);

        position.setPositionName(form.getPositionName());
        position.setTarget(form.getTarget());
        position.setMaxCapacity(form.getMaxCapacity());
        position.setDeadline(form.getDeadline());
        position.setRecruitmentStatus(form.getRecruitmentStatus());

        positionsRepository.save(position);

    }

    // 管理画面：編集
    public void updatePosition(
            Long positionId,
            AdminPositionUpdateRequest form,
            Authentication authentication
    ) {

        // ログイン中の管理者を取得
        String staffName = authentication.getName();

        Staffs staff = staffsRepository.findByStaffName(staffName)
                .orElseThrow(() ->
                        new UsernameNotFoundException("管理者名が見つかりません")
                );

        // 編集対象のポジションを取得
        Positions position = positionsRepository.findById(positionId)
                .orElseThrow(() ->
                        new IllegalArgumentException("指定されたポジションが見つかりません")
                );

        Groups group;

        if (staff.getRole() == Role.ROLE_ADMIN) {

            // 一般管理者：ログイン情報に紐づいた山車組
            group = staff.getGroup();

        } else if (staff.getRole() == Role.ROLE_SUPER_ADMIN) {

            // 特権管理者：指定された山車組
            if (form.groupId() == null) {
                throw new IllegalArgumentException("山車組を指定してください");
            }

            group = groupsRepository.findById(form.groupId())
                    .orElseThrow(() ->
                            new IllegalArgumentException("指定された山車組が見つかりません")
                    );

        } else {
            throw new IllegalArgumentException("権限が不正です");
        }

        // ポジション名の重複チェック
        // ※自分自身は除外する
        if (positionsRepository
                .existsByGroup_GroupIdAndPositionNameAndPositionIdNot(
                        group.getGroupId(),
                        form.positionName(),
                        positionId
                )) {

            throw new IllegalArgumentException(
                    "同じ山車組に同じポジション名が既に登録されています"
            );
        }

        // ポジション情報を更新
        position.setGroup(group);
        position.setPositionName(form.positionName());
        position.setTarget(form.target());
        position.setMaxCapacity(form.maxCapacity());
        position.setDeadline(form.deadline());
        position.setRecruitmentStatus(form.recruitmentStatus());

        positionsRepository.save(position);
    }
}
