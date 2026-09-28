import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

function AdminApplicantEdit() {
    const navigate = useNavigate();
    const location = useLocation();

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

                window.scrollTo({
                    top: 0,
                    behavior: "smooth",
                });

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

    const backTo = location.state?.from === "detail"
        ? "申込者詳細へ戻る"
        : "申込者一覧へ戻る";

    return (
        <section className="admin-container">
            <h1>申込情報の編集</h1>
            <div className="message-box">
                {errors.message && (
                    <strong>
                        {errors.message}
                    </strong>
                )}
            </div>

            <div className="optional-box w-fit">
                <h2 className="mb-05">参加山車組：{applicant.groupName}</h2>
                <h3 className="mb-05">参加ポジション：{applicant.positionName}</h3>
                <p className="complement">※参加する山車組およびポジションは変更できません。<br />
                    {"　"}変更が必要な場合は申込者に確認し、この申込をキャンセルした後で登録し直してください</p>
            </div>

            <form onSubmit = {handleSubmit}>

                {/* お名前 */}
                <div>
                    <label>

                        参加される方のお名前
                        {errors.applicantName && (
                            <span validation-error>
                                {errors.applicantName}
                            </span>
                        )}
                    </label>

                    <input
                        type="text"
                        name="applicantName"
                        defaultValue={applicant.applicantName}
                    />

                </div>

                {/* よみがな */}
                <div>
                    <label>
                        <span className="required">＊必須項目</span>
                        お名前のよみがな
                        {errors.kana && (
                            <span validation-error>
                                {errors.kana}
                            </span>
                        )}
                    </label>

                    <input
                        type="text"
                        name="kana"
                        defaultValue={applicant.kana}
                    />

                </div>

                {/* 年齢 */}
                <div>
                    <label>
                        <span className="required">＊必須項目</span>
                        参加される方の年齢
                        {errors.age && (
                            <span validation-error>
                                {errors.age}
                            </span>
                        )}
                    </label>

                    <div>
                        <input
                            type="number"
                            name="age"
                            className="input-short"
                            min="1"
                            value={age}
                            onChange={(e) => setAge(e.target.value)}
                        />
                        <span>歳</span>
                    </div>

                </div>

                {/* 保護者名 */}
                {age !== "" && Number(age) < 18 && (
                    <div>
                        <label>
                            <span className="required">＊18歳未満の方は必須項目</span>
                            保護者のお名前
                            {parentError && (
                                <span validation-error>
                                    {errors.message}
                                </span>
                            )}
                        </label>

                        <input
                            type="text"
                            name="parentName"
                            defaultValue={applicant.parentName}
                        />

                    </div>
                )}

                {/* 住所 */}
                <div>
                    <label>
                        <span className="required">＊必須項目</span>
                        住所
                        {errors.address && (
                            <span validation-error>
                                {errors.address}
                            </span>
                        )}
                    </label>

                    <input
                        type="text"
                        name="address"
                        defaultValue={applicant.address}
                    />

                </div>

                {/* 電話番号 */}
                <div>
                    <label>
                        <span className="required">＊必須項目</span>
                        連絡先電話番号
                        {errors.tel && (
                            <span validation-error>
                                {errors.tel}
                            </span>
                        )}
                    </label>

                    <input
                        type="tel"
                        name="tel"
                        defaultValue={applicant.tel}
                    />

                </div>

                {/* メールアドレス */}
                <div>
                    <label>
                        <span className="required">＊必須項目</span>
                        メールアドレス
                        {errors.email && (
                            <span validation-error>
                                {errors.email}
                            </span>
                        )}
                    </label>

                    <input
                        type="text"
                        name="email"
                        defaultValue={applicant.email}
                    />

                </div>

                {/* 学生 */}
                <div>
                    <p>
                        小中高生ですか？
                    </p>

                    <div className="radio">
                        <label className={`radio-button ${isStudent === true ? 'selected' : ''}`}>
                            <input
                                type="radio"
                                name="isStudent"
                                value="true"
                                checked={isStudent === true}
                                onChange={() => setIsStudent(true)}
                            />
                            <span>はい</span>
                        </label>

                        <label className={`radio-button ${isStudent === false ? 'selected' : ''}`}>
                            <input
                                type="radio"
                                name="isStudent"
                                value="false"
                                checked={isStudent === false}
                                onChange={() => setIsStudent(false)}
                            />
                            <span>いいえ</span>
                        </label>
                    </div>
                </div>

                {/* 学校情報 */}
                {isStudent === true && (
                    <div className="optional-box">

                        <h3>学校情報</h3>
                        {schoolError && (
                            <p className="validation-error">
                                {errors.message}
                            </p>
                        )}

                        <div>
                            <label className="label">
                                <span className="required">＊小中高生の場合は必須項目</span>
                                学校名
                            </label>

                            <input
                                type="text"
                                name="schoolName"
                                defaultValue={applicant.schoolName}
                            />

                        </div>

                        <div>
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
                                className="input-short"
                                defaultValue={applicant.schoolGrade
                                }
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
                                className="input-short"
                                defaultValue={applicant.schoolClass}
                            />
                            <span>組</span>

                        </div>

                    </div>
                )}

                {/* 連絡事項 */}
                <div>
                    <label>
                        連絡事項
                    </label>
                    <textarea
                        name="note"
                        rows="4"
                        defaultValue={applicant.note ?? ""}
                    />
                </div>

                {/* 担当者メモ */}
                <div>
                    <label>
                        担当者メモ
                    </label>
                    <p>申込者からの問い合わせ対応履歴など、山車組内で共有したい情報があれば入力してください</p>
                    <textarea
                        name="staffMemo"
                        rows="4"
                        defaultValue={applicant.staffMemo ?? ""}
                    />
                </div>

                <button
                    type="submit"
                    className="btn-submit"
                >
                    変更を保存
                </button>
            </form>
            <button
                type="button"
                className="btn-back"
                onClick={() => {
                    if (location.state?.from === "detail") {
                        navigate(`/admin/applicants/${applicantId}`);
                    } else {
                        navigate("/admin/applicants");
                    }
                }}
            >
                ← {backTo}
            </button>
        </section>
    );
}
export default AdminApplicantEdit;