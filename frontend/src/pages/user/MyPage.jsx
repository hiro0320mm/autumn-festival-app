import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ChevronDown } from 'lucide-react';

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
        <section className="mypage-container">
            <h1 className="contents-title">参加者マイページ</h1>

            {applicant?.cancelStatus === "REQUESTED" && (
                <p className="text-error">キャンセル承認待ちです</p>
            )}

            <div className="announcements-list optional-box">
                <h3 className="mb-05">新着お知らせ</h3>
                {announcements.slice(0,3).map((announcement) => (
                    <details key={announcement.announcementId}>
                        <summary>
                            <span className="date">{formatDate(announcement.updatedAt)}</span>
                            <span className="author"> — {announcement.updatedBy}</span>
                            <strong className="title">{announcement.title}</strong>
                            <span className="icon"><ChevronDown /></span>
                        </summary>
                        <p className="whitespace-pre-wrap">
                        {getPreviewContent(announcement.content)}
                        {isLongContent(announcement.content) && (
                            <Link
                                to="/mypage/announcements"
                                state={{ announcementId: announcement.announcementId }}
                            >
                                続きを見る
                            </Link>
                        )}
                        </p>
                    </details>
                ))}
                <Link to="/mypage/announcements" className="btn-outline-sub block-right">一覧を見る</Link>
            </div>
            <h2 className="text-center">お申込み内容</h2>

            {applicant && (
                <div>
                    <div className="group-name">
                        <h3>参加山車組・ポジション</h3>
                        <p>{applicant.groupName}・{applicant.positionName}</p>
                    </div>

                    <table>
                        <tbody>
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
                    <button
                        onClick={() => window.location.href = "/mypage/edit"}
                        className="btn-outline-sub block-right"
                    >
                        編集する
                    </button>

                    <ul className="complement mt-2">
                        <li>参加する山車組およびポジションはマイページからは変更できません。<br />
                            山車組・ポジションの変更をご希望の方は、一度キャンセルしてから改めて参加申込をお願いします</li>
                        <li className="complements text-warn">このページからキャンセルした場合、山車組の担当者が受理した時点でキャンセル確定となります。<br />
                            <u>直前（開催まで1週間以内）のキャンセルは、山車組の事務所へ直接電話連絡をお願いします</u></li>
                    </ul>

                    {/*キャンセル依頼中の場合はキャンセルボタンを非表示*/}
                    {applicant.cancelStatus === "NONE" && (
                        <button
                            onClick={() =>
                                navigate("/mypage/cancel", {
                                    state: {applicant}
                                })
                            }
                            className="btn-apply mt-2"
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