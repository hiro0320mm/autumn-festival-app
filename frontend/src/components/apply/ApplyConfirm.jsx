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

        navigate('/apply/complete', {
            state: completeState,
        })
    }

    return (
        <section>
            <h1>参加申込内容の確認</h1>

            <div className="my-5">
                <h2 className="text-2xl font-bold mb-2">申し込む山車組：{group?.groupName}</h2>
                <h3 className="text-lg font-semibold mb-1">希望ポジション：{position?.positionName}</h3>
            </div>

                <table className="table">
                    <caption className="text-left text-base">参加される方の情報</caption>
                    <tbody>
                    <tr>
                        <th className="w-50">お名前</th>
                        <td>{formData?.applicantName}</td>
                    </tr>
                    <tr>
                        <th>よみがな</th>
                        <td>{formData?.kana}</td>
                    </tr>
                    <tr>
                        <th>年齢</th>
                        <td>{formData?.age}</td>
                    </tr>
                    <tr>
                        <th>住所</th>
                        <td>{formData?.address}</td>
                    </tr>
                    <tr>
                        <th>連絡先電話番号</th>
                        <td>{formData?.tel}</td>
                    </tr>
                    <tr>
                        <th>メールアドレス</th>
                        <td>{formData?.email}</td>
                    </tr>
                    <tr>
                        <th>保護者名</th>
                        <td>{formData?.parentName}</td>
                    </tr>
                    <tr>
                        <th>学校名</th>
                        <td>{formData?.schoolName}</td>
                    </tr>
                    <tr>
                        <th>学年</th>
                        <td>{formData?.schoolGrade}<span>年</span></td>
                    </tr>
                    <tr>
                        <th>クラス</th>
                        <td>{formData?.schoolClass}<span>組</span></td>
                    </tr>
                    <tr>
                        <th>連絡事項</th>
                        <td>{formData?.note}</td>
                    </tr>
                    </tbody>
                </table>
            <div className="flex justify-center my-10">
                <button
                    type="submit"
                    className="submit-btn"
                    onClick={handleSubmit}
                >
                    この内容で申し込みます
                </button>
            </div>
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
                className="back-to-btn"
            >
                修正する
            </button>
        </section>
    )
}

export default ApplyConfirm