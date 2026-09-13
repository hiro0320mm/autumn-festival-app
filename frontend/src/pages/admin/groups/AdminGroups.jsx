import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAdmin } from "../../../components/admin/AdminContext";
import {Pencil} from "lucide-react";

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
        <section>
            <div className="flex justify-start gap-x-10">
                <h1>山車組一覧</h1>
            </div>

            <table className="table">
                <thead>
                    <tr>
                        <th>山車組名</th>
                        <th>主要エリア</th>
                        <th>事務所所在地</th>
                        <th>事務所電話番号</th>
                        <th>その他の窓口</th>
                        <th>その他の窓口電話番号</th>
                        <th>紹介文</th>
                        <th>編集</th>
                    </tr>
                </thead>
                <tbody>
                {groups.map(group => (
                    <tr
                        key={group.groupId}
                        className="hover:bg-base-200 cursor-pointer text-center"
                        onClick={() => navigate(`/admin/groups/${group.groupId}`)}
                    >
                        <td>{group.groupName}</td>
                        <td>{group.district}</td>
                        <td>{group.officeAddress}</td>
                        <td>{group.officeTel}</td>
                        <td>{group.contactName}</td>
                        <td>{group.contactTel}</td>
                        <td>{group.description}</td>
                        <td
                            onClick={(e) => e.stopPropagation()}
                            className="text-center"
                        >
                            <Link
                                to={`/admin/groups/${group.groupId}/edit`}
                                state={{ from: "list" }}
                                className="edit-icon"
                            >
                                <Pencil size={18} />
                            </Link>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </section>
    );
}

export default AdminGroupList;