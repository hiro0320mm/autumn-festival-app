import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAdmin } from "../../../components/admin/AdminContext";

function AdminGroupList() {
    const admin = useAdmin();
    const navigate = useNavigate();

    const [groups, setGroups] = useState([]);
    const [error, setError] = useState("");

    useEffect(() => {

        if (!admin) {
            return;
        }

        // 各山車組担当者には一覧画面を表示させない
        if (admin.role === "ROLE_ADMIN") {
            navigate(`/admin/groups/${admin.groupId}`, {
                replace: true,
            });
        }

        const getGroups = async () => {
            try {
                const response = await fetch("/api/admin/groups", {
                    credentials: "include",
                });

                if (!response.ok) {
                    throw new Error("山車組一覧の取得に失敗しました");
                }

                const data = await response.json();
                setGroups(data);

            } catch (error) {
                setError(error.message);
            }
        };

        getGroups();

    }, [admin, navigate]);

    if (!admin) {
        return <p>管理者情報を取得中...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    return (
        <div>
            <h1>山車組一覧</h1>

            {groups.map(group => (
                <div key={group.groupId}>
                    <p><Link to={`/admin/groups/${group.groupId}`}>山車組名：{group.groupName}</Link></p>
                    <p>主要エリア：{group.district}</p>
                    <p>事務所所在地：{group.officeAddress}</p>
                    <p>事務所電話番号：{group.officeTel}</p>
                    <p>その他の窓口：{group.contactName}</p>
                    <p>その他の窓口電話番号：{group.contactTel}</p>
                    <p>紹介文：{group.description}</p>

                    <button
                        className="btn btn-primary"
                        onClick={() => navigate(`/admin/groups/${group.groupId}/edit`)}
                    >
                        編集
                    </button>

                    <hr />
                </div>
            ))}
        </div>
    );
}

export default AdminGroupList;