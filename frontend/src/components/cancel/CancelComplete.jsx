import { useLocation, useNavigate, Link } from "react-router-dom";

function CancelComplete() {

    const location = useLocation();
    const navigate = useNavigate();

    const applicantName = location.state?.applicantName;

    if (!applicantName) {
        navigate("/mypage");
        return null;
    }

    return (
        <>
            <h1>キャンセル受付完了</h1>

            <p>{applicantName}さんの<br />キャンセル依頼を受け付けました。</p>

            <p>
                山車組担当者の確認後、キャンセル完了メールをお送りします。<br />
                確認までお時間をいただく場合がございますが、ご了承ください。<br />
                再度参加を希望される方は、<Link to="/">秋祭り参加申込システムトップページ</Link>より改めてお手続きください。
            </p>

            <button onClick={() => navigate("/mypage")} className="btn btn-primary">
                マイページへ戻る
            </button>
        </>
    );
}

export default CancelComplete;