import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";

function MyPage() {

    const [applicant, setApplicant] = useState(null);
    const [announcements, setAnnouncements] = useState([]);
    const [error, setError] = useState(false);
    const navigate = useNavigate();

    const PREVIEW_LENGTH = 30;

    useEffect(() => {

        const getMyPage = async () => {
            try {
                const response = await fetch("/api/mypage", {
                    credentials: "include",
                });

                if (response.status === 401) {
                    navigate("/mypage/login");
                    return;
                }

                if (!response.ok) {
                    setError(true);
                    return;
                }

                const data = await response.json();

                setApplicant(data);

            } catch {
                setError(true);
            }
        };

        getMyPage();
    }, [navigate]);

    // お知らせを取得
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
                console.log(data);

            } catch {
                setError(true);
            }
        };

        getAnnouncements();

    }, []);

    if (error) {
        return <p>申込情報を取得できませんでした。</p>;
    }

    // Logout処理
    const handleLogout = async () => {
        const response = await fetch("/api/logout", {
            method: "POST",
            credentials: "include",
        });

        if (response.ok) {
            navigate("/");
        }
    };

    // 更新日表示用に整形
    const formatDate = (dateTime) => {
        if (!dateTime) {
            return "";
        }

        return dateTime.replaceAll("-", "/").slice(0, 10);
    };

    // 長いお知らせを省略表示
    const isLongContent = (content) => {
        return content.length > PREVIEW_LENGTH;
    };
    const getPreviewContent = (content) => {
        if (content.length <= PREVIEW_LENGTH) {
            return content;
        }

        return `${content.slice(0, PREVIEW_LENGTH)}...`;
    };

    return (
        <section>
            <h1>参加者マイページ</h1>

            {applicant?.cancelStatus === "REQUESTED" && (
                <p className="text-error text-center font-lg font-medium mb-5">キャンセル承認待ちです</p>
            )}

            <div id="AnnoucementList">
                {announcements.map((announcement) => (
                    <details key={announcement.announcementId}>
                        <summary>
                            <span>{formatDate(announcement.updatedAt)}</span>
                            <strong className="pl-3">{announcement.title}</strong>
                            <span className="text-sm"> — {announcement.updatedBy}</span>
                        </summary>
                        <div>
                            {getPreviewContent(announcement.content)}
                            {isLongContent(announcement.content) && (
                                <Link
                                    to="/mypage/announcements"
                                    state={{ announcementId: announcement.announcementId }}
                                >
                                    続きを見る
                                </Link>
                            )}
                        </div>
                    </details>
                ))}
                <Link to="/mypage/announcements">一覧を見る</Link>
            </div>
            <p className="my-5 text-center">お申込み内容は下記の通りです</p>

            {applicant && (
                <div className="grid gap-3">
                    <div className="text-center mb-5">
                        <p>参加山車組・ポジション</p>
                        <p className="text-2xl font-semibold">{applicant.groupName}・{applicant.positionName}</p>
                    </div>

                    <table className="table">
                        <tbody>
                        <tr>
                            <th className="w-50 border-b text-lg">参加者情報</th>
                            <td className="border-b text-right">
                                <button
                                    onClick={() => window.location.href = "/mypage/edit"}
                                    className="edit-btn"
                                >
                                    編集する
                                </button>
                            </td>
                        </tr>
                        <tr>
                            <th>お名前</th>
                            <td>{applicant.applicantName}</td>
                        </tr>
                        <tr>
                            <th>よみがな</th>
                            <td>{applicant.kana}</td>
                        </tr>
                        <tr>
                            <th>年齢</th>
                            <td>{applicant.age}歳</td>
                        </tr>

                        {applicant.parentName && (
                            <tr>
                                <th>保護者名</th>
                                <td>{applicant.parentName}</td>
                            </tr>
                        )}

                        <tr>
                            <th>住所</th>
                            <td>{applicant.address}</td>
                        </tr>
                        <tr>
                            <th>電話番号</th>
                            <td>{applicant.tel}</td>
                        </tr>
                        <tr>
                            <th>メールアドレス</th>
                            <td>{applicant.email}</td>
                        </tr>
                        {applicant.isStudent && (
                            <>
                                <tr>
                                    <th>学校名</th>
                                    <td>{applicant.schoolName}</td>
                                </tr>
                                <tr>
                                    <th>学年・クラス</th>
                                    <td>{applicant.schoolGrade} 年 {applicant.schoolClass} 組</td>
                                </tr>
                            </>
                        )}
                        <tr>
                            <th>連絡事項</th>
                            <td>{applicant.note}</td>
                        </tr>
                        </tbody>
                    </table>

                    <div>
                        <ul>
                            <li className="complements">参加する山車組およびポジションはマイページからは変更できません。<br />
                                山車組・ポジションの変更をご希望の方は、一度キャンセルしてから改めて参加申込をお願いします</li>
                            <li className="complements text-error font-medium">このページからキャンセルした場合、山車組の担当者が受理した時点でキャンセル確定となります。<br />
                                直前（開催まで1週間以内）のキャンセルは、山車組の事務所へ直接電話連絡をお願いします</li>
                        </ul>
                    </div>

                        {/*キャンセル依頼中の場合はキャンセルボタンを非表示*/}
                        {applicant.cancelStatus === "NONE" && (
                            <button
                                onClick={() =>
                                    navigate("/mypage/cancel", {
                                        state: {applicant}
                                    })
                                }
                                className="block max-w-3/4 mx-auto"
                            >
                                キャンセルする
                            </button>
                        )}

                </div>
                )}
        </section>
    );
}

export default MyPage;