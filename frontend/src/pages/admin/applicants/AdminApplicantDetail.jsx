import { useEffect, useState } from "react";
import {Link, useLocation, useNavigate, useParams} from "react-router-dom";

function AdminApplicantDetail() {
    const { applicantId } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const message = location.state?.message;

    const [applicant, setApplicant] = useState(null);
    const [error, setError] = useState("");

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showCancelModal, setShowCancelModal] = useState(false);

    useEffect(() => {
        fetch(`/api/admin/applicants/${applicantId}`, {
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
                setApplicant(data);
            })
            .catch(error => {
                console.error(error);
                setError(error.message);
            });
    }, [applicantId]);

    const handleDelete = async () => {

        try {
            const response = await fetch(
                `/api/admin/applicants/${applicantId}`,
                {
                    method: "DELETE",
                    credentials: "include",
                }
            );

            if (!response.ok) {
                const data = await response.json();
                return;
            }

            setShowDeleteModal(false);
            navigate("/admin/applicants", {
                state: { message: "申込者を削除しました" }
            });

        } catch {
            setError("申込者の削除に失敗しました");
        }
    };

    // 直接キャンセル
    const handleCancel = async () => {

        const response = await fetch(
            `/api/admin/applicants/${applicantId}/cancel`,
            {
                method: "PUT",
                credentials: "include",
            }
        );

        if (response.ok) {
            setShowCancelModal(false);
            navigate(`/admin/applicants/${applicantId}`, {
                state: {
                    message: "申込をキャンセルしました"
                }
            });
            return;
        }

        alert("キャンセルに失敗しました");
    };

    // キャンセル承認
    const handleApproveCancel  = async () => {

        const response = await fetch(
            `/api/admin/applicants/${applicantId}/approve`,
            {
                method: "PUT",
                credentials: "include",
            }
        );

        if (response.ok) {
            setShowCancelModal(false);
            navigate(`/admin/applicants/${applicantId}`, {
                state: {
                    message: "キャンセル依頼を承認しました"
                }
            });
            return;
        }

        alert("キャンセル承認に失敗しました");
    };

    const formatDateTime = (dateTime) => {
        if (!dateTime) {
            return "";
        }

        const [date, time] = dateTime.split("T");

        return `${date.replaceAll("-", "/")} ${time.slice(0, 5)}`;
    };

    return (
        <section>
            <h1>参加申込者詳細情報</h1>
            <header>
                <div>
                    {applicant &&
                        <p className="text-2xl font-bold text-app-secondary">申込受付番号：{applicant.receptionNumber}</p>
                    }
                </div>
                <div className="message-box">
                    {error && <p>{error}</p>}
                    {message && <p>{message}</p>}
                    {applicant?.cancelStatus === "REQUESTED" && (
                        <>
                            <h2>キャンセル承認待ちの状態です</h2>
                            <p>申込内容をご確認のうえ、間違いがなければキャンセル承認処理を行ってください。</p>
                        </>
                    )}

                    {applicant?.cancelStatus === "CANCELED" && (
                        <div>
                            <h2>この申込者はキャンセル済みです</h2>
                        </div>
                    )}
                </div>
                {applicant &&(
                    <div className="update-history">
                        <p>登録日時：{formatDateTime(applicant.createdAt)}</p>
                        <p>登録者：{applicant.createdBy}</p>
                        <p>最終更新日：{formatDateTime(applicant.updatedAt)}</p>
                        <p>最終更新者：{applicant.updatedBy}</p>
                    </div>
                )}
            </header>

            {applicant && (
                <>
                    <table className="table">
                        <tbody
                            className={
                                applicant.cancelStatus === "CANCELED"
                                ? "bg-base-300"
                                    : ""
                            }
                        >
                            <tr>
                                <th className="w-50">お名前</th>
                                <td>{applicant.applicantName}</td>
                            </tr>
                            <tr>
                                <th>ふりがな</th>
                                <td>{applicant.kana}</td>
                            </tr>
                            <tr>
                                <th>年齢</th>
                                <td>{applicant.age}</td>
                            </tr>
                            <tr>
                                <th>ポジション</th>
                                <td>{applicant.positionName}</td>
                            </tr>
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
                            <tr>
                                <th>保護者名</th>
                                <td>{applicant.parentName}</td>
                            </tr>
                            <tr>
                                <th>学校名</th>
                                <td>{applicant.schoolName}</td>
                            </tr>
                            <tr>
                                <th>学年・クラス</th>
                                <td>{applicant.schoolGrade && applicant.schoolClass &&
                                    `${applicant.schoolGrade} 年 ${applicant.schoolClass} 組`}</td>
                            </tr>
                            <tr>
                                <th>特記事項</th>
                                <td>{applicant.note}</td>
                            </tr>
                            <tr>
                                <th>担当者メモ</th>
                                <td>{applicant.staffMemo}</td>
                            </tr>
                        </tbody>
                    </table>
                    <div className="flex justify-center my-10">
                        <button
                            className="submit-btn"
                            onClick={() =>
                                navigate(`/admin/applicants/${applicant.applicantId}/edit`, {
                                    state: { from: "detail" }
                                })
                            }
                        >
                            編集する
                        </button>
                    </div>
                    <nav className="flex justify-between">
                        <button
                            type="button"
                            className="back-to-btn"
                            onClick={() => { navigate("/admin/applicants") }}
                        >
                            ← 申込者一覧に戻る
                        </button>

                        <div className="flex gap-x-10">
                            {applicant.cancelStatus === "NONE" && (
                                <button type="button" onClick={() => setShowCancelModal(true)}>
                                    キャンセル
                                </button>
                            )}

                            {applicant.cancelStatus === "REQUESTED" && (
                                <button type="button" onClick={handleApproveCancel}>
                                    キャンセルを承認
                                </button>
                            )}

                            {applicant.cancelStatus === "CANCELED" && (
                                <p>キャンセル済み</p>
                            )}

                            <button
                                type="button"
                                onClick={() => setShowDeleteModal(true)}
                                className="warning-btn"
                            >
                                削除
                            </button>
                        </div>
                    </nav>
                </>
            )}

            {/*  削除確認モーダル  */}
            {showDeleteModal && (
                <div className="modal modal-open">
                    <div className="modal-box">

                        <h2 className="text-lg font-bold">
                            {applicant && (`${applicant.applicantName}さんの申込を削除します`)}
                        </h2>

                        <p className="py-4">
                            この申込者を削除してもよろしいですか？
                        </p>

                        <div className="modal-action">

                            <button
                                className="back-to-btn"
                                onClick={() => setShowDeleteModal(false)}
                            >
                                戻る
                            </button>

                            <button
                                className="btn btn-error"
                                onClick={handleDelete}
                            >
                                削除を実行する
                            </button>

                        </div>
                    </div>
                </div>
            )}

            {/*  キャンセル確認モーダル  */}
            {showCancelModal && (
                <div className="modal modal-open">
                    <div className="modal-box">
                        <h2 className="text-lg font-bold">
                            {applicant && (`${applicant.applicantName}さんの申込をキャンセルします`)}
                        </h2>

                        <p className="py-4">
                            この申込をキャンセルしてもよろしいですか？
                        </p>

                        <div className="modal-action">
                            <button
                                className="back-to-btn"
                                onClick={() => setShowCancelModal(false)}
                            >
                                戻る
                            </button>

                            <button
                                className="btn btn-error"
                                onClick={handleCancel}
                            >
                                キャンセルする
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </section>

    );
}

export default AdminApplicantDetail;