import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

function AdminApplicantEdit() {
    const navigate = useNavigate();

    const [ applicant, setApplicant ] = useState(null);
    const [ error, setError ] = useState(false);
    const [ errors, setErrors ] = useState({});
    const [ age, setAge ] = useState("");
    const [ isStudent, setIsStudent ] = useState(false);
    const parentError = errors.message?.includes('保護者名')
    const schoolError = errors.message?.includes('学校名')

    const { applicantId } = useParams();

    useEffect(() => {
        const getApplicant = async () => {
            try {
                const response = await fetch(`/api/admin/applicants/${applicantId}`, {
                    credentials: "include",
                });

                if (!response.ok) {
                    setError(true);
                    return;
                }

                const data = await response.json();
                setApplicant(data);
                setAge(data.age);
                setIsStudent(data.isStudent);

            } catch {
                setError(true);
            }
        };

        getApplicant();
    }, [applicantId]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData(e.currentTarget);

        const body = {
            applicantName: formData.get("applicantName"),
            groupName: formData.get("groupName"),
            kana: formData.get("kana"),
            age: formData.get("age") === "" ? null : Number(formData.get("age")),
            address: formData.get("address"),
            tel: formData.get("tel"),
            email: formData.get("email"),
            parentName: formData.get("parentName"),
            isStudent: formData.get("isStudent") === "true",
            schoolName: formData.get("schoolName"),
            schoolGrade: formData.get("schoolGrade"),
            schoolClass: formData.get("schoolClass"),
            note: formData.get("note"),
            staffMemo: formData.get("staffMemo"),
        };

        try {
            const response = await fetch(`/api/admin/applicants/${applicantId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify(body),
            });

            if (!response.ok) {
                const data = await response.json();

                setErrors(data);

                return;
            }

            // 成功時は詳細画面に戻る
            navigate(`/admin/applicants/${applicantId}`, {
                state: { message: "情報を更新しました" }
            });

        } catch {
            setError(true);
        }
    };

    if (error) {
        return <p>申込情報を取得・更新できませんでした。</p>;
    }

    if (!applicant) {
        return <p>読み込み中...</p>
    }

    return (
        <>
            <h1>申込情報の編集</h1>

            {errors.message && (
                <p className="text-error">
                    {errors.message}
                </p>
            )}

            <p>参加山車組：{applicant.groupName}</p>
            <p>参加ポジション：{applicant.positionName}</p>
            <p>※参加する山車組およびポジションは変更できません。<br />
                変更が必要な場合は申込者に確認し、この申込をキャンセルした後で登録し直してください</p>

            <form onSubmit = {handleSubmit}>

                {/* お名前 */}
                <div className="mb-5">
                    <label className="block font-bold mb-2">
                        参加される方のお名前
                    </label>

                    <input
                        type="text"
                        name="applicantName"
                        defaultValue={applicant.applicantName}
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
                        defaultValue={applicant.kana}
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
                            className="input input-bordered w-32"
                            min="1"
                            value={age}
                            onChange={(e) => setAge(e.target.value)}
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
                {age !== "" && Number(age) < 18 && (
                    <div className="mb-5">
                        <label className="block font-bold mb-2">
                            保護者のお名前
                        </label>

                        <input
                            type="text"
                            name="parentName"
                            className="input input-bordered w-full"
                            defaultValue={applicant.parentName}
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
                        className="input input-bordered w-full"
                        defaultValue={applicant.address}
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
                        className="input input-bordered w-full"
                        defaultValue={applicant.tel}
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
                        className="input input-bordered w-full"
                        defaultValue={applicant.email}
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
                                className="radio"
                                checked={isStudent === true}
                                onChange={() => setIsStudent(true)}
                            />
                            はい
                        </label>

                        <label className="flex items-center gap-2">
                            <input
                                type="radio"
                                name="isStudent"
                                value="false"
                                className="radio"
                                checked={isStudent === false}
                                onChange={() => setIsStudent(false)}
                            />
                            いいえ
                        </label>
                    </div>
                </div>

                {/* 学校情報 */}
                {isStudent === true && (
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
                                className="input input-bordered w-full"
                                defaultValue={applicant.schoolName}
                            />

                        </div>

                        <div className="mb-4">
                            <label className="block mb-2">
                                学年
                            </label>

                            <input
                                type="text"
                                name="schoolGrade"
                                className="input input-bordered w-full"
                                defaultValue={applicant.schoolGrade
                                }
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
                                className="input input-bordered w-full"
                                defaultValue={applicant.schoolClass}
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

                {/* 連絡事項 */}
                <div className="mb-6">
                    <label className="block font-bold mb-2">
                        連絡事項
                    </label>
                    <textarea
                        name="note"
                        className="textarea textarea-bordered w-full"
                        rows="4"
                        defaultValue={applicant.note ?? ""}
                    />
                </div>

                {/* 担当者メモ */}
                <div className="mb-6">
                    <label className="block font-bold mb-2">
                        担当者メモ
                    </label>
                    <p>申込者からの問い合わせ対応履歴など、山車組内で共有したい情報があれば入力してください</p>
                    <textarea
                        name="staffMemo"
                        className="textarea textarea-bordered w-full"
                        rows="4"
                        defaultValue={applicant.staffMemo ?? ""}
                    />
                </div>

                <button
                    type="button"
                    onClick={() => navigate(`/admin/applicants/${applicant.applicantId}/`)}
                    className="btn btn-primary"
                >
                    申込者詳細へ戻る
                </button>

                <div className="mt-8">
                    <button
                        type="submit"
                        className="btn btn-primary w-full"
                    >
                        変更を保存
                    </button>
                </div>

            </form>
        </>
    );
}
export default AdminApplicantEdit;