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
            <h1>秋まつり参加申込システム<br className="sp_only" />マイページ</h1>

            <button
                onClick={handleLogout}
                className="btn-outline"
            >
                ログアウト
            </button>
        </header>
    );
}

export default MyPageHeader;