import { useNavigate } from "react-router-dom";

function MyPageHeader() {
    const navigate = useNavigate();

    const handleLogout = async () => {
        await fetch("/api/logout", {
            method: 'POST',
        });

        navigate("/");
    };

    return (
        <header>
            <h1>秋まつり参加申込システム マイページ</h1>

            <button
                onClick={handleLogout}
                className="btn btn-primary"
            >
                ログアウト
            </button>
        </header>
    );
}

export default MyPageHeader;