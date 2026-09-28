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
        <section className="mypage-container">
            <h1>下記の申込をキャンセルします</h1>

            <div className="text-center mb-5">
                <p>参加山車組・ポジション</p>
                <p className="text-2xl font-semibold">{applicant.groupName}・{applicant.positionName}</p>
            </div>

            <table className="table">
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
                        <td>{applicant.age} 歳</td>
                    </tr>
                </tbody>
            </table>

            <div>
                <h2 className="text-center">キャンセル前にご確認ください<br className="sp_only" />（注意事項）</h2>
                <ul className="complement">
                    <li>キャンセルは取り消すことができません。</li>
                    <li>再度参加申込を行う場合は<Link to={"/"} className="decoration-solid"><u>「秋祭り参加申込システム」トップページ</u></Link>から改めてお手続きをお願いします。</li>
                    <li className="text-warn">下のボタンを押した時点ではまだキャンセル完了とはなりません。山車組担当者が確認後、キャンセル完了となります。</li>
                    <li className="text-warn">キャンセル完了後はマイページへログインできなくなります</li>
                </ul>
            </div>
            <div>
                <button onClick={handleCancel} className="btn-apply">
                    キャンセルする
                </button>
            </div>

            <button
                onClick={() => navigate("/mypage")}
                className="btn-back mt-2"
            >
                ← キャンセルせずに戻る
            </button>
        </section>
    );
}

export default CancelConfirm;