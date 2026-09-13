import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAdmin } from "../../../components/admin/AdminContext";

function AdminGroupDetail() {

    const admin = useAdmin();
    const navigate = useNavigate();

    const [group, setGroup] = useState(null);
    const [error, setError] = useState("");

    useEffect(() => {

        // 管理者情報がまだ取得できていない場合
        if (!admin) {
            return;
        }

        // groupIdがない場合
        if (admin.groupId === null) {
            setError("山車組情報を取得できません");
            return;
        }

        fetch(`/api/admin/groups/${admin.groupId}`, {
            credentials: "include",
        })
            .then(response => {

                if (!response.ok) {
                    throw new Error("山車組情報の取得に失敗しました");
                }

                return response.json();
            })
            .then(data => {
                setGroup(data);
            })
            .catch(error => {
                setError(error.message);
            });

    }, [admin]);

    if (!admin) {
        return <p>管理者情報を取得中...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    if (!group) {
        return <p>山車組情報を取得中...</p>;
    }

    return (
        <div>
            <h1>山車組情報</h1>

            <p>山車組名：{group.groupName}</p>
            <p>主要エリア：{group.district}</p>
            <p>事務所所在地：{group.officeAddress}</p>
            <p>事務所電話番号：{group.officeTel}</p>
            <p>その他の窓口：{group.contactName}</p>
            <p>その他の窓口電話番号：{group.contactTel}</p>
            <p>紹介文：{group.description}</p>

            <button
                className="btn btn-primary"
                onClick={() => navigate(`/admin/groups/${admin.groupId}/edit`)}
            >
                編集
            </button>
        </div>
    );
}

export default AdminGroupDetail;