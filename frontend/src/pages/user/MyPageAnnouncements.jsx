import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {ChevronDown} from "lucide-react";

function MyPageAnnouncements() {

    const [announcements, setAnnouncements] = useState([]);
    const [error, setError] = useState(false);

    const location = useLocation();
    const announcementId = location.state?.announcementId;

    const navigate = useNavigate();

    useEffect(() => {

            const getAnnouncements = async () => {
                try {
                    const response = await fetch("/api/mypage/announcements", {
                        credentials: "include",
                    });

                    if (!response.ok) {
                        setError(true);
                        return;
                    }

                    const data = await response.json();

                    setAnnouncements(data);

                } catch {
                    setError(true);
                }
            };

            getAnnouncements();

        }, []);

    // 更新日表示用に整形
    const formatDate = (dateTime) => {
        if (!dateTime) {
            return "";
        }

        return dateTime.replaceAll("-", "/").slice(0, 10);
    };

    return(
        <section className="mypage-container">
            <h1 className="contents-title">お知らせ一覧</h1>
            <div className="announcements-list">
                {announcements.map((announcement) => (
                    <details key={announcement.announcementId} open={announcement.announcementId === announcementId}>
                        <summary>
                            <span className="date">{formatDate(announcement.updatedAt)}</span>
                            <span className="author"> — {announcement.updatedBy}</span>
                            <strong className="title">{announcement.title}</strong>
                            <span className="icon"><ChevronDown /></span>
                        </summary>
                        <p className="whitespace-pre-wrap">
                            {announcement.content}
                        </p>
                    </details>
                ))}
            </div>
            <button
                onClick={() => navigate('/mypage')}
                className="btn-back mt-2"
            >
                マイページトップへ戻る
            </button>
        </section>
    )
}

export default MyPageAnnouncements;