import { useLocation, useNavigate, Link } from "react-router-dom";

function CancelConfirm() {

    const location = useLocation();
    const navigate = useNavigate();

    // 申込者が見つからなかった場合はundefinedにする
    const applicant = location.state?.applicant;

    // URL直打ちの場合はマイページへ戻す
    if (!applicant) {
        navigate("/mypage");
        return null;
    }

    const handleCancel = async () => {

        const response = await fetch("/api/mypage/request", {
            method: 'PUT',
            credentials: "include",
        });

        if (response.ok) {
            navigate("/mypage/cancel/complete", {
                state: {
                applicantName: applicant.applicantName
                }
            });
            return;
        }

        alert("キャンセル依頼に失敗しました");
    };

    return (
        <>
            <h1>下記の申込をキャンセルします</h1>

            <p>参加山車組：{applicant.groupName}</p>
            <p>ポジション：{applicant.positionName}</p>
            <p>お名前：{applicant.applicantName}</p>
            <p>フリガナ：{applicant.kana}</p>
            <p>年齢：{applicant.age}歳</p>

            <h2>キャンセル前にご確認ください（注意事項）</h2>
            <ul>
                <li>キャンセルは取り消すことができません。</li>
                <li>再度参加申込を行う場合は<Link to={"/"}>「秋祭り参加申込システム」トップページ</Link>から改めてお手続きをお願いします。</li>
            </ul>

            <button onClick={handleCancel} className="btn btn-primary">
                キャンセルを確定
            </button>

            <button
                onClick={() => navigate("/mypage")}
                className="btn btn-primary"
            >
                キャンセルしない
            </button>
        </>
    );
}

export default CancelConfirm;