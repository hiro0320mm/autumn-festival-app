import {Link, useNavigate} from "react-router-dom";
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
            <Link to="/admin"><h1>秋まつり参加申込システム 管理画面</h1></Link>

            <nav className="flex items-center gap-4">
                <button onClick={() => navigate("/admin/applicants")}>
                    申込者管理
                </button>

                <button onClick={() => navigate("/admin/positions")}>
                    ポジション管理
                </button>

                <button onClick={() => navigate("/admin/groups")}>
                    山車組情報管理
                </button>

                <span>{admin.staffName} でログイン中</span>
                <button
                    onClick={handleLogout}
                    className="logout-btn"
                >
                    ログアウト
                </button>
            </nav>
        </header>
    );
}

export default AdminHeader;