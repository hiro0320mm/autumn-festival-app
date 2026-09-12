import { useLocation, useNavigate } from 'react-router-dom'

function ApplyComplete() {
    const location = useLocation()
    const navigate = useNavigate()

    console.log("completeで受け取ったstate:", location.state)

    const {
        receptionNumber,
        applicantName,
        groupName,
        positionName,
        officeTel,
    } = location.state || {}

    return (
        <div>
        <h1>参加申込が完了しました</h1>

        <h2>申込受付番号：{receptionNumber}</h2>

        <dl>
            <dt>お名前</dt>
            <dd>{applicantName}</dd>
            <dt>参加山車組</dt>
            <dd>{groupName}</dd>
            <dt>参加ポジション</dt>
            <dd>{positionName}</dd>
        </dl>

        <p>お申込完了メールを送信しています。<br />
            届かない場合は申込んだ山車組の事務所までお問合せください</p>

        <p>{groupName} 事務所：{officeTel}</p>

        <p>申込内容はマイページからご確認いただけます。<br />
            マイページのご利用には、申込受付番号、参加される方のお名前、ご登録の電話番号が必要です<br />
            この画面をスクリーンショットで保存するか、<br />
            お申込完了メールを保存されることをおすすめします。</p>

        <button onClick={() => navigate('/')}>
            秋まつり参加申込システム<br />トップへ戻る
        </button>
    </div>
    )
}

export default ApplyComplete