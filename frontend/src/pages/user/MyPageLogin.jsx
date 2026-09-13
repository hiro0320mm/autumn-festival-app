import { useState } from "react";

function MyPageLogin() {
    const [loginError, setLoginError] = useState(false);

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
        <section className="w-fit mx-auto">
            <h1>マイページログイン</h1>
            <p> お名前・電話番号・申込受付番号を入力してください。 </p>

            <form onSubmit={login}> {
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
                    <span
                        className="block text-sm font-normal mb-10">申込受付番号は、申込完了画面または申込完了メールをご確認ください</span>
                </label>
                <div className="flex justify-center">
                    <button type="submit">ログイン</button>
                </div>
            </form>
        </section>
);
}

export default MyPageLogin;