import { useEffect, useState } from "react";
import {Link, useNavigate} from "react-router-dom";
import {Pencil} from "lucide-react";
import { useAdmin } from "../../../components/admin/AdminContext";

function AdminPositions() {
    const admin = useAdmin();
    const navigate = useNavigate();
    const [positions, setPositions] = useState([]);
    const [recruitmentFilter, setRecruitmentFilter] = useState("");
    const [positionFilter, setPositionFilter] = useState("");
    const [groupFilter, setGroupFilter] = useState("");
    const groups = [
        ...new Set(
            positions
                .map((position) => position.groupName)
                .filter(Boolean)
        )
    ];

    const [showRecruitmentStatusModal, setShowRecruitmentStatusModal] = useState(false);
    const [selectedPosition, setSelectedPosition] = useState(null);

    useEffect(() => {
        fetch("/api/admin/positions", {
            credentials: "include",
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error("ポジション一覧の取得に失敗しました");
                }

                return response.json();
            })
            .then(data => {
                setPositions(data);
            })
            .catch(error => {
                console.error(error);
            });
    }, []);

    const formatDateTime = (dateTime) => {
        if (!dateTime) {
            return "";
        }

        const [date, time] = dateTime.split("T");

        return `${date.replaceAll("-", "/")} ${time.slice(0, 5)}`;
    };

    // 募集中・募集停止をトグルスイッチで制御
    const handleRecruitmentStatusToggle = (position) => {
        setSelectedPosition(position);
        setShowRecruitmentStatusModal(true);
    };

    // 表示・非表示トグルスイッチの表示出し分け
    const canEditRecruitmentStatus = (position) =>
        (admin.role === "ROLE_ADMIN" &&
            position.groupId === admin.groupId) ||
        (admin.role === "ROLE_SUPER_ADMIN" &&
            position.groupId === null);

    // 表示・非表示だけ一覧画面から変更する
    const handleRecruitmentStatusConfirm = async () => {
        if (!selectedPosition) return;

        const newRecruitmentStatus = !selectedPosition.recruitmentStatus;

        try {
            const response = await fetch(
                `/api/admin/positions/${selectedPosition.positionId}/recruitment-status`,
                {
                    method: "PATCH",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        recruitmentStatus: newRecruitmentStatus,
                    }),
                }
            );

            if (!response.ok) {
                alert("募集状況の変更に失敗しました");
                return;
            }

            setShowRecruitmentStatusModal(false);

            setPositions((prev) =>
                prev.map((position) =>
                    position.positionId ===
                    selectedPosition.positionId
                        ? {
                            ...position,
                            recruitmentStatus: newRecruitmentStatus,
                        }
                        : position
                )
            );

            setSelectedPosition(null);

        } catch (error) {
            console.error("募集状況の変更に失敗しました", error);
            alert("募集状況の変更に失敗しました");
        }
    };

    // ポジション絞込
    const filteredPositions = positions.filter((position) => {
        return (
            (
                recruitmentFilter !== "recruiting" ||
                position.recruitmentStatus === true
            ) &&
            (
                groupFilter === "" ||
                position.groupName === groupFilter
            )
        );
    });

    return (
        <section className="admin-container">
            <h1>ポジション一覧</h1>
            <div className="filter-box">
                <h2>絞込表示</h2>
                <div className="filter-inner-box">
                    <h3>募集状況で絞込み</h3>
                    <button
                        type="button"
                        className={`${
                            recruitmentFilter === "" ? "filter-btn-active" : "filter-btn"
                        }`}
                        onClick={() => setRecruitmentFilter("")}
                    >
                        すべて
                    </button>

                    <button
                        type="button"
                        className={`${
                            recruitmentFilter === "recruiting"
                                ? "filter-btn-active"
                                : "filter-btn"
                        }`}
                        onClick={() => setRecruitmentFilter("recruiting")}
                    >
                        募集中のみ
                    </button>
                </div>

                {admin.role === "ROLE_SUPER_ADMIN" && (
                    <div className="filter-inner-box">
                        <h3>山車組で絞込み</h3>

                        <button
                            type="button"
                            className={`${
                                groupFilter === "" ? "filter-btn-active" : "filter-btn"
                            }`}
                            onClick={() => setGroupFilter("")}
                        >
                            すべて
                        </button>

                        {groups.map((group) => (
                            <button
                                key={group}
                                type="button"
                                className={`${
                                    groupFilter === group ? "filter-btn-active" : "filter-btn"
                                }`}
                                onClick={() => setGroupFilter(group)}
                            >
                                {group}
                            </button>
                        ))}
                    </div>
                )}
            </div>


            <div className="table-container">
                <div className="add-btn-area">
                    <button
                        type="button"
                        onClick={() => navigate("/admin/positions/register")}
                        className="btn-sub"
                    >
                        ＋ポジションを追加する
                    </button>
                </div>

                <table className="table">
                    <thead>
                        <tr>
                            <th>募集状況</th>
                            {admin.role === "ROLE_SUPER_ADMIN" && <th>山車組</th>}
                            <th>ポジション名</th>
                            <th>対象者</th>
                            <th>申込者数 / 定員</th>
                            <th>募集締切日時</th>
                            <th>編集</th>
                        </tr>
                    </thead>
                    <tbody>
                    {filteredPositions.map((position) => (
                        <tr
                            key={position.positionId}
                            className={`table-row ${
                                !position.recruitmentStatus
                                    ? "is-canceled"
                                    : ""
                            }`}
                            onClick={() => navigate(`/admin/positions/${position.positionId}`)}
                        >
                            <td
                                onClick={(e) => e.stopPropagation()}
                                className={`toggle-box ${
                                    position.recruitmentStatus
                                        ? "text-secondary font-semibold"
                                        : "text-warn font-semibold"
                                }`}
                            >
                                <div className="toggle-content">
                                    {canEditRecruitmentStatus(position) && (
                                    <label className="toggle-btn">
                                        <input
                                            type="checkbox"
                                            checked={position.recruitmentStatus}
                                            onChange={() => handleRecruitmentStatusToggle(position)}
                                        />
                                    </label>
                                    )}
                                    <p>
                                        {position.recruitmentStatus ? "募集中" : "募集停止中"}
                                    </p>
                                </div>
                            </td>
                            {/*山車組：特権管理者の一覧のみ表示*/}
                            {admin.role === "ROLE_SUPER_ADMIN" && (
                                <td className="text-center">{position.groupName}</td>
                            )}
                            <td className="text-center">{position.positionName}</td>
                            <td>{position.target}</td>
                            <td className="text-center">{position.applicantCount} 人 / {position.maxCapacity} 人</td>
                            <td className="text-center">{formatDateTime(position.deadline)}</td>
                            <td
                                onClick={(e) => e.stopPropagation()}
                                className="text-center"
                            >
                                <Link
                                    to={`/admin/positions/${position.positionId}/edit`}
                                    state={{ from: "list" }}
                                    className="icon-edit"
                                >
                                    <Pencil size={18} />
                                </Link>
                            </td>
                        </tr>
                    ))}
                    </tbody>

                </table>
            </div>

            {/* 募集状況変更確認モーダル */}
            {showRecruitmentStatusModal && selectedPosition && (
                <div className="modal-overlay">
                    <div className="modal-box">

                        <h2>ポジションの募集状況を変更します</h2>

                        <p>
                            {selectedPosition.groupName}・{selectedPosition.positionName}
                        </p>

                        <p>
                            このポジションの募集状況を
                            <strong className="text-warn">
                            {selectedPosition.recruitmentStatus
                                ? "「募集停止」"
                                : "「募集中」"
                            }
                            </strong>
                            にしてもよろしいですか？
                        </p>

                        <div className="modal-action">

                            <button
                                className="btn-back"
                                onClick={() => {
                                    setShowRecruitmentStatusModal(false);
                                    setSelectedPosition(null);
                                }}
                            >
                                戻る
                            </button>

                            <button
                                className="btn btn-primary"
                                onClick={handleRecruitmentStatusConfirm}
                            >
                                {selectedPosition.recruitmentStatus
                                    ? "募集を停止する"
                                    : "募集中にする"
                                }
                            </button>

                        </div>
                    </div>
                </div>
            )}

        </section>
    );
}

export default AdminPositions;