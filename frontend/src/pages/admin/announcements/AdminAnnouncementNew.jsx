import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAdmin } from "../../../components/admin/AdminContext";

function AdminAnnouncementNew() {
    const admin = useAdmin();
    const navigate = useNavigate();

    const [error, setError] = useState("");
    const [errors, setErrors] = useState({})

    const [formData, setFormData] = useState({
            title: '',
            content: '',
            isPublished: false,
        }
    )

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

        const submitData = {
            ...formData,
        };

        try {
            const response = await fetch("/api/admin/announcements", {
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

            navigate("/admin/announcements", {
                state: {
                    message: "お知らせを登録しました",
                },
            });

        } catch (error) {
            console.error(error);
            setError("お知らせの登録に失敗しました");
        }
    };

    if (!admin) {
        return <p>管理者情報を取得中...</p>;
    }

    return (
        <section className="admin-container">

            <h1>お知らせ新規登録</h1>

            {error && (
                <p className="message-box">
                    {error}
                </p>
            )}

            <p>
                {admin?.role === "ROLE_SUPER_ADMIN"
                    ? "全体"
                    : admin?.groupName
                }
                <span> ユーザー向けのお知らせを登録します</span>
            </p>

            <form onSubmit={handleSubmit}>

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
                    登録する
                </button>

            </form>
            <button type="button"
                    onClick={() => navigate('/admin/announcements')}
                    className="btn-back"
            >
                お知らせ管理トップへ戻る
            </button>
        </section>
    )
}

export default AdminAnnouncementNew;