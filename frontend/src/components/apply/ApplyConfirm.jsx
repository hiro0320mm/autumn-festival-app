import { useLocation, useNavigate } from 'react-router-dom'

function ApplyConfirm() {

    const location = useLocation()
    const navigate = useNavigate()

    const { formData, group } = location.state || {}

    const position = group?.positions?.find(
        p => p.positionId === Number(formData?.positionId)
    )

    const handleSubmit = async () => {
        const requestData = {
            ...formData,
            age: formData.age === '' ? null : Number(formData.age),
            groupId: Number(formData.groupId),
            positionId: formData.positionId === '' ? null : Number(formData.positionId),
        }

        const response = await fetch('/api/apply', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestData),
        })

        if (!response.ok) {
            const text = await response.text()
            console.log(text)
            return
        }

        const data = await response.json()

        const completeState = {
            receptionNumber: data.receptionNumber,
            applicantName: formData.applicantName,
            groupName: group.groupName,
            positionName: position?.positionName,
            officeTel: group.officeTel,
        }

        console.log("completeへ渡すstate:", completeState)

        navigate('/apply/complete', {
            state: completeState,
        })
    }

    return (
        <div>
            <h1>参加申込内容の確認</h1>

            <h2>申し込む山車組：{group?.groupName}</h2>
            <h3>希望ポジション：{position?.positionName}</h3>

            <section>
                <h2>参加される方の情報</h2>
            <dl>
                <dt>お名前</dt>
                <dd>{formData?.applicantName}</dd>

                <dt>よみがな</dt>
                <dd>{formData?.kana}</dd>

                <dt>年齢</dt>
                <dd>{formData?.age}</dd>

                <dt>住所</dt>
                <dd>{formData?.address}</dd>

                <dt>連絡先電話番号</dt>
                <dd>{formData?.tel}</dd>

                <dt>メールアドレス</dt>
                <dd>{formData?.email}</dd>

                <dt>保護者名</dt>
                <dd>{formData?.parentName}</dd>

                <dt>学校名</dt>
                <dd>{formData?.schoolName}</dd>

                <dt>学年</dt>
                <dd>{formData?.schoolGrade}<span>年</span></dd>

                <dt>クラス</dt>
                <dd>{formData?.schoolClass}<span>組</span></dd>

                <dt>連絡事項</dt>
                <dd>{formData?.note}</dd>
            </dl>
            </section>

            {/* フォームに戻る */}
            <button
                onClick={() =>
                    navigate(`/apply/${formData.groupId}`, {
                        state: {
                            formData,
                            group,
                        },
                    })
                }
                className="btn btn-primary"
            >
                修正する
            </button>

            {/* 確認画面へ */}
            <div className="mt-8">
                <button
                    onClick={handleSubmit}
                    className="btn btn-primary w-full"
                >
                    この内容で申込みます
                </button>
            </div>
        </div>
    )
}

export default ApplyConfirm