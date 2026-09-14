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
        <section>
            <h1>ポジション情報</h1>
            <header>
                <></>
                <div className="message-box">
                    {error && <p>{error}</p>}
                    {message && <p>{message}</p>}
                </div>
                {position &&(
                    <div className="update-history">
                        <p>登録日時：{formatDateTime(position.createdAt)}</p>
                        <p>登録者：{position.createdBy}</p>
                        <p>最終更新日：{formatDateTime(position.updatedAt)}</p>
                        <p>最終更新者：{position.updatedBy}</p>
                    </div>
                )}
            </header>

            {position && (
                <>
                    <table className="table">
                        <tbody>
                            <tr>
                                <th className="w-50">ポジション名</th>
                                <td>{position.positionName}</td>
                            </tr>
                            <tr>
                                <th>対象者</th>
                                <td>{position.target}</td>
                            </tr>
                            <tr>
                                <th>定員</th>
                                <td>{position.maxCapacity} 人</td>
                            </tr>
                            <tr>
                                <th>募集締切日時</th>
                                <td>{formatDateTime(position.deadline)}</td>
                            </tr>
                            <tr>
                                <th>募集状況</th>
                                <td>{position.recruitmentStatus ? "募集中" : "募集終了"}</td>
                            </tr>
                        </tbody>
                    </table>
                    <div className="flex justify-between my-10">
                        <button
                            type="button"
                            className="back-to-btn"
                            onClick={() => navigate("/admin/positions")}
                        >
                            一覧に戻る
                        </button>

                        <button
                            className="add-data-btn"
                            onClick={() =>
                                navigate(`/admin/positions/${position.positionId}/edit`, {
                                    state: { from: "detail" }
                                })
                            }
                        >
                            編集
                        </button>
                    </div>
                </>
            )}
        </section>
    );
}

export default AdminPositionDetail;