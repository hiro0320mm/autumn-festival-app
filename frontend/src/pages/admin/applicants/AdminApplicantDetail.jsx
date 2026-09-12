import { useEffect, useState } from "react";
import {Link, useLocation, useParams} from "react-router-dom";

function AdminApplicantDetail() {
    const { applicantId } = useParams();
    const location = useLocation();
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
                    <Link to={`/admin/applicants/${applicant.applicantId}/edit`}>
                        編集
                    </Link>
                </div>
            )}
        </div>
    );
}

export default AdminApplicantDetail;