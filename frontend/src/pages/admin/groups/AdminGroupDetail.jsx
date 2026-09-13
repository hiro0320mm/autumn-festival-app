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

    const formatDateTime = (dateTime) => {
        if (!dateTime) {
            return "";
        }

        const [date, time] = dateTime.split("T");

        return `${date.replaceAll("-", "/")} ${time.slice(0, 5)}`;
    };

    return (
        <section>
            <h1>山車組情報</h1>
            <header>
                <></>
                <div className="message-box"></div>
                {group &&(
                    <div className="update-history">
                        <p>登録日時：{formatDateTime(group.createdAt)}</p>
                        <p>登録者：{group.createdBy}</p>
                        <p>最終更新日：{formatDateTime(group.updatedAt)}</p>
                        <p>最終更新者：{group.updatedBy}</p>
                    </div>
                )}
            </header>
            <table className="table">
                <tbody>
                <tr>
                    <th className="w-50">山車組名</th>
                    <td>{group.groupName}</td>
                </tr>
                <tr>
                    <th>主要エリア</th>
                    <td>{group.district}</td>
                </tr>
                <tr>
                    <th>事務所所在地</th>
                    <td>{group.officeAddress}</td>
                </tr>
                <tr>
                    <th>事務所電話番号</th>
                    <td>{group.officeTel}</td>
                </tr>
                <tr>
                    <th>その他の窓口</th>
                    <td>{group.contactName}</td>
                </tr>
                <tr>
                    <th>その他の窓口電話番号</th>
                    <td>{group.contactTel}</td>
                </tr>
                <tr>
                    <th>紹介文</th>
                    <td>{group.description}</td>
                </tr>
                </tbody>
            </table>
            <div className="flex justify-center my-10">
                <button
                    className="submit-btn"
                    onClick={() => navigate(`/admin/groups/${groupId}/edit`)}
                >
                    編集する
                </button>
            </div>

            {admin?.role === "ROLE_SUPER_ADMIN" && (
                <button
                    className="back-to-btn"
                    onClick={() => navigate("/admin/groups")}
                >
                    山車組一覧へ戻る
                </button>
            )}

        </section>
    );
}

export default AdminGroupDetail;