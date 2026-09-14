import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

function AdminPositionEdit() {
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from;

    const { positionId } = useParams();
    const [position, setPosition] = useState(null);

    const [role, setRole] = useState("");
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

    // 管理者情報を取得
    useEffect(() => {
        fetch("/api/admin/me", {
            credentials: "include",
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error("管理者情報の取得に失敗しました");
                }

                return response.json();
            })
            .then(data => {
                setRole(data.role);

                if (data.role === "ROLE_ADMIN") {
                    setFormData(prev => ({
                        ...prev,
                        groupId: data.groupId
                    }));
                }
            })
            .catch(error => {
                setError(error.message);
            });
    }, [])

    // 特権管理者のときグループ情報を取得
    useEffect(() => {
        if (role !== "ROLE_SUPER_ADMIN") {
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
    }, [role]);

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
        <div className="max-w-2xl mx-auto p-6">

            <h1 className="text-2xl font-bold mb-6">
                ポジション編集
            </h1>

            {error && (
                <p className="text-error mb-4">
                    {error}
                </p>
            )}

            <form onSubmit={handleSubmit}>
                {/* 特権管理者のみ山車組を選択 */}
                {role === "ROLE_SUPER_ADMIN" && (
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
                <div className="mb-5">
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
                <div className="mb-5">
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
                <div className="mb-5">
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
                        className="medium-text"
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
                        className="medium-text"
                        onChange={(e) => setDeadlineTime(e.target.value)}
                    />
                </div>

                {/* 募集状況 */}
                <div className="mb-5">
                    <div>
                        <span className="required text-xs">＊必須項目</span>
                        <h3 className="font-semibold mb-5">募集状況</h3>
                        {errors.recruitmentStatus && (
                            <span className="validation-error">
                                {errors.recruitmentStatus}
                            </span>
                        )}
                    </div>
                    <div className="grid w-fit gap-2 grid-flow-row">
                        <label className="toggle-btn">
                            <input
                                type="checkbox"
                                name="recruitmentStatus"
                                checked={formData.recruitmentStatus}
                                onChange={handleChange}
                            />
                        </label>
                        <span className="p-3">
                            {formData.recruitmentStatus ? "募集中" : "募集停止"}
                        </span>
                    </div>
                </div>

                <div className="flex justify-center my-10">
                    <button
                        type="submit"
                        className="submit-btn"
                    >
                        変更を保存
                    </button>
                </div>

                <button
                    type="button"
                    onClick={() => {
                        if (from === "detail") {
                            navigate(`/admin/positions/${positionId}`);
                        } else {
                            navigate("/admin/positions");
                        }
                    }}
                    className="back-to-btn"
                >
                    {from === "detail"
                        ? "ポジション詳細へ戻る"
                        : "ポジション管理トップへ戻る"
                    }
                </button>

            </form>
        </div>
    );
}
export default AdminPositionEdit;