import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";

function AdminLogin() {
    const [staffName, setStaffName] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const [showPassword, setShowPassword] = useState(false);

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
        <section className="w-fit mx-auto">
            <h1>管理者ログイン</h1>

            <form onSubmit={handleSubmit}>
                {error && (
                    <p className="text-error font-medium mb-5">{error}</p>
                )}
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
                        <div className="relative">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                autoComplete="current-password"
                                placeholder="********"
                                value={password}
                                className="relative"
                                onChange={(event) => setPassword(event.target.value)}
                                requied
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword((prev) => !prev)}
                                className="show-password-toggle"
                                aria-label={
                                    showPassword ? "パスワードを隠す" : "パスワードを表示"
                                }
                            >
                                {showPassword ? (<EyeOff className="size-4" />) : (<Eye className="size-4" />)}
                            </button>
                        </div>
                    </label>
                </div>

                <div className="flex justify-center">
                    <button type="submit" className="submit-btn">
                        ログイン
                    </button>
                </div>

            </form>
        </section>
    );
}

export default AdminLogin;