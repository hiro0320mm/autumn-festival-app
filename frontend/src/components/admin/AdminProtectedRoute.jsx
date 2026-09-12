import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

function AdminProtectedRoute({ children }) {
    const [isAuthenticated, setIsAuthenticated] = useState(null);

    useEffect(() => {
        fetch("/api/admin/me", {
            credentials: "include",
        })
            .then(response => {
                if (response.ok) {
                    setIsAuthenticated(true);
                } else {
                    setIsAuthenticated(false);
                }
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
    return children;
}

export default AdminProtectedRoute;