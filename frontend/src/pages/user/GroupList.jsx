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
    }, []);

    return (
        <section id="top">
            {/*<!-- Reactここから -->*/}
            <div id="mv">
                <div className="title-wrapper">
                    <h1>秋祭り参加申込システム</h1>
                    <p>山車組に参加して、<br />秋まつりを一緒に楽しもう！</p>
                    <Link
                        to="/mypage/login"
                        className="btn-apply mx-auto text-center"
                    >
                        お申込み済みの方はこちら
                        <span className="text-small text-block">マイページへログイン</span>
                    </Link>
                    <div className="schedule pc_only">
                        <h2>令和9年度 開催日程</h2>
                        <dl>
                            <dt>前夜祭</dt>
                            <dd>2027年9月〇〇日(木) 18時～</dd>
                            <dt>お通り</dt>
                            <dd>2027年9月〇〇日(金) 16時～</dd>
                            <dt>中日</dt>
                            <dd>2027年9月〇〇日(土) 14時～</dd>
                            <dt>お還り</dt>
                            <dd>2027年9月〇〇日(日) 14時～</dd>
                        </dl>
                    </div>
                    <div className="scroll-arrow-wrapper">
                        <a href="#howToJoin" className="scroll-arrow">
                            <span className="scroll-arrow-text">Scroll</span>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="lucide lucide-chevron-down preview-icon arrow"
                            >
                                <path d="m6 9 6 6 6-6" />
                            </svg>
                        </a>
                    </div>
                </div>
            </div>
            <div id="howToJoin">
                <h2>参加方法<span>How To Join</span></h2>
                <p>
                    山車組一覧から参加したい組を選択し、申込フォームに必要事項を入力してください。
                </p>
                <p className="complement">
                    ※一覧に表示されていない山車組や神輿組への参加をご希望の場合は、お手数ですが各山車組・神輿組までお問合せください。
                </p>
            </div>
            <div id="groupList">
                <h2>山車組一覧<span>Group List</span></h2>
                <p className="text-center">現在参加者募集中の山車組一覧です</p>
                <div className="group-list-wrapper">
                    {groups.map(group => (
                    <div key={group.groupId} className="group-list-item">
                        <img
                            src={`/images/group-photo-${group.groupId}.webp`}
                            alt={`${group.groupName}の写真`}
                        />
                        <div className="group-list-item-content">
                            <h3>{group.groupName}</h3>
                            <h4>募集中のポジション</h4>
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
                            className="btn-apply"
                        >
                            {group.groupName}に参加を申し込む
                        </Link>
                    </div>
                    ))}
                </div>
            </div>
        </section>
    )
}


export default GroupList;
