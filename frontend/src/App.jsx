import { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import './App.css'
import ApplyForm from './components/apply/ApplyForm.jsx'
import ApplyConfirm from "./components/apply/ApplyConfirm.jsx";
import ApplyComplete from "./components/apply/ApplyComplete.jsx";
import MyPageLogin from "./pages/user/MyPageLogin.jsx";
import MyPage from "./pages/user/MyPage.jsx";
import MyPageEdit from "./pages/user/MyPageEdit.jsx";
import MyPageLayout from "./pages/user/MyPageLayout.jsx";
import CancelConfirm from "./components/cancel/CancelConfirm.jsx";
import CancelComplete from "./components/cancel/CancelComplete.jsx";
import AdminLogin from "./components/admin/AdminLogin.jsx";
import AdminDashboard from "./components/admin/AdminDashboard.jsx";
import AdminProtectedRoute from "./components/admin/AdminProtectedRoute.jsx";
import AdminLayout from "./pages/admin/AdminLayout.jsx";
import AdminApplicants from "./pages/admin/applicants/AdminApplicants.jsx";
import AdminApplicantDetail from "./pages/admin/applicants/AdminApplicantDetail.jsx";
import AdminApplicantEdit from "./pages/admin/applicants/AdminApplicantEdit.jsx";
import AdminApplicantNew from "./pages/admin/applicants/AdminApplicantNew.jsx";
import AdminPositions from "./pages/admin/positions/AdminPositions.jsx";
import AdminPositionDetail from "./pages/admin/positions/AdminPositionDetail.jsx";
import AdminPositionNew from "./pages/admin/positions/AdminPositionNew.jsx";

function App() {
    const [groups, setGroups] = useState([])

    useEffect(() => {
        fetch('/api/groups')
            .then(response => {
                return response.json()
            })
            .then(data => {
                setGroups(data)
            })
    }, [])

    return (
        <BrowserRouter>
            <Routes>
                // **** 一般ユーザー用画面 ****
                <Route
                    path="/"
                    element={
                        <div className="app">
                            <h1>秋祭り参加申込</h1>

                            {groups.map(group => (
                                <div key={group.groupId}>
                                    <p>山車組：{group.groupName}</p>

                                    <ul>
                                        {group.positions.map(position => (
                                            <li key={position.positionId}>
                                                {position.positionName}
                                            </li>
                                        ))}
                                    </ul>

                                    <Link
                                        to={`/apply/${group.groupId}`}
                                        className="btn btn-primary"
                                    >
                                        {group.groupName}に申し込む
                                    </Link>
                                </div>
                            ))}
                        </div>
                    }
                />

                // 参加申込フォーム
                <Route path="/apply/:groupId" element={<ApplyForm />} />

                // 参加申込内容確認画面
                <Route path="/apply/:groupId/confirm" element={<ApplyConfirm />} />

                // 申込完了画面
                <Route path="/apply/complete" element={<ApplyComplete />} />

                // **** 申込ユーザー画面 ****
                // マイページ：ログイン画面
                <Route path="/mypage/login" element={<MyPageLogin />} />

                // マイページ
                <Route
                    path="/mypage"
                    element={
                        <MyPageLayout>
                            <MyPage />
                        </MyPageLayout>
                    }
                />

                // マイページ：編集画面
                <Route
                    path="/mypage/edit"
                    element={
                        <MyPageLayout>
                            <MyPageEdit />
                        </MyPageLayout>
                    }
                />

                // マイページ：キャンセル確認画面
                <Route
                    path="/mypage/cancel"
                    element={<CancelConfirm />}
                />

                // キャンセル依頼完了画面
                <Route path="/mypage/cancel/complete" element={<CancelComplete />} />

                // **** 管理画面 ****
                // 管理画面：ログイン画面
                <Route path="/admin/login" element={<AdminLogin />} />

                // 管理画面：ダッシュボード
                <Route
                    path="/admin"
                    element={
                        <AdminProtectedRoute>
                            <AdminLayout>
                                <AdminDashboard />
                            </AdminLayout>
                        </AdminProtectedRoute>
                    }
                />

                // 管理画面：申込者管理
                <Route
                    path="/admin/applicants"
                    element={
                        <AdminProtectedRoute>
                            <AdminLayout>
                                <AdminApplicants />
                            </AdminLayout>
                        </AdminProtectedRoute>
                    }
                />

                // 管理画面：申込者詳細
                <Route
                    path="/admin/applicants/:applicantId"
                    element={
                        <AdminProtectedRoute>
                            <AdminLayout>
                                <AdminApplicantDetail />
                            </AdminLayout>
                        </AdminProtectedRoute>
                    }
                />

                // 管理画面：申込情報編集
                <Route
                    path="/admin/applicants/:applicantId/edit"
                    element={
                        <AdminProtectedRoute>
                            <AdminLayout>
                                <AdminApplicantEdit />
                            </AdminLayout>
                        </AdminProtectedRoute>
                    }
                />

                // 管理画面：新規申込者登録
                <Route
                    path="/admin/applicants/register"
                    element={
                        <AdminProtectedRoute>
                            <AdminLayout>
                                <AdminApplicantNew />
                            </AdminLayout>
                        </AdminProtectedRoute>
                    }
                />

                // 管理画面：ポジション管理
                <Route
                    path="/admin/positions"
                    element={
                        <AdminProtectedRoute>
                            <AdminLayout>
                                <AdminPositions />
                            </AdminLayout>
                        </AdminProtectedRoute>
                    }
                />

                // 管理画面：ポジション情報
                <Route
                    path="/admin/positions/:positionId"
                    element={
                        <AdminProtectedRoute>
                            <AdminLayout>
                                <AdminPositionDetail />
                            </AdminLayout>
                        </AdminProtectedRoute>
                    }
                />

                // 管理画面：ポジション登録
                <Route
                    path="/admin/positions/register"
                    element={
                        <AdminProtectedRoute>
                            <AdminLayout>
                                <AdminPositionNew />
                            </AdminLayout>
                        </AdminProtectedRoute>
                    }
                />

            </Routes>
        </BrowserRouter>
    )
}

export default App