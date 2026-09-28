import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useAdmin } from "../../../components/admin/AdminContext";

function AdminPositionEdit() {
    const admin = useAdmin();

    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from;

    const { positionId } = useParams();
    const [position, setPosition] = useState(null);

    const [groups, setGroups] = useState([]);

    const [ error, setError ] = useState(false);
    const [ errors, setErrors ] = useState({});

    const [deadlineDate, setDeadlineDate] = useState("");
    const [deadlineTime, setDeadlineTime] = useState("23:59");

    const [formData, setFormData] = useState({
            groupId: '',
            positionName: '',
            target: '',
            maxCapacity: '',
            deadline: '',
            recruitmentStatus: true,
        }
    )

    useEffect(() => {

        if (!admin) {
            return <p>管理者情報を取得中...</p>;
        }

        if (admin.role === "ROLE_ADMIN") {
            setFormData(prev => ({
                ...prev,
                groupId: admin.groupId
            }));
        }
    }, [admin]);

    // 特権管理者のときグループ情報を取得
    useEffect(() => {
        if (!admin || admin.role !== "ROLE_SUPER_ADMIN") {
            return;
        }

        fetch("/api/groups", {
            credentials: "include",
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error("山車組情報の取得に失敗しました");
                }

                return response.json();
            })
            .then(data => {
                setGroups(data);
            })
            .catch(error => {
                setError(error.message);
            });
    }, [admin]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target

        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value,
        })
    }

    useEffect(() => {
        const getPosition = async () => {
            try {
                const response = await fetch(`/api/admin/positions/${positionId}`, {
                    credentials: "include",
                });

                if (!response.ok) {
                    setError(true);
                    return;
                }

                const data = await response.json();

                setPosition(data);

                setFormData({
                    groupId: Number(data.groupId),
                    positionName: data.positionName,
                    target: data.target,
                    maxCapacity: data.maxCapacity,
                    deadline: data.deadline,
                    recruitmentStatus: data.recruitmentStatus,
                });

                // 締切日時を日付と時間に分解
                if (data.deadline) {
                    const [date, time] = data.deadline.split("T");

                    setDeadlineDate(date.replaceAll("/", "-"));
                    setDeadlineTime(time.slice(0, 5));
                }

            } catch {
                setError(true);
            }
        };

        getPosition();

    }, [positionId]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");
        setErrors({});

        const deadline = deadlineDate
            ? `${deadlineDate.replaceAll("-", "/")} ${deadlineTime}`
            : "";

        const submitData = {
            ...formData,
            deadline,
        };

        try {
            const response = await fetch(`/api/admin/positions/${positionId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify(submitData),
            });

            if (!response.ok) {
                const data = await response.json();

                setErrors(data);

                return;
            }

            // 成功時は詳細画面に戻る
            navigate(`/admin/positions/${positionId}`, {
                state: { message: "ポジション情報を更新しました" }
            });

        } catch {
            setError(true);
        }
    };

    if (error) {
        return <p>ポジション情報を取得・更新できませんでした。</p>;
    }

    if (!position) {
        return <p>読み込み中...</p>
    }

    return (
        <section className="admin-container">

            <h1>ポジション編集</h1>

            {error && (
                <p className="message-box">
                    {error}
                </p>
            )}

            <form onSubmit={handleSubmit}>
                {/* 特権管理者のみ山車組を選択 */}
                {admin.role === "ROLE_SUPER_ADMIN" && (
                    <div>
                        <label>
                            <span className="required">＊必須項目</span>
                            山車組
                        </label>
                        <select
                            value={formData.groupId}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    groupId: Number(e.target.value)
                                })
                            }
                        >
                            <option value="">山車組を選択してください</option>

                            {groups.map(group => (
                                <option key={group.groupId} value={group.groupId}>
                                    {group.groupName}
                                </option>
                            ))}
                        </select>
                    </div>
                )}

                {/* ポジション名 */}
                <div>
                    <label>
                        <span className="required">＊必須項目</span>
                        ポジション名
                        {errors.positionName && (
                            <span className="validation-error">
                                {errors.positionName}
                            </span>
                        )}
                    </label>

                    <input
                        type="text"
                        name="positionName"
                        value={formData.positionName}
                        onChange={handleChange}
                    />

                </div>

                {/* 対象者 */}
                <div>
                    <label>
                        <span className="required">＊必須項目</span>
                        対象者
                        {errors.target && (
                            <span className="validation-error">
                                {errors.target}
                            </span>
                        )}
                    </label>

                    <input
                        type="text"
                        name="target"
                        value={formData.target}
                        onChange={handleChange}
                        placeholder="例）未就学児、小学生、中学生、○○歳以上 など"
                    />

                </div>

                {/* 定員 */}
                <div>
                    <label>
                        <span className="required">＊必須項目</span>
                        定員
                        {errors.maxCapacity && (
                            <span className="validation-error">
                                {errors.maxCapacity}
                            </span>
                        )}
                    </label>

                    <div className="flex items-center gap-2">
                        <input
                            type="number"
                            name="maxCapacity"
                            value={formData.maxCapacity}
                            onChange={handleChange}
                            min="1"
                            className="input-short"
                        />
                        <span>人</span>
                    </div>

                </div>

                {/* 募集締切日時 */}
                <div>
                    <label>
                        <span className="required">＊必須項目</span>
                        募集締切日
                        {errors.deadline && (
                            <span className="validation-error">
                                {errors.deadline}
                            </span>
                        )}
                    </label>
                    <input
                        type="date"
                        value={deadlineDate}
                        className="input-medium"
                        onChange={(e) => setDeadlineDate(e.target.value)}
                    />
                </div>

                <div>
                    <label>
                        <span className="required">＊必須項目</span>
                        募集締切時刻
                    </label>
                    <input
                        type="time"
                        value={deadlineTime}
                        className="input-medium"
                        onChange={(e) => setDeadlineTime(e.target.value)}
                    />
                </div>

                {/* 募集状況 */}
                <div>
                    <div>
                        <span className="required">＊必須項目</span>
                        <p className="label">募集状況</p>
                        {errors.recruitmentStatus && (
                            <span className="validation-error">
                                {errors.recruitmentStatus}
                            </span>
                        )}
                    </div>
                    <div className="flex-left">
                        <label className="toggle-btn">
                            <input
                                type="checkbox"
                                name="recruitmentStatus"
                                checked={formData.recruitmentStatus}
                                onChange={handleChange}
                            />
                        </label>
                        {formData.recruitmentStatus ? <p className="mb-0">募集中</p> : <p className="mb-0 text-warn">募集停止中</p>}
                    </div>
                </div>

                <button
                    type="submit"
                    className="btn-submit"
                >
                    変更を保存
                </button>

                <button
                    type="button"
                    onClick={() => {
                        if (from === "detail") {
                            navigate(`/admin/positions/${positionId}`);
                        } else {
                            navigate("/admin/positions");
                        }
                    }}
                    className="btn-back"
                >
                    {from === "detail"
                        ? "ポジション詳細へ戻る"
                        : "ポジション管理トップへ戻る"
                    }
                </button>

            </form>
        </section>
    );
}
export default AdminPositionEdit;