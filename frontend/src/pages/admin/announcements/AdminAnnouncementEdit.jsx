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
        return <p>{error}</p>;
    }

    if (!announcement) {
        return <p>読み込み中...</p>;
    }

    return (
        <div className="max-w-2xl mx-auto p-6">

            <h1 className="text-2xl font-bold mb-6">
                お知らせ編集
            </h1>

            {error && (
                <p className="text-error mb-4">
                    {error}
                </p>
            )}

            <form onSubmit={handleSubmit}>
                <div className="mb-5">
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
                <div className="mb-5">
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
                <div className="mb-5">
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
                        className="textarea textarea-bordered w-full"
                        rows="10"
                        value={formData.content}
                        onChange={handleChange}
                    />

                </div>

                {/* 表示・非表示*/}
                <div className="mb-5">
                    <div>
                        <span className="required text-xs">＊必須項目</span>
                        <h3 className="font-semibold mb-5">表示・非表示</h3>
                        {errors.isPublished && (
                            <span className="validation-error">
                                {errors.isPublished}
                            </span>
                        )}
                    </div>
                    <div className="flex justify-between w-fit gap-3 items-center">
                        <label className="toggle-btn">
                            <input
                                type="checkbox"
                                name="isPublished"
                                checked={formData.isPublished}
                                onChange={handleChange}
                            />
                        </label>
                        {formData.isPublished ? <p className="p-3">表示中</p> : <p className="p-3 font-semibold text-accent">非表示中</p>}
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
                            navigate(`/admin/announcements/${announcementId}`);
                        } else {
                            navigate("/admin/announcements");
                        }
                    }}
                    className="back-to-btn"
                >
                    {from === "detail"
                        ? "お知らせ詳細へ戻る"
                        : "お知らせ一覧へ戻る"
                    }
                </button>

            </form>
        </div>
    );
}

export default AdminAnnouncementEdit;