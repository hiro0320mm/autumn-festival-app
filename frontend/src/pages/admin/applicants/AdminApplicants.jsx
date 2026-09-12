import { useEffect, useState } from "react";
import {Link} from "react-router-dom";

function AdminApplicants() {
    const [applicants, setApplicants] = useState([]);

    useEffect(() => {
        fetch("/api/admin/applicants", {
            credentials: "include",
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error("申込者一覧の取得に失敗しました");
                }

                return response.json();
            })
            .then(data => {
                setApplicants(data);
            })
            .catch(error => {
                console.error(error);
            });
    }, []);

    return (
        <div>
            <h1>申込者管理</h1>

            {applicants.map(applicant => (
                <div key={applicant.applicantId}>
                    <p>受付番号：{applicant.receptionNumber}</p>
                    <Link to={`/admin/applicants/${applicant.applicantId}`}><p>氏名：{applicant.applicantName}</p></Link>
                    <p>ふりがな：{applicant.kana}</p>
                    <p>年齢：{applicant.age}</p>
                    <p>ポジション：{applicant.positionName}</p>
                    <Link to={`/admin/applicants/${applicant.applicantId}/edit`}>
                        編集
                    </Link>
                    <hr />
                </div>
            ))}
        </div>
    );
}

export default AdminApplicants;