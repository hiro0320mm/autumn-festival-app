import { useState } from "react";
import { useNavigate } from "react-router-dom";

function AdminLogin() {
    const [staffName, setStaffName] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();

        setError("");

        try {
            const response = await fetch("/api/admin/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
                credentials: "include",
                body: new URLSearchParams({
                    staffName,
                    password,
                }),
            });

            if (!response.ok) {
                setError("ログインに失敗しました。");
                return;
            }

            const data = await response.json();

            if (data.authenticated) {
                navigate("/admin");
            } else {
                setError("ログインに失敗しました。");
            }

        } catch (error) {
            console.error(error);
            setError("通信に失敗しました。");
        }
    };

    return (
        <div>
            <h1>管理者ログイン</h1>

            <form onSubmit={handleSubmit}>

                <div>
                    <label>
                        ユーザー名
                        <input
                            type="text"
                            value={staffName}
                            onChange={(event) => setStaffName(event.target.value)}
                        />
                    </label>
                </div>

                <div>
                    <label>
                        パスワード
                        <input
                            type="password"
                            value={password}
                            onChange={(event) => setPassword(event.target.value)}
                        />
                    </label>
                </div>

                {error && (
                    <p>{error}</p>
                )}

                <button type="submit">
                    ログイン
                </button>

            </form>
        </div>
    );
}

export default AdminLogin;