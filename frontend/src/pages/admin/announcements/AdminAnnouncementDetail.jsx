import { useEffect, useState } from "react";
import {Link, useLocation, useNavigate, useParams} from "react-router-dom";
import {Eye, Pencil} from "lucide-react";
import {useAdmin} from "../../../components/admin/AdminContext.jsx";

function AdminAnnouncementDetail() {

    const admin = useAdmin();
    const { announcementId } = useParams();
    const location = useLocation();
    const navigate = useNavigate();

    const [announcement, setAnnouncement] = useState(null);
    const [error, setError] = useState("");

    useEffect(() => {
        fetch(`/api/admin/announcements/${announcementId}`, {
            credentials: "include",
        })
            .then(async response => {
                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.message);
                }

                return data;
            })
            .then(data => {
                setAnnouncement(data);
            })
            .catch(error => {
                console.error(error);
                setError(error.message);
            });
    }, [announcementId]);

    const formatDateTime = (dateTime) => {
        if (!dateTime) {
            return "";
        }

        const [date, time] = dateTime.split("T");

        return `${date.replaceAll("-", "/")} ${time.slice(0, 5)}`;
    };

    return(
        <section>
            <h1>お知らせ詳細</h1>
            <header>
                <></>
                <div className="message-box">
                    {error && <p>{error}</p>}
                    {/*{message && <p>{message}</p>}*/}
                </div>
                {announcement &&(
                    <div className="update-history">
                        <p>登録日時：{formatDateTime(announcement.createdAt)}</p>
                        <p>登録者：{announcement.createdBy}</p>
                        <p>最終更新日：{formatDateTime(announcement.updatedAt)}</p>
                        <p>最終更新者：{announcement.updatedBy}</p>
                    </div>
                )}
            </header>

            {announcement && (
                <>
                    <table className="table">
                        <tbody>
                        <tr>
                            <th className="w-50">公開範囲</th>
                            <td>
                                {announcement.groupName ? (
                                    <span>{announcement.groupName}のみ</span>
                                ) : (
                                    <span className="text-info">全体</span>
                                )}
                            </td>
                        </tr>
                        <tr>
                            <th>タイトル</th>
                            <td>{announcement.title}</td>
                        </tr>
                        <tr>
                            <th>お知らせ内容</th>
                            <td>
                                <p className="whitespace-pre-wrap">
                                    {announcement.content}
                                </p>
                            </td>
                        </tr>
                        <tr>
                            <th>表示・非表示</th>
                            <td>{announcement.isPublished ? "表示中" : "非表示中"}</td>
                        </tr>
                        </tbody>
                    </table>
                    <div className="flex justify-between my-10">
                        <button
                            type="button"
                            className="back-to-btn"
                            onClick={() => navigate("/admin/announcements")}
                        >
                            一覧に戻る
                        </button>

                        {(
                            (admin.role === "ROLE_ADMIN" &&
                                announcement.groupId === admin.groupId)
                            ||
                            (admin.role === "ROLE_SUPER_ADMIN" &&
                                announcement.groupId === null)
                        ) ? (
                            <button
                                className="add-data-btn"
                                onClick={() =>
                                    navigate(`/admin/announcements/${announcementId}/edit`, {
                                        state: { from: "detail" }
                                    })
                                }
                            >
                                編集
                            </button>
                        ) : ("")}
                    </div>
                </>
            )}
        </section>
    );

}

export default AdminAnnouncementDetail;