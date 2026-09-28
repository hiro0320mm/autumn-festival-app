import { useLocation, useNavigate } from 'react-router-dom'

function ApplyComplete() {
    const location = useLocation()
    const navigate = useNavigate()

    const {
        receptionNumber,
        applicantName,
        groupName,
        positionName,
        officeTel,
    } = location.state || {}

    return (
        <section className="mypage-container apply-complete">
            <h1 className="contents-title">参加申込が完了しました</h1>

            <h2 className="apply-number">申込受付番号：{receptionNumber}</h2>

            <dl className="apply-data optional-box">
                <dt>お名前</dt>
                <dd>{applicantName} さん</dd>
                <dt>参加山車組</dt>
                <dd>{groupName}</dd>
                <dt>参加ポジション</dt>
                <dd>{positionName}</dd>
            </dl>

            <p className="complement">お申込完了メールを送信しています。<br />
                届かない場合は申込んだ山車組の事務所までお問合せください</p>

            <p className="text-center">
                <a href={`tel:${officeTel}`}>
                    {groupName} 事務所：{officeTel}
                </a>
            </p>

            <p className="complement">申込内容はマイページからご確認いただけます。<br />
                マイページのご利用には、申込受付番号、参加される方のお名前、ご登録の電話番号が必要です<br />
                この画面をスクリーンショットで保存するか、<br />
                お申込完了メールを保存されることをおすすめします。</p>

            <button
                onClick={() => navigate('/')}
                className="btn-back mx-auto"
            >
                秋まつり参加申込システム<br />トップへ戻る
            </button>
        </section>
    )
}

export default ApplyComplete