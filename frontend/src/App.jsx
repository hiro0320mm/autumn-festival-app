import { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import './App.css'
import ApplyForm from './components/ApplyForm'
import ApplyConfirm from "./components/ApplyConfirm.jsx";
import ApplyComplete from "./components/ApplyComplete.jsx";
import MyPageLogin from "./pages/user/MyPageLogin.jsx";
import MyPage from "./pages/user/MyPage.jsx";
import MyPageEdit from "./pages/user/MyPageEdit.jsx";
import MyPageLayout from "./pages/user/MyPageLayout.jsx";

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

            </Routes>
        </BrowserRouter>
    )
}

export default App