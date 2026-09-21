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
        <section>
            <div className="flex justify-start gap-x-10">
                <h1>ポジション一覧</h1>
            </div>
            <div className="border-1 w-fit my-3 p-3">
                <h2>絞込表示</h2>
                <div className="flex gap-2 flex-wrap my-5">
                    <h3 className="font-semibold pr-3 w-40">募集状況で絞込み</h3>
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
                    <div className="flex gap-2 flex-wrap my-5 items-center">
                        <h3 className="font-semibold pr-3 w-40">山車組で絞込み</h3>

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


            <div className="overflow-x-auto">
                <div className="float-right mb-5">
                    <button
                        type="button"
                        onClick={() => navigate("/admin/positions/register")}
                        className="add-data-btn"
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
                            className={`hover:bg-base-200 cursor-pointer text-center ${
                                !position.recruitmentStatus
                                    ? "bg-base-300"
                                    : ""
                            }`}
                            onClick={() => navigate(`/admin/positions/${position.positionId}`)}
                        >
                            <td
                                onClick={(e) => e.stopPropagation()}
                                className={
                                    position.recruitmentStatus
                                        ? "text-secondary font-medium"
                                        : "text-error font-medium"
                                }
                            >
                                <label className="toggle-btn flex flex-col items-center">
                                    <input
                                        type="checkbox"
                                        checked={position.recruitmentStatus}
                                        onChange={() => handleRecruitmentStatusToggle(position)}
                                    />
                                </label>
                                <p className="text-xs font-medium">
                                    {position.recruitmentStatus ? "募集中" : "募集停止中"}
                                </p>
                            </td>
                            {/*山車組：特権管理者の一覧のみ表示*/}
                            {admin.role === "ROLE_SUPER_ADMIN" && (
                                <td>{position.groupName}</td>
                            )}
                            <td>{position.positionName}</td>
                            <td>{position.target}</td>
                            <td>{position.applicantCount} 人 / {position.maxCapacity} 人</td>
                            <td>{formatDateTime(position.deadline)}</td>
                            <td
                                onClick={(e) => e.stopPropagation()}
                                className="text-center"
                            >
                                <Link
                                    to={`/admin/positions/${position.positionId}/edit`}
                                    state={{ from: "list" }}
                                    className="edit-icon"
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
                <div className="modal modal-open">
                    <div className="modal-box">

                        <h2 className="text-lg font-bold text-center">
                            ポジションの募集状況を変更します
                        </h2>

                        <p className="my-3 text-center">
                            {selectedPosition.groupName}・{selectedPosition.positionName}
                        </p>

                        <p className="py-4">
                            このポジションの募集状況を
                            <strong>
                            {selectedPosition.recruitmentStatus
                                ? "「募集停止」"
                                : "「募集中」"
                            }
                            </strong>
                            にしてもよろしいですか？
                        </p>

                        <div className="modal-action">

                            <button
                                className="back-to-btn"
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