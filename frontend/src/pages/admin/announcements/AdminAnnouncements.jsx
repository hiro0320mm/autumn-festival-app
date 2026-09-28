import { useEffect, useState } from "react";
import {Link, useNavigate} from "react-router-dom";
import { Pencil, Eye } from "lucide-react";
import { useAdmin } from "../../../components/admin/AdminContext";

function AdminAnnouncements() {

    const admin = useAdmin();
    const navigate = useNavigate();
    const [announcements, setAnnouncements] = useState([]);

    const [announcementFilter, setAnnouncementFilter] = useState("");
    const [groupFilter, setGroupFilter] = useState("");
    const groups = [
        ...new Set(
            announcements
                .map((announcement) => announcement.groupName)
                .filter(Boolean)
        )
    ];

    const [showPublishedModal, setShowPublishedModal] = useState(false);
    const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);

    useEffect(() => {
        fetch("/api/admin/announcements", {
            credentials: "include",
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error("お知らせ一覧の取得に失敗しました");
                }

                return response.json();
            })
            .then(data => {
                setAnnouncements(data);
            })
            .catch(error => {
                console.error(error);
            });

    }, []);

    // 更新日表示用に整形
    const formatDateTime = (dateTime) => {
        if (!dateTime) {
            return "";
        }

        const [date, time] = dateTime.split("T");

        return `${date.replaceAll("-", "/")} ${time.slice(0, 5)}`;
    };

    // 表示絞込み
    const filteredAnnouncements = announcements.filter((announcement) => {
        return (
            (
                announcementFilter !== "publishing" ||
                announcement.isPublished === true
            ) &&
            (
                groupFilter === "" ||
                announcement.groupName === groupFilter
            )
        );
    });

    // 表示・非表示をトグルスイッチで制御
    const handlePublishedToggle = (announcement) => {
        setSelectedAnnouncement(announcement);
        setShowPublishedModal(true);
    };

    // 表示・非表示トグルスイッチの表示出し分け
    const canEditPublished = (announcement) =>
        (admin.role === "ROLE_ADMIN" &&
            announcement.groupId === admin.groupId) ||
        (admin.role === "ROLE_SUPER_ADMIN" &&
            announcement.groupId === null);

    // 表示・非表示だけ一覧画面から変更する
    const handlePublishedConfirm = async () => {
        if (!selectedAnnouncement) return;

        const newPublished = !selectedAnnouncement.isPublished;

        try {
            const response = await fetch(
                `/api/admin/announcements/${selectedAnnouncement.announcementId}/publish`,
                {
                    method: "PATCH",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        isPublished: newPublished,
                    }),
                }
            );

            if (!response.ok) {
                alert("公開状態の変更に失敗しました");
                return;
            }

            setShowPublishedModal(false);

            setAnnouncements((prev) =>
                prev.map((announcement) =>
                    announcement.announcementId ===
                    selectedAnnouncement.announcementId
                        ? {
                            ...announcement,
                            isPublished: newPublished,
                        }
                        : announcement
                )
            );

            setSelectedAnnouncement(null);

        } catch (error) {
            console.error("公開状態の変更に失敗しました", error);
            alert("公開状態の変更に失敗しました");
        }
    };

    return (
        <section className="admin-container">
            <h1>お知らせ一覧</h1>
            <header>
                {admin.role === "ROLE_ADMIN" && (
                    <p>
                        全体向けのお知らせは閲覧のみ可能です（編集はできません）
                    </p>
                )}

                {admin.role === "ROLE_SUPER_ADMIN" && (
                    <p>
                        各山車組のお知らせは閲覧のみ可能です（編集はできません）
                    </p>
                )}
            </header>
            <div className="filter-box">
                <h2>絞込表示</h2>
                <div className="filter-inner-box">
                    <h3>表示・非表示で絞込み</h3>
                    <button
                        type="button"
                        className={`${
                            announcementFilter === "" ? "filter-btn-active" : "filter-btn"
                        }`}
                        onClick={() => setAnnouncementFilter("")}
                    >
                        非表示を含むすべて
                    </button>

                    <button
                        type="button"
                        className={`${
                            announcementFilter === "publishing"
                                ? "filter-btn-active"
                                : "filter-btn"
                        }`}
                        onClick={() => setAnnouncementFilter("publishing")}
                    >
                        表示中のみ
                    </button>
                </div>

                {admin.role === "ROLE_SUPER_ADMIN" && (
                    <div className="filter-inner-box">
                        <h3>山車組で絞込み</h3>

                        <button
                            type="button"
                            className={`${
                                groupFilter === "" ? "filter-btn-active" : "filter-btn"
                            }`}
                            onClick={() => setGroupFilter("")}
                        >
                            すべて
                        </button>

                        {groups.map((group) => (
                            <button
                                key={group}
                                type="button"
                                className={`${
                                    groupFilter === group ? "filter-btn-active" : "filter-btn"
                                }`}
                                onClick={() => setGroupFilter(group)}
                            >
                                {group}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            <div className="table-container">
                <div className="add-btn-area">
                    <button
                        type="button"
                        onClick={() => navigate("/admin/announcements/register")}
                        className="btn-sub"
                    >
                        ＋お知らせを追加する
                    </button>
                </div>

                <table className="table">
                    <thead>
                    <tr>
                        <th>表示・非表示</th>
                        <th>公開範囲</th>
                        <th>タイトル</th>
                        <th>お知らせ内容</th>
                        <th>最終更新者</th>
                        <th>更新日時</th>
                        <th>編集</th>
                    </tr>
                    </thead>
                    <tbody>
                    {filteredAnnouncements.map((announcement) => (
                        <tr
                            key={announcement.announcementId}
                            className={`table-row ${
                                !announcement.isPublished
                                    ? "is-canceled"
                                    : ""
                            }`}
                            onClick={() => navigate(`/admin/announcements/${announcement.announcementId}`)}
                        >
                            <td
                                onClick={(e) => e.stopPropagation()}
                                className={`toggle-box ${
                                    announcement.isPublished
                                        ? "text-secondary font-semibold"
                                        : "text-warn font-semibold"
                                }`}
                            >
                                <div className="toggle-content">
                                    {canEditPublished(announcement) && (
                                        <label className="toggle-btn">
                                            <input
                                                type="checkbox"
                                                checked={announcement.isPublished}
                                                onChange={() => handlePublishedToggle(announcement)}
                                            />
                                        </label>
                                    )}

                                    <p>
                                        {announcement.isPublished ? "表示中" : "非表示中"}
                                    </p>
                                </div>
                            </td>
                            {/*公開範囲*/}
                            <td>
                                {announcement.groupName ? (
                                    <span>{announcement.groupName}のみ</span>
                                ) : (
                                    <span className="text-info">全体</span>
                                )}
                            </td>
                            <td>{announcement.title}</td>
                            <td>{announcement.content}</td>
                            <td>{announcement.updatedBy}</td>
                            <td>{formatDateTime(announcement.updatedAt)}</td>
                            <td
                                onClick={(e) => e.stopPropagation()}
                                className="text-center"
                            >
                                {(
                                    (admin.role === "ROLE_ADMIN" &&
                                        announcement.groupId === admin.groupId)
                                    ||
                                    (admin.role === "ROLE_SUPER_ADMIN" &&
                                        announcement.groupId === null)
                                ) ? (
                                    <Link
                                        to={`/admin/announcements/${announcement.announcementId}/edit`}
                                        state={{ from: "list" }}
                                        className="icon-edit"
                                    >
                                        <Pencil size={18} />
                                    </Link>
                                ) : (
                                    <span className="text-center" title="閲覧のみ可能です">
                                        <Eye size={18} />
                                    </span>
                                )}
                            </td>
                        </tr>
                    ))}
                    </tbody>

                </table>
            </div>

            {/* 公開状態変更確認モーダル */}
            {showPublishedModal && selectedAnnouncement && (
                <div className="modal-overlay">
                    <div className="modal-box">

                        <h2>お知らせの公開状態を変更します</h2>

                        <p>
                            このお知らせを
                            <strong className="text-warn">
                            {selectedAnnouncement.isPublished
                                ? "非表示"
                                : "表示"
                            }
                            </strong>
                            にしてもよろしいですか？
                        </p>

                        <div className="modal-action">

                            <button
                                className="btn-back"
                                onClick={() => {
                                    setShowPublishedModal(false);
                                    setSelectedAnnouncement(null);
                                }}
                            >
                                戻る
                            </button>

                            <button
                                className="btn-primary"
                                onClick={handlePublishedConfirm}
                            >
                                {selectedAnnouncement.isPublished
                                    ? "非表示にする"
                                    : "表示する"
                                }
                            </button>

                        </div>
                    </div>
                </div>
            )}

        </section>
    );

}

export default AdminAnnouncements;