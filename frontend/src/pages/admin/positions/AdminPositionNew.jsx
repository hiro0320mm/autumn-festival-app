import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAdmin } from "../../../components/admin/AdminContext";


function AdminPositionNew() {
    const admin = useAdmin();
    const location = useLocation();
    const navigate = useNavigate();

    const [groups, setGroups] = useState([]);

    const [deadlineDate, setDeadlineDate] = useState("");
    const [deadlineTime, setDeadlineTime] = useState("23:59");

    const [error, setError] = useState("");
    const [errors, setErrors] = useState({})

    const [formData, setFormData] = useState(
        location.state?.formData || {
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
        if (!admin) {
            return;
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

        if (!admin) {
            return <p>管理者情報を取得中...</p>;
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
            const response = await fetch("/api/admin/positions", {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(submitData)
            });

            if (!response.ok) {
                const data = await response.json();
                setErrors(data);
                return;
            }

            navigate("/admin/positions", {
                state: {
                    message: "ポジションを登録しました",
                },
            });

        } catch (error) {
            console.error(error);
            setError("ポジションの登録に失敗しました");
        }
    };

    return (
        <section className="admin-container">

            <h1>ポジション新規登録</h1>

            {error && (
                <p className="message-box">
                    {error}
                </p>
            )}

            <form onSubmit={handleSubmit}>
                {/* 特権管理者のみ山車組を選択 */}
                {admin.role === "ROLE_SUPER_ADMIN" && (
                    <div>
                        <label>山車組</label>
                        <select
                            value={formData.groupId}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    groupId: e.target.value
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

                    <div>
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
                        募集締切日
                        {errors.deadline && (
                            <span className="validation-error">
                                {errors.deadline}
                            </span>
                        )}
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
                    登録する
                </button>

            </form>
            <button type="button"
                    onClick={() => navigate('/admin/positions')}
                    className="btn-back"
            >
                ポジション管理トップへ戻る
            </button>
        </section>
    )

}

export default AdminPositionNew;