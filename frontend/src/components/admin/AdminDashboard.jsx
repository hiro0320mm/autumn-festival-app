import { Link } from "react-router-dom";
import { useAdmin } from "./AdminContext";

function AdminDashboard() {

    const admin = useAdmin();

    return (
        <section className="grid grid-cols-3 gap-6">
            <Link to="/admin/applicants" className="dashboard-card">
                <div>
                    <h2>参加申込者管理</h2>
                    <p>参加申込者の管理を行います</p>
                    <ul>
                        <li>申込者の確認</li>
                        <li>ポジション別申込状況の確認</li>
                        <li>申込者登録</li>
                        <li>申込キャンセル</li>
                        <li>申込内容編集</li>
                        <li>申込内容削除</li>
                    </ul>
                </div>
            </Link>

            <Link to="/admin/positions" className="dashboard-card">
                <div>
                    <h2>募集ポジション管理</h2>
                    <p>募集ポジションの管理を行います</p>
                    <ul>
                        <li>登録済みポジションの確認</li>
                        <li>ポジション登録</li>
                        <li>ポジション情報編集</li>
                    </ul>
                </div>
            </Link>

            <Link to="/admin/groups" className="dashboard-card">
                <div>
                    <h2>山車組情報管理</h2>
                    <p>山車組情報の管理を行います</p>
                    <ul>
                        <li>山車組情報の確認</li>
                        <li>山車組情報の編集</li>
                    </ul>
                </div>
            </Link>
        </section>
    );

}

export default AdminDashboard;