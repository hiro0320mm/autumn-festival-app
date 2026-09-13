import { useNavigate } from "react-router-dom";
import { useAdmin } from "../../components/admin/AdminContext.jsx";

function AdminHeader() {
    const navigate = useNavigate();
    const admin = useAdmin();

    const handleLogout = async () => {
        await fetch("/api/logout", {
            method: 'POST',
        });

        navigate("/admin/login");
    };

    return (
        <header>
            <h1>秋まつり参加申込システム 管理画面</h1>

            <button onClick={() => navigate("/admin/applicants")} className="btn btn-primary">
                申込者管理
            </button>

            <button onClick={() => navigate("/admin/positions")} className="btn btn-primary">
                ポジション管理
            </button>
            <span>{admin.staffName}さん</span>
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