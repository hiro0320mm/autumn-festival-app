import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

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
        <section>
            {announcements.map((announcement) => (
                <details key={announcement.announcementId} open={announcement.announcementId === announcementId}>
                    <summary>
                        <span>{formatDate(announcement.updatedAt)}</span>
                        <strong className="pl-3">{announcement.title}</strong>
                        <span className="text-sm"> — {announcement.updatedBy}</span>
                    </summary>
                    <div>
                        <p className="whitespace-pre-wrap">
                            {announcement.content}
                        </p>
                    </div>
                </details>
            ))}
            <button
                onClick={() => navigate('/mypage')}
                className="back-to-btn"
            >
                マイページ<br />トップへ戻る
            </button>
        </section>
    )
}

export default MyPageAnnouncements;