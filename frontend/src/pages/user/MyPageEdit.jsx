import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function MyPageEdit() {
    const navigate = useNavigate();
    const [ applicant, setApplicant ] = useState(null);
    const [ error, setError ] = useState(false);
    const [ errors, setErrors ] = useState({});
    const [ age, setAge ] = useState("");
    const [ isStudent, setIsStudent ] = useState(false);
    const parentError = errors.message?.includes('保護者名')
    const schoolError = errors.message?.includes('学校名')

    useEffect(() => {
        const getMyPage = async () => {
            try {
                const response = await fetch("/api/mypage", {
                    credentials: "include",
                });

                if (!response.ok) {
                    setError(true);
                    return;
                }

                const data = await response.json();
                setApplicant(data);
                setAge(String(data.age));
                setIsStudent(data.isStudent);
            } catch {
                setError(true);
            }
        };

        getMyPage();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData(e.currentTarget);

        const body = {
            applicantName: formData.get("applicantName"),
            groupName: formData.get("groupName"),
            positionName: formData.get("positionName"),
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
        };

        try {
            const response = await fetch("/api/mypage", {
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

            window.location.href = "/mypage";

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

    return(
        <section className="mypage-container">
            <h1 className="contents-title">申込情報の編集</h1>

            <div className="group-name">
            <h3>参加山車組・ポジション</h3>
            <p className="text-normal text-bigger">{applicant.groupName}・{applicant.positionName}</p>
            <p className="text-normal complement">参加する山車組およびポジションはマイページからの変更はできません。<br />
            キャンセル後改めてお申込みをお願いします。</p>
            </div>

            <form onSubmit = {handleSubmit}>

                {/* お名前 */}
                <div>
                    <label>
                        <span className="required">＊必須項目</span>
                        参加される方のお名前
                    </label>

                    <input
                        type="text"
                        name="applicantName"
                        defaultValue={applicant.applicantName}
                    />

                    {errors.applicantName && (
                        <p className="validation-error">
                            {errors.applicantName}
                        </p>
                    )}
                </div>

                {/* よみがな */}
                <div>
                    <label>
                        <span className="required">＊必須項目</span>
                        お名前のよみがな
                    </label>

                    <input
                        type="text"
                        name="kana"
                        defaultValue={applicant.kana}
                    />

                    {errors.kana && (
                        <p className="validation-error">
                            {errors.kana}
                        </p>
                    )}

                </div>

                {/* 年齢 */}
                <div>
                    <label>
                        <span className="required">＊必須項目</span>
                        参加される方の年齢
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

                    {errors.age && (
                        <p className="validation-error">
                            {errors.age}
                        </p>
                    )}

                </div>

                {/* 保護者名 */}
                {age !== "" && Number(age) < 18 && (
                    <div>
                        <label>
                            <span className="required">＊18歳未満の場合は必須項目</span>
                            保護者のお名前
                        </label>

                        <input
                            type="text"
                            name="parentName"
                            defaultValue={applicant.parentName}
                        />

                        {parentError && (
                            <p className="validation-error">
                                {errors.message}
                            </p>
                        )}

                    </div>
                )}

                {/* 住所 */}
                <div>
                    <label>
                        <span className="required">＊必須項目</span>
                        住所
                    </label>

                    <input
                        type="text"
                        name="address"
                        defaultValue={applicant.address}
                    />

                    {errors.address && (
                        <p className="validation-error">
                            {errors.address}
                        </p>
                    )}
                </div>

                {/* 電話番号 */}
                <div>
                    <label>
                        <span className="required">＊必須項目</span>
                        連絡先電話番号
                    </label>

                    <input
                        type="tel"
                        name="tel"
                        defaultValue={applicant.tel}
                    />

                    {errors.tel && (
                        <p className="validation-error">
                            {errors.tel}
                        </p>
                    )}
                </div>

                {/* メールアドレス */}
                <div>
                    <label>
                        <span className="required">＊必須項目</span>
                        メールアドレス
                    </label>

                    <input
                        type="text"
                        name="email"
                        defaultValue={applicant.email}
                    />

                    {errors.email && (
                        <p className="validation-error">
                            {errors.email}
                        </p>
                    )}
                </div>

                {/* 学生 */}
                <div>
                    <p className="label">
                        小中高生ですか？
                    </p>

                    <div className="radio">
                        <label className={`radio-button ${applicant.isStudent === true ? 'selected' : ''}`}>
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

                        <label className={`radio-button ${applicant.isStudent === false ? 'selected' : ''}`}>
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
                    <div className="optional-box">

                        <h3>学校情報</h3>
                        
                        {schoolError && (
                            <p className="validation-error">
                                {errors.message}
                            </p>
                        )}

                        <div>
                            <label>
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
                            </label>

                            <input
                                type="text"
                                name="schoolGrade"
                                className="input-short"
                                defaultValue={applicant.schoolGrade
                            }
                            />
                            <span>年</span>

                            {errors.schoolGrade && (
                                <p className="validation-error">
                                    {errors.schoolGrade}
                                </p>
                            )}

                        </div>

                        <div>
                            <label>
                                <span className="required">＊小中高生の場合は必須項目</span>
                                クラス
                            </label>

                            <input
                                type="text"
                                name="schoolClass"
                                className="input-short"
                                defaultValue={applicant.schoolClass}
                            />
                            <span>組</span>

                            {errors.schoolClass && (
                                <p className="validation-error">
                                    {errors.schoolClass}
                                </p>
                            )}

                        </div>

                    </div>
                )}

                {/* 連絡事項 */}
                <div>
                    <label>
                        連絡事項
                    </label>
                    <ul className="complement">
                        <li>参加する山車組に伝えておきたいことがあればご入力ください</li>
                        <li>参加できない日が予めわかっている場合や、食べ物等アレルギー情報、体調・体質で不安なことがあればお知らせください</li>
                        <li className="text-warn">参加できなくなった場合は申し込んだ山車組の事務所へ直接ご連絡ください</li>
                    </ul>

                    <textarea
                        name="note"
                        rows="4"
                        defaultValue={applicant.note ?? ""}
                    />
                </div>

                <button
                    type="submit"
                    className="btn-submit"
                >
                    変更を保存
                </button>

                <button
                    onClick={() => navigate('/mypage')}
                    className="btn-back"
                >
                    マイページ<br />トップへ戻る
                </button>

            </form>
        </section>
    );

}

export default MyPageEdit;
