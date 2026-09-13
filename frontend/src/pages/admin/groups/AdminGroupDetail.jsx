import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAdmin } from "../../../components/admin/AdminContext";

function AdminGroupDetail() {

    const admin = useAdmin();
    const navigate = useNavigate();
    const { groupId } = useParams();

    const [group, setGroup] = useState(null);
    const [error, setError] = useState("");

    useEffect(() => {

        fetch(`/api/admin/groups/${groupId}`, {
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

    }, [groupId]);

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

            {admin?.role === "ROLE_SUPER_ADMIN" && (
                <button
                    className="btn btn-primary"
                    onClick={() => navigate("/admin/groups")}
                >
                    山車組一覧へ戻る
                </button>
            )}

            <button
                className="btn btn-primary"
                onClick={() => navigate(`/admin/groups/${groupId}/edit`)}
            >
                編集
            </button>
        </div>
    );
}

export default AdminGroupDetail;