import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function MyPage() {

    const [applicant, setApplicant] = useState(null);
    const [error, setError] = useState(false);
    const navigate = useNavigate();

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
                console.log(data);

                setApplicant(data);

            } catch {
                setError(true);
            }
        };

        getMyPage();
    }, [navigate]);

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

    return (
        <>
            <h1>マイページ</h1>


            {applicant && (
                <div>
                    {applicant.cancelStatus === "REQUESTED" && (
                        <p>キャンセル承認待ちです</p>
                    )}
                    <h2>申込情報</h2>

                    <p>山車組：{applicant.groupName}</p>
                    <p>ポジション：{applicant.positionName}</p>

                    <p>お名前：{applicant.applicantName}</p>
                    <p>フリガナ：{applicant.kana}</p>
                    <p>年齢：{applicant.age}歳</p>

                    {applicant.parentName && (
                        <p>保護者名：{applicant.parentName}</p>
                    )}

                    <p>住所：{applicant.address}</p>
                    <p>電話番号：{applicant.tel}</p>
                    <p>メールアドレス：{applicant.email}</p>



                    <p>
                        学生：
                        {applicant.isStudent ? "はい" : "いいえ"}
                    </p>

                    {applicant.isStudent && (
                        <>
                            <p>学校名：{applicant.schoolName}</p>
                            <p>学年：{applicant.schoolGrade}</p>
                            <p>クラス：{applicant.schoolClass}</p>
                        </>
                    )}

                    <p>連絡事項：{applicant.note}</p>

                    <button
                        onClick={() => window.location.href = "/mypage/edit"}
                        className="btn btn-primary"
                    >
                        編集する
                    </button>

                    {/*キャンセル依頼中の場合はキャンセルボタンを非表示*/}
                    {applicant.cancelStatus === "NONE" && (
                        <button
                            onClick={() =>
                                navigate("/mypage/cancel", {
                                    state: { applicant }
                                })
                            }
                            className="btn btn-primary"
                        >
                            キャンセルする
                        </button>
                    )}

                </div>

            )}
            <button
                onClick={handleLogout}
                className="btn btn-primary"
            >
                ログアウト
            </button>
        </>
    );
}

export default MyPage;