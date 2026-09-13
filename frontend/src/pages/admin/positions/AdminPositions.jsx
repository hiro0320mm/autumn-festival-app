import { useEffect, useState } from "react";
import {Link, useNavigate} from "react-router-dom";
import {Pencil} from "lucide-react";

function AdminPositions() {
    const navigate = useNavigate();
    const [positions, setPositions] = useState([]);
    const [recruitmentFilter, setRecruitmentFilter] = useState("");

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

    const filteredPositions = positions.filter((position) => {
        if (recruitmentFilter === "recruiting") {
            return position.recruitmentStatus === true;
        }

        return true;
    });

    return (
        <section>
            <div className="flex justify-start gap-x-10">
                <h1>ポジション一覧</h1>
            </div>
            <div className="flex gap-2 flex-wrap my-5">
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
                                className={
                                    position.recruitmentStatus
                                        ? "text-secondary font-medium"
                                        : "text-error font-medium"
                                }
                            >
                                {position.recruitmentStatus ? "募集中" : "停止中"}
                            </td>
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

        </section>
    );
}

export default AdminPositions;