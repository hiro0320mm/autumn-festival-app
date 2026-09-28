import { useState } from "react";
import { useNavigate } from 'react-router-dom'

function MyPageLogin() {
    const [loginError, setLoginError] = useState(false);
    const navigate = useNavigate()

    const login = async (event) => {
        event.preventDefault();
        setLoginError(false);

        const formData = new FormData(event.currentTarget);

        const body = {
            applicantName: formData.get("applicantName"),
            tel: formData.get("tel"),
            receptionNumber: formData.get("receptionNumber"),
        };

        try {
            const response = await fetch("/api/mypage/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify(body),
            });

            const data = await response.json();

            if (!response.ok) {
                setLoginError(true);
                return;
            }

            window.location.href = "/mypage";

        } catch {
            setLoginError(true);
        }
    };

    return (
        <section className="mypage-container">
            <h1 className="contents-title">マイページログイン</h1>
            <span> お名前・電話番号・申込受付番号を入力してください。 </span>

            <form onSubmit={login} className="optional-box mt-1"> {
                loginError && (
                    <p> 入力された情報が正しくありません。</p>
                )
            }

                <label>お名前
                    <input name="applicantName" type="text" placeholder="お名前を入力してください" required/>
                </label>
                <label>電話番号
                    <input name="tel" type="tel" placeholder="電話番号を入力してください" required/>
                </label>
                <label>申込受付番号
                    <input name="receptionNumber" type="text" placeholder="申込受付番号を入力してください" required/>
                </label>
                <p className="complement">※申込受付番号は、申込完了画面または申込完了メールをご確認ください</p>
                <div className="flex justify-center">
                    <button type="submit" className="btn-apply">ログイン</button>
                </div>
            </form>
            <button onClick={() => navigate('/')} className="btn-back mx-auto">
                山車組選択画面へ戻る
            </button>
        </section>
);
}

export default MyPageLogin;