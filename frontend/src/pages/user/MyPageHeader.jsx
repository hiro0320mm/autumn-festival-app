import { useNavigate } from "react-router-dom";

function MyPageHeader() {
    const navigate = useNavigate();

    const handleLogout = async () => {
        await fetch("/api/mypage/logout", {
            method: 'POST',
        });

        navigate("/");
    };

    return (
        <header>
            <h1>秋まつり参加申込システム</h1>

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