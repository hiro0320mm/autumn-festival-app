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
                        <label>山車組</label>
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
                    <label className="block font-bold mb-2">
                        ポジション名
                    </label>

                    <input
                        type="text"
                        name="positionName"
                        value={formData.positionName}
                        onChange={handleChange}
                        className="input input-bordered w-full"
                    />

                    {errors.positionName && (
                        <p className="text-error mt-1 text-xs">
                            {errors.positionName}
                        </p>
                    )}
                </div>

                {/* 対象者 */}
                <div className="mb-5">
                    <label className="block font-bold mb-2">
                        対象者
                    </label>

                    <input
                        type="text"
                        name="target"
                        value={formData.target}
                        onChange={handleChange}
                        className="input input-bordered w-full"
                        placeholder="例）未就学児、小学生、中学生、○○歳以上 など"
                    />

                    {errors.target && (
                        <p className="text-error mt-1 text-xs">
                            {errors.target}
                        </p>
                    )}

                </div>

                {/* 定員 */}
                <div className="mb-5">
                    <label className="block font-bold mb-2">
                        定員
                    </label>

                    <div className="flex items-center gap-2">
                        <input
                            type="number"
                            name="maxCapacity"
                            value={formData.maxCapacity}
                            onChange={handleChange}
                            className="input input-bordered w-32"
                            min="1"
                        />
                        <span>人</span>
                    </div>

                    {errors.maxCapacity && (
                        <p className="text-error mt-1 text-xs">
                            {errors.maxCapacity}
                        </p>
                    )}

                </div>

                {/* 募集締切日時 */}
                <div>
                    <label>募集締切日</label>
                    <input
                        type="date"
                        value={deadlineDate}
                        onChange={(e) => setDeadlineDate(e.target.value)}
                    />
                </div>

                <div>
                    <label>募集締切時刻</label>
                    <input
                        type="time"
                        value={deadlineTime}
                        onChange={(e) => setDeadlineTime(e.target.value)}
                    />
                </div>
                {errors.deadline && (
                    <p className="text-error mt-1 text-xs">
                        {errors.deadline}
                    </p>
                )}

                {/* 募集状況 */}
                <div className="mb-5">
                    <label className="block font-bold mb-2">
                        募集状況
                    </label>

                    <input
                        type="checkbox"
                        name="recruitmentStatus"
                        checked={formData.recruitmentStatus}
                        onChange={handleChange}
                    />

                    {errors.recruitmentStatus && (
                        <p className="text-error mt-1 text-xs">
                            {errors.recruitmentStatus}
                        </p>
                    )}
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
                    className="btn btn-primary"
                >
                    {from === "detail"
                        ? "ポジション詳細へ戻る"
                        : "ポジション管理トップへ戻る"
                    }
                </button>

                <div className="mt-8">
                    <button
                        type="submit"
                        className="btn btn-primary w-full"
                    >
                        更新する
                    </button>
                </div>

            </form>
        </div>
    );
}
export default AdminPositionEdit;