import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useAdmin } from "../../../components/admin/AdminContext";

function AdminAnnouncementEdit() {
    const admin = useAdmin();

    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from;

    const { announcementId } = useParams();

    const [announcement, setAnnouncement] = useState(null);
    const [groups, setGroups] = useState([]);

    const [error, setError] = useState("");
    const [errors, setErrors] = useState({});

    const [formData, setFormData] = useState({
        groupId: '',
    })

    // 管理者情報をもとにグループIDを設定
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

    useEffect(() => {
        const getAnnouncement = async () => {
            try {
                const response = await fetch(`/api/admin/announcements/${announcementId}`, {
                    credentials: "include",
                });

                if (!response.ok) {
                    setError("お知らせ情報の取得に失敗しました");
                    return;
                }

                const data = await response.json();

                setAnnouncement(data);

                setFormData({
                    groupId: data.groupId ? Number(data.groupId) : "",
                    title: data.title ?? "",
                    content: data.content ?? "",
                    isPublished: data.isPublished ?? false,
                });

            } catch {
                setError("お知らせ情報の取得に失敗しました");
            }
        };

        getAnnouncement();

    }, [announcementId]);

    const canEdit =
        (admin?.role === "ROLE_ADMIN" &&
            announcement?.groupId === admin.groupId)
        ||
        (admin?.role === "ROLE_SUPER_ADMIN" &&
            announcement?.groupId === null);

    if (!canEdit) {
        return <p>このお知らせを編集する権限がありません。</p>;
    }

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        setFormData(prev => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");
        setErrors({});

        try {
            const response = await fetch(
                `/api/admin/announcements/${announcementId}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    credentials: "include",
                    body: JSON.stringify(formData),
                }
            );

            if (!response.ok) {
                const data = await response.json();

                setErrors(data);

                return;
            }

            // 成功時は詳細画面に戻る
            navigate(`/admin/announcements/${announcementId}`, {
                state: {
                    message: "お知らせを更新しました",
                },
            });

        } catch {
            setError("お知らせ情報を更新できませんでした");
        }
    };

    if (error) {
        return <p className="text-error">{error}</p>;
    }

    if (!announcement) {
        return <p>読み込み中...</p>;
    }

    return (
        <section className="admin-container">

            <h1>
                お知らせ編集
            </h1>

            {error && (
                <p className="text-error">
                    {error}
                </p>
            )}

            <form onSubmit={handleSubmit}>
                <div>
                    <label>
                        公開範囲
                    </label>

                    <p>
                        {announcement.groupId === null
                            ? "全体"
                            : groups.find(
                            group => group.groupId === Number(announcement.groupId)
                        )?.groupName ?? "山車組情報を取得中..."
                        }
                    </p>
                </div>

                {/* お知らせタイトル */}
                <div>
                    <label>
                        <span className="required">＊必須項目</span>
                        お知らせタイトル
                        {errors.title && (
                            <span className="validation-error">
                                {errors.title}
                            </span>
                        )}
                    </label>

                    <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        placeholder="例）〇月×日（△）の集合時間・集合場所について"
                    />

                </div>

                {/* お知らせ内容 */}
                <div>
                    <label>
                        <span className="required">＊必須項目</span>
                        内容
                        {errors.content && (
                            <span className="validation-error">
                                {errors.content}
                            </span>
                        )}
                    </label>

                    <textarea
                        name="content"
                        rows="10"
                        value={formData.content}
                        onChange={handleChange}
                    />

                </div>

                {/* 表示・非表示*/}
                <div>
                    <div>
                        <span className="required">＊必須項目</span>
                        <p className="label">表示・非表示</p>
                        {errors.isPublished && (
                            <span className="validation-error">
                                {errors.isPublished}
                            </span>
                        )}
                    </div>
                    <div className="flex-left">
                        <label className="toggle-btn">
                            <input
                                type="checkbox"
                                name="isPublished"
                                checked={formData.isPublished}
                                onChange={handleChange}
                            />
                        </label>
                        {formData.isPublished ? <p className="mb-0">表示中</p> : <p className="mb-0 text-warn">非表示中</p>}
                    </div>
                </div>

                <button
                    type="submit"
                    className="btn-submit"
                >
                    変更を保存
                </button>
            </form>
            <button
                type="button"
                onClick={() => {
                    if (from === "detail") {
                        navigate(`/admin/announcements/${announcementId}`);
                    } else {
                        navigate("/admin/announcements");
                    }
                }}
                className="btn-back"
            >
                {from === "detail"
                    ? "お知らせ詳細へ戻る"
                    : "お知らせ一覧へ戻る"
                }
            </button>
        </section>
    );
}

export default AdminAnnouncementEdit;