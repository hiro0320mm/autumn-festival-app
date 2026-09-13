import {Link, Route} from "react-router-dom";
import {useEffect, useState} from "react";

function GroupList() {
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
        <section id="groupList">
            <h1>秋祭り参加申込システム</h1>
            <div>
                <p>秋まつりへの参加申込ができます</p>
                <p>一覧に表示されていない山車組や神輿組への参加をご希望の方は<br />
                    各山車組・神輿組の事務所へ直接ご連絡ください</p>
            </div>
            <Link to="/mypage/login">
                <span className="btn btn-primary fixed top-5 right-5 p-7">
                    申込済みの方はこちら<br />
                    （マイページへログイン）
                </span>
            </Link>

            <article>
                {groups.map(group => (
                    <div key={group.groupId} className="group-list-item">
                        <h2>{group.groupName}</h2>
                        <div className="position-list">
                            <h3>募集中のポジション</h3>
                            <ul>
                                {group.positions.map(position => (
                                    <li key={position.positionId}>
                                        {position.positionName}
                                    </li>
                                ))}
                            </ul>
                        </div>

                            <Link
                                to={`/apply/${group.groupId}`}
                                className="apply-btn"
                            >
                                {group.groupName}に申し込む
                            </Link>
                    </div>
                ))}
            </article>
        </section>
    )
}

export default GroupList;
