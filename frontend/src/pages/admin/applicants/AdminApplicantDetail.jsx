import { useEffect, useState } from "react";
import {Link, useLocation, useNavigate, useParams} from "react-router-dom";

function AdminApplicantDetail() {
    const { applicantId } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const message = location.state?.message;

    const [applicant, setApplicant] = useState(null);
    const [error, setError] = useState("");

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
        const confirmed = window.confirm(
            "この申込者を削除してもよろしいですか？"
        );

        if (!confirmed) {
            return;
        }

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
                setError(data.message);
                return;
            }

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
            navigate(`/admin/applicants/${applicantId}`, {
                state: {
                    message: "キャンセル依頼を承認しました"
                }
            });
            return;
        }

        alert("キャンセル承認に失敗しました");
    };

    return (
        <div>
            <h1>申込者詳細</h1>
            {error && <p>{error}</p>}
            {message && <p>{message}</p>}

            {applicant && (
                <div>
                    <p>受付番号：{applicant.receptionNumber}</p>
                    <p>氏名：{applicant.applicantName}</p>
                    <p>ふりがな：{applicant.kana}</p>
                    <p>年齢：{applicant.age}</p>
                    <p>ポジション：{applicant.positionName}</p>
                    <p>住所：{applicant.address}</p>
                    <p>電話番号：{applicant.tel}</p>
                    <p>メールアドレス：{applicant.email}</p>
                    <p>保護者名：{applicant.parentName}</p>
                    <p>学校名：{applicant.schoolName}</p>
                    <p>学年・クラス：{applicant.schoolGrade} 年 {applicant.schoolClass} 組</p>
                    <p>特記事項：{applicant.note}</p>
                    <p>担当者メモ：{applicant.staffMemo}</p>
                    <button
                        type="button"
                        className="btn btn-primary"
                        onClick={() => navigate(`/admin/applicants/${applicant.applicantId}/edit`)}
                    >
                        編集する
                    </button>

                    {applicant.cancelStatus === "NONE" && (
                        <button type="button" onClick={handleCancel}>
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

                    <button type="button" onClick={handleDelete}>
                        削除
                    </button>
                </div>
            )}
        </div>
    );
}

export default AdminApplicantDetail;