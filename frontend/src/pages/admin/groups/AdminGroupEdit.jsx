import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAdmin } from "../../../components/admin/AdminContext";

function AdminGroupEdit() {

    const admin = useAdmin();
    const navigate = useNavigate();
    const { groupId } = useParams();

    const [group, setGroup] = useState(null);
    const [error, setError] = useState("");
    const [errors, setErrors] = useState({});

    useEffect(() => {

        if (!admin) {
            return <p>管理者情報を取得中...</p>;
        }

        const getGroup = async () => {
            try {
                const response = await fetch(`/api/admin/groups/${groupId}`, {
                    credentials: "include",
                });

                if (!response.ok) {
                    setError("山車組情報の取得に失敗しました");
                    return;
                }

                const data = await response.json();
                setGroup(data);

            } catch {
                setError("山車組情報の取得に失敗しました");
            }
        };

        getGroup();

    },[groupId]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData(e.currentTarget);

        const body = {
            district: formData.get("district"),
            officeAddress: formData.get("officeAddress"),
            officeTel: formData.get("officeTel"),
            contactName: formData.get("contactName"),
            contactTel: formData.get("contactTel"),
            description: formData.get("description"),
        };

        try {
            const response = await fetch(`/api/admin/groups/${groupId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify(body),
            });

            if (!response.ok) {
                const data = await response.json();

                setErrors(data);

                return;
            }

            navigate(`/admin/groups/${groupId}`, {
                state: { message: "情報を更新しました" }
            });

        } catch {
            setError("山車組情報の更新に失敗しました");
        }
    };

    if (!admin) {
        return <p>管理者情報を取得中...</p>;
    }

    if (error) {
        return <p className="text-error">{error}</p>;
    }

    if (!group) {
        return <p>山車組情報を取得中...</p>;
    }

    return (
        <section className="admin-container">
            <h1>山車組情報の編集</h1>

            {errors.message && (
                <p className="text-error">
                    {errors.message}
                </p>
            )}
            <div className="optional-box w-fit">
                <p className="text-large">
                    <span className="text-block">山車組名</span>
                    {group.groupName}
                </p>
            </div>

            <form onSubmit={handleSubmit}>



                {/* 主要エリア */}
                <div>
                    <label className="block font-bold mb-2">
                        主要エリア
                    </label>

                    <input
                        type="text"
                        name="district"
                        defaultValue={group.district}
                    />

                    {errors.district && (
                        <p className="text-error mt-1 text-xs">
                            {errors.district}
                        </p>
                    )}
                </div>

                {/* 事務所所在地 */}
                <div>
                    <label className="block font-bold mb-2">
                        事務所所在地
                    </label>

                    <input
                        type="text"
                        name="officeAddress"
                        defaultValue={group.officeAddress}
                    />

                    {errors.officeAddress && (
                        <p className="text-error mt-1 text-xs">
                            {errors.officeAddress}
                        </p>
                    )}
                </div>

                {/* 事務所電話番号 */}
                <div>
                    <label className="block font-bold mb-2">
                        事務所電話番号
                    </label>

                    <input
                        type="text"
                        name="officeTel"
                        defaultValue={group.officeTel}
                    />

                    {errors.officeTel && (
                        <p className="text-error mt-1 text-xs">
                            {errors.officeTel}
                        </p>
                    )}
                </div>

                {/* その他の窓口 */}
                <div>
                    <label className="block font-bold mb-2">
                        その他の窓口
                    </label>

                    <input
                        type="text"
                        name="contactName"
                        defaultValue={group.contactName}
                    />

                    {errors.contactName && (
                        <p className="text-error mt-1 text-xs">
                            {errors.contactName}
                        </p>
                    )}
                </div>

                {/* その他の窓口電話番号 */}
                <div>
                    <label className="block font-bold mb-2">
                        その他の窓口電話番号
                    </label>

                    <input
                        type="text"
                        name="contactTel"
                        defaultValue={group.contactTel}
                    />

                    {errors.contactTel && (
                        <p className="text-error mt-1 text-xs">
                            {errors.contactTel}
                        </p>
                    )}
                </div>

                {/* 説明文 */}
                <div>
                    <label className="block font-bold mb-2">
                        説明文
                    </label>

                    <textarea
                        name="description"
                        className="textarea textarea-bordered w-full"
                        rows="4"
                        defaultValue={group.description ?? ""}
                    />

                    {errors.description && (
                        <p className="text-error mt-1 text-xs">
                            {errors.description}
                        </p>
                    )}
                </div>

                <div className="flex justify-center my-10">
                    <button
                        type="submit"
                        className="btn-submit"
                    >
                        変更を保存
                    </button>
                </div>
            </form>
            <button
                type="button"
                onClick={() => navigate(`/admin/groups/${groupId}`)}
                className="btn-back"
            >
                ← 山車組詳細へ戻る
            </button>
        </section>
    )
}

export default AdminGroupEdit;