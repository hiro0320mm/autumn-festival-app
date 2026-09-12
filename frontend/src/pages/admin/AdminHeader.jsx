import { useNavigate } from "react-router-dom";

function AdminHeader() {
    const navigate = useNavigate();

    const handleLogout = async () => {
        await fetch("/api/logout", {
            method: 'POST',
        });

        navigate("/api/admin/login");
    };

    return (
        <header>
            <h1>秋まつり参加申込システム 管理画面</h1>

            <button onClick={() => navigate("/admin/applicants")} className="btn btn-primary">
                申込者管理
            </button>

            <button
                onClick={handleLogout}
                className="btn btn-primary"
            >
                ログアウト
            </button>
        </header>
    );
}

export default AdminHeader;