import { useEffect, useState } from "react";
import {useLocation, useNavigate, useParams} from "react-router-dom";

function AdminPositionDetail() {
    const { positionId } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const message = location.state?.message;

    const [position, setPosition] = useState(null);
    const [error, setError] = useState("");

    useEffect(() => {
        fetch(`/api/admin/positions/${positionId}`, {
            credentials: "include",
        })
            .then(async response => {
                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.message);
                }

                return data;
            })
            .then(data => {
                setPosition(data);
            })
            .catch(error => {
                console.error(error);
                setError(error.message);
            });
    }, [positionId]);

    const formatDateTime = (dateTime) => {
        if (!dateTime) {
            return "";
        }

        const [date, time] = dateTime.split("T");

        return `${date.replaceAll("-", "/")} ${time.slice(0, 5)}`;
    };

    return (
        <div>
            <h1>ポジション情報</h1>

            {error && <p>{error}</p>}
            {message && <p>{message}</p>}

            {position && (
                <div>
                    <p>ポジション名：{position.positionName}</p>
                    <p>対象者：{position.target}</p>
                    <p>定員：{position.maxCapacity} 人</p>
                    <p>募集締切日時：{formatDateTime(position.deadline)}</p>
                    <p>
                        募集状況：
                        {position.recruitmentStatus ? "募集中" : "募集終了"}
                    </p>

                    <button
                        className="btn btn-primary"
                        onClick={() =>
                            navigate(`/admin/positions/${position.positionId}/edit`, {
                                state: { from: "detail" }
                            })
                        }
                    >
                        編集
                    </button>

                    <button
                        type="button"
                        className="btn btn-primary"
                        onClick={() => navigate("/admin/positions")}
                    >
                        一覧に戻る
                    </button>
                </div>
            )}
        </div>
    );
}

export default AdminPositionDetail;