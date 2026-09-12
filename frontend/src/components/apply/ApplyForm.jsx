import { useEffect, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'

function ApplyForm() {

    const { groupId } = useParams()
    const navigate = useNavigate()
    const location = useLocation()

    const [group, setGroup] = useState(null)

    const [formData, setFormData] = useState(
        location.state?.formData || {
            applicantName: '',
            kana: '',
            age: '',
            address: '',
            tel: '',
            email: '',
            parentName: '',
            groupId: groupId,
            positionId: '',
            isStudent: true,
            schoolName: '',
            schoolGrade: '',
            schoolClass: '',
            note: '',
            privacyAgreed: false,
        }
    )

    const [ errors, setErrors ] = useState({})
    const parentError = errors.message?.includes('保護者名')
    const schoolError = errors.message?.includes('学校名')

    useEffect(() => {
        fetch('/api/groups')
            .then((response) => response.json())
            .then((data) => {
                const selectedGroup = data.find(
                    (group) => group.groupId === Number(groupId)
                )
                setGroup(selectedGroup)
            })
            .catch((error) => {
                console.error('山車組情報の取得に失敗しました', error)
            })
    }, [groupId])

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target

        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value,
        })
    }

    const handleStudentChange = (e) => {
        const value = e.target.value === 'true'

        setFormData({
            ...formData,
            isStudent: value
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        setErrors({})

        const requestData = {
            ...formData,
            age: formData.age === '' ? null : Number(formData.age),
            groupId: Number(formData.groupId),
            positionId: formData.positionId === '' ? null : Number(formData.positionId),
        }

        const response = await fetch('/api/apply/validate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestData),
        })

        if (!response.ok) {
            const data = await response.json()
            console.log(data)
            setErrors(data)
            return
        }

        navigate(`/apply/${groupId}/confirm`, {
            state: {
                formData,
                group,
            },
        })
    }

    if (!group) {
        return <p>山車組情報を読み込んでいます...</p>
    }

return (
    <div className="max-w-2xl mx-auto p-6">

        <h1 className="text-2xl font-bold mb-6">
            参加申込
        </h1>

        <div className="mb-6 p-4 border rounded">
            <p className="font-bold mb-2">
                参加する山車組
            </p>

            <p>
                {group.groupName}
            </p>
            <button onClick={() => navigate('/')} className="btn btn-primary">
                山車組選択画面へ戻る
            </button>
        </div>

        <form onSubmit={handleSubmit}>

            {/* お名前 */}
            <div className="mb-5">
                <label className="block font-bold mb-2">
                    参加される方のお名前
                </label>

                <input
                    type="text"
                    name="applicantName"
                    value={formData.applicantName}
                    onChange={handleChange}
                    className="input input-bordered w-full"
                    placeholder="久慈秋子"
                />

                {errors.applicantName && (
                    <p className="text-error mt-1 text-xs">
                        {errors.applicantName}
                    </p>
                )}
            </div>

            {/* よみがな */}
            <div className="mb-5">
                <label className="block font-bold mb-2">
                    お名前のよみがな
                </label>

                <input
                    type="text"
                    name="kana"
                    value={formData.kana}
                    onChange={handleChange}
                    className="input input-bordered w-full"
                    placeholder="ひらがなで入力してください"
                />

                {errors.kana && (
                    <p className="text-error mt-1 text-xs">
                        {errors.kana}
                    </p>
                )}

            </div>

            {/* 年齢 */}
            <div className="mb-5">
                <label className="block font-bold mb-2">
                    参加される方の年齢
                </label>

                <div className="flex items-center gap-2">
                    <input
                        type="number"
                        name="age"
                        value={formData.age}
                        onChange={handleChange}
                        className="input input-bordered w-32"
                        min="1"
                    />
                    <span>歳</span>
                </div>

                {errors.age && (
                    <p className="text-error mt-1 text-xs">
                        {errors.age}
                    </p>
                )}

            </div>

            {/* 保護者名 */}
            {formData.age !== '' && Number(formData.age) < 18 && (
                <div className="mb-5">
                    <label className="block font-bold mb-2">
                        保護者のお名前
                    </label>

                    <input
                        type="text"
                        name="parentName"
                        value={formData.parentName}
                        onChange={handleChange}
                        className="input input-bordered w-full"
                    />

                    {parentError && (
                        <p className="text-error mt-1 text-xs">
                            {errors.message}
                        </p>
                    )}

                </div>
            )}

            {/* 住所 */}
            <div className="mb-5">
                <label className="block font-bold mb-2">
                    住所
                </label>

                <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className="input input-bordered w-full"
                    placeholder="岩手県久慈市○○町××丁目△△"
                />

                {errors.address && (
                    <p className="text-error mt-1 text-xs">
                        {errors.address}
                    </p>
                )}
            </div>

            {/* 電話番号 */}
            <div className="mb-5">
                <label className="block font-bold mb-2">
                    連絡先電話番号
                </label>

                <input
                    type="tel"
                    name="tel"
                    value={formData.tel}
                    onChange={handleChange}
                    className="input input-bordered w-full"
                    placeholder="09012345678"
                />

                {errors.tel && (
                    <p className="text-error mt-1 text-xs">
                        {errors.tel}
                    </p>
                )}
            </div>

            {/* メールアドレス */}
            <div className="mb-5">
                <label className="block font-bold mb-2">
                    メールアドレス
                </label>

                <input
                    type="text"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="input input-bordered w-full"
                />

                {errors.email && (
                    <p className="text-error mt-1 text-xs">
                        {errors.email}
                    </p>
                )}
            </div>

            {/* 学生 */}
            <div className="mb-5">
                <p className="font-bold mb-2">
                    小中高生ですか？
                </p>

                <div className="flex gap-6">
                    <label className="flex items-center gap-2">
                        <input
                            type="radio"
                            name="isStudent"
                            value="true"
                            checked={formData.isStudent === true}
                            onChange={handleStudentChange}
                            className="radio"
                        />
                        はい
                    </label>

                    <label className="flex items-center gap-2">
                        <input
                            type="radio"
                            name="isStudent"
                            value="false"
                            checked={formData.isStudent === false}
                            onChange={handleStudentChange}
                            className="radio"
                        />
                        いいえ
                    </label>
                </div>
            </div>

            {/* 学校情報 */}
            {formData.isStudent === true && (
                <div className="mb-5 p-4 border rounded">

                    <p className="font-bold mb-4">
                        学校情報
                    </p>
                    {schoolError && (
                        <p className="text-error mt-1 text-xs">
                            {errors.message}
                        </p>
                    )}

                    <div className="mb-4">
                        <label className="block mb-2">
                            学校名
                        </label>

                        <input
                            type="text"
                            name="schoolName"
                            value={formData.schoolName}
                            onChange={handleChange}
                            className="input input-bordered w-full"
                        />

                    </div>

                    <div className="mb-4">
                        <label className="block mb-2">
                            学年
                        </label>

                        <input
                            type="text"
                            name="schoolGrade"
                            value={formData.schoolGrade}
                            onChange={handleChange}
                            className="input input-bordered w-full"
                        />
                        <span>年</span>

                        {errors.schoolGrade && (
                            <p className="text-error mt-1">
                                {errors.schoolGrade}
                            </p>
                        )}

                    </div>

                    <div>
                        <label className="block mb-2">
                            クラス
                        </label>

                        <input
                            type="text"
                            name="schoolClass"
                            value={formData.schoolClass}
                            onChange={handleChange}
                            className="input input-bordered w-full"
                        />
                        <span>組</span>

                        {errors.schoolClass && (
                            <p className="text-error mt-1">
                                {errors.schoolClass}
                            </p>
                        )}

                    </div>

                </div>
            )}

            {/* ポジション */}
            <div className="mb-5">
                <label className="block font-bold mb-2">
                    希望するポジション
                </label>

                <select
                    name="positionId"
                    value={formData.positionId}
                    onChange={handleChange}
                    className="select select-bordered w-full"
                >
                    <option value="">
                        ポジションを選択してください
                    </option>

                    {group.positions.map((position) => (
                        <option
                            key={position.positionId}
                            value={position.positionId}
                        >
                            {position.positionName}
                        </option>
                    ))}
                </select>

                {errors.positionId && (
                    <p className="text-error mt-1 text-xs">
                        {errors.positionId}
                    </p>
                )}
            </div>

            {/* 連絡事項 */}
            <div className="mb-6">
                <label className="block font-bold mb-2">
                    連絡事項
                </label>
                <ul className="text-xs">
                    <li>※参加する山車組に伝えておきたいことがあればご入力ください</li>
                    <li>・参加できない日が予めわかっている場合や、食べ物等アレルギー情報、体調・体質で不安なことがあればお知らせください</li>
                    <li className="text-red-700">・参加できなくなった場合は申し込んだ山車組の事務所へ直接ご連絡ください</li>
                </ul>

                <textarea
                    name="note"
                    value={formData.note}
                    onChange={handleChange}
                    className="textarea textarea-bordered w-full"
                    rows="4"
                />
            </div>

            <div>
                <h2>個人情報の取り扱いについて</h2>

                <ol className="text-left list-decimal list-inside">
                    <li>
                        入力された情報は下記の目的でのみ使用します
                        <ul>
                            <li>参加申込者への連絡（イベントに関する各種案内、緊急時の連絡など）</li>
                            <li>関係機関への提出（安全管理・運営連携を目的とした、学校および実行委員会への参加者リストの提出）</li>
                            <li>事務処理（備品の貸出管理、参加料の支払管理、その他運営上必要な事務作業）</li>
                        </ul>
                    </li>
                    <li>
                        第三者提供について
                        <p>法令に基づく場合、および上記利用目的（学校・実行委員会へのリスト提出）を除き、ご本人の同意なく第三者に個人情報を提供することはありません。</p>
                    </li>
                </ol>

                <label>
                    <input
                        type="checkbox"
                        name="privacyAgreed"
                        checked={formData.privacyAgreed}
                        onChange={handleChange}
                    />
                    個人情報の取り扱いに同意します
                </label>

                {errors.privacyAgreed && (
                    <p className="text-error mt-1 text-xs">
                        {errors.privacyAgreed}
                    </p>
                )}
            </div>

            <button onClick={() => navigate('/')} className="btn btn-primary">
                秋まつり参加申込システム<br />トップへ戻る
            </button>

            {/* 確認画面へ */}
            <div className="mt-8">
                <button
                    type="submit"
                    className="btn btn-primary w-full"
                >
                    確認画面へ
                </button>
            </div>

        </form>
    </div>
)
}

export default ApplyForm