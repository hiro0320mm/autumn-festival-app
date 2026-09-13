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
            setErrors(data)
            window.scrollTo({
                top: 0,
                behavior: "smooth",
            });
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
    <section>

        <h1 className="text-2xl font-bold mb-6 sm:m-2">
            参加を希望される方は下記にご入力ください
        </h1>

        <div className="mb-6 p-4 border rounded">
            <p className="font-bold mb-2 sm:m-2">
                参加する山車組
            </p>

            <p className="text-3xl mb-5 ml-5">
                {group.groupName}
            </p>
            <button onClick={() => navigate('/')} className="btn btn-primary">
                山車組選択画面へ戻る
            </button>
        </div>

        <form onSubmit={handleSubmit}>

            {/* お名前 */}
            <div className="mb-5">
                <label>
                    <span className="required">＊必須項目</span>
                    参加される方のお名前
                    {errors.applicantName && (
                        <span className="validation-error">
                            {errors.applicantName}
                        </span>
                    )}
                </label>

                <input
                    type="text"
                    name="applicantName"
                    value={formData.applicantName}
                    onChange={handleChange}
                    placeholder="久慈秋子"
                />

                
            </div>

            {/* よみがな */}
            <div className="mb-5">
                <label>
                    <span className="required">＊必須項目</span>
                    お名前のよみがな
                    {errors.kana && (
                        <span className="validation-error">
                            {errors.kana}
                        </span>
                    )}
                </label>

                <input
                    type="text"
                    name="kana"
                    value={formData.kana}
                    onChange={handleChange}
                    placeholder="ひらがなで入力してください"
                />

            </div>

            {/* 年齢 */}
            <div className="mb-5">
                <label>
                    <span className="required">＊必須項目</span>
                    参加される方の年齢
                    {errors.age && (
                        <span className="validation-error">
                            {errors.age}
                        </span>
                    )}
                </label>

                <div className="flex items-center gap-2">
                    <input
                        type="number"
                        name="age"
                        value={formData.age}
                        onChange={handleChange}
                        min="1"
                    />
                    <span>歳</span>
                </div>

            </div>

            {/* 保護者名 */}
            {formData.age !== '' && Number(formData.age) < 18 && (
                <div className="mb-5">
                    <label>
                        <span className="required">＊18歳未満の場合は必須項目</span>
                        保護者のお名前
                        {parentError && (
                            <span className="validation-error">
                                {errors.message}
                            </span>
                        )}
                    </label>

                    <input
                        type="text"
                        name="parentName"
                        value={formData.parentName}
                        onChange={handleChange}
                    />

                </div>
            )}

            {/* 住所 */}
            <div className="mb-5">
                <label>
                    <span className="required">＊必須項目</span>
                    住所
                    {errors.address && (
                        <span className="validation-error">
                            {errors.address}
                        </span>
                    )}
                </label>

                <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="岩手県久慈市○○町××丁目△△"
                />
            </div>

            {/* 電話番号 */}
            <div className="mb-5">
                <label>
                    <span className="required">＊必須項目</span>
                    連絡先電話番号
                    {errors.tel && (
                        <span className="validation-error">
                            {errors.tel}
                        </span>
                    )}
                </label>

                <input
                    type="tel"
                    name="tel"
                    value={formData.tel}
                    onChange={handleChange}
                    placeholder="09012345678"
                />
            </div>

            {/* メールアドレス */}
            <div className="mb-5">
                <label>
                    <span className="required">＊必須項目</span>
                    メールアドレス
                    {errors.email && (
                        <span className="validation-error">
                            {errors.email}
                        </span>
                    )}
                </label>

                <input
                    type="text"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                />
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
                        <p className="validation-error mb-5">
                            {errors.message}
                        </p>
                    )}

                    <div className="mb-4">
                        <label>
                            <span className="required">＊小中高生の場合は必須項目</span>
                            学校名
                        </label>

                        <input
                            type="text"
                            name="schoolName"
                            value={formData.schoolName}
                            onChange={handleChange}
                        />

                    </div>

                    <div className="mb-4">
                        <label>
                            <span className="required">＊小中高生の場合は必須項目</span>
                            学年
                            {errors.schoolGrade && (
                                <span className="validation-error">
                                    {errors.schoolGrade}
                                </span>
                            )}
                        </label>

                        <input
                            type="text"
                            name="schoolGrade"
                            value={formData.schoolGrade}
                            onChange={handleChange}
                            className="short-text"
                        />
                        <span>年</span>

                    </div>

                    <div>
                        <label>
                            <span className="required">＊小中高生の場合は必須項目</span>
                            クラス
                            {errors.schoolClass && (
                                <span className="validation-error">
                                    {errors.schoolClass}
                                </span>
                            )}
                        </label>

                        <input
                            type="text"
                            name="schoolClass"
                            value={formData.schoolClass}
                            onChange={handleChange}
                            className="short-text"
                        />
                        <span>組</span>

                    </div>

                </div>
            )}

            {/* ポジション */}
            <div className="mb-5">
                <label>
                    希望するポジション
                    {errors.positionId && (
                        <span className="validation-error">
                            {errors.positionId}
                        </span>
                    )}
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

            </div>

            {/* 連絡事項 */}
            <div className="mb-6">
                <label>
                    連絡事項
                </label>
                <ul className="text-xs">
                    <li>参加する山車組に伝えておきたいことがあればご入力ください</li>
                    <li>参加できない日が予めわかっている場合や、食べ物等アレルギー情報、体調・体質で不安なことがあればお知らせください</li>
                    <li className="text-red-700">参加できなくなった場合は申し込んだ山車組の事務所へ直接ご連絡ください</li>
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

                <h2 className="font-semibold">
                    <span className="block required font-normal text-xs">＊必須項目</span>
                    個人情報の取り扱いについて
                    {errors.privacyAgreed && (
                        <span className="validation-error">
                            {errors.privacyAgreed}
                        </span>
                    )}
                </h2>

                <ol className="text-left list-decimal list-inside my-5 p-4 border rounded">
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

                <label className="my-5">
                    <input
                        type="checkbox"
                        name="privacyAgreed"
                        checked={formData.privacyAgreed}
                        onChange={handleChange}
                    />
                    {" "}個人情報の取り扱いに同意します
                </label>
                <div className="flex justify-center my-10">
                    {/* 確認画面へ */}
                    <div className="mt-8">
                        <button
                            type="submit"
                            className="submit-btn"
                        >
                            確認画面へ
                        </button>
                    </div>
                </div>

            </div>

            <button onClick={() => navigate('/')} className="back-to-btn">
                秋まつり参加申込システム<br />トップへ戻る
            </button>

        </form>
    </section>
)
}

export default ApplyForm