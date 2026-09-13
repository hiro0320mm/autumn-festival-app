import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

import AdminContext from "./AdminContext.jsx";

function AdminProtectedRoute({ children }) {
    const [admin, setAdmin] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(null);

    useEffect(() => {
        fetch("/api/admin/me", {
            credentials: "include",
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error("管理者情報の取得に失敗しました");
                }

                return response.json();
            })
            .then(data => {
                setAdmin(data);
                setIsAuthenticated(true);
            })
            .catch(() => {
                setIsAuthenticated(false);
            });
    }, []);

    // 認証状態を確認中
    if (isAuthenticated === null) {
        return <p>確認中...</p>;
    }

    // 未ログインならログイン画面へ
    if (!isAuthenticated) {
        return <Navigate to="/admin/login" replace />;
    }

    // ログイン済みなら管理画面を表示
    return (
        <AdminContext.Provider value={admin}>
            {children}
        </AdminContext.Provider>
    );
}

export default AdminProtectedRoute;