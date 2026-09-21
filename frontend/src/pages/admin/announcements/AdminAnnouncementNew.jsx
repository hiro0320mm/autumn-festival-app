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
        <div className="max-w-2xl mx-auto p-6">

            <h1 className="text-2xl font-bold mb-6">
                お知らせ新規登録
            </h1>

            {error && (
                <p className="text-error mb-4">
                    {error}
                </p>
            )}

            <div className="mb-5">
                <p>
                    {admin?.role === "ROLE_SUPER_ADMIN"
                        ? "全体"
                        : admin?.groupName
                    }
                    <span> ユーザー向けのお知らせを登録します</span>
                </p>
            </div>

            <form onSubmit={handleSubmit}>

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
                        登録する
                    </button>
                </div>

                <button type="button"
                        onClick={() => navigate('/admin/announcements')}
                        className="back-to-btn"
                >
                    お知らせ管理トップへ戻る
                </button>

            </form>
        </div>
    )
}

export default AdminAnnouncementNew;