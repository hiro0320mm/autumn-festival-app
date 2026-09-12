import { useEffect, useState } from "react";
import {Link, useNavigate} from "react-router-dom";

function AdminPositions() {
    const navigate = useNavigate();
    const [positions, setPositions] = useState([]);

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

    return (
        <div>
            <h1>ポジション管理</h1>

            <button
                type="button"
                onClick={() => navigate("/admin/positions/register")}
                className="btn btn-primary"
            >
                ＋ポジションを追加する
            </button>

            {positions.map(position => (
                <div key={position.positionId}>
                    <p>募集状況：{position.recruitmentStatus ? "募集中" : "募集終了"}</p>
                    <Link to={`/admin/positions/${position.positionId}`}>
                        <p>ポジション名：{position.positionName}</p>
                    </Link>
                    <p>対象者：{position.target}</p>
                    <p>定員：{position.maxCapacity} 人</p>
                    <p>募集締切日時：{formatDateTime(position.deadline)}</p>

                    <Link to={`/admin/positions/${position.positionId}/edit`}>
                        編集
                    </Link>

                    <hr />
                </div>
            ))}
        </div>
    );
}

export default AdminPositions;