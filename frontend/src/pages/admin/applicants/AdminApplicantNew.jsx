import { useEffect, useState } from "react";
import {useLocation, useNavigate} from "react-router-dom";


function AdminApplicantNew() {

    const location = useLocation();
    const navigate = useNavigate();

    const [role, setRole] = useState("");
    const [groupId, setGroupId] = useState(null);
    const [groups, setGroups] = useState([]);
    const [positions, setPositions] = useState([]);

    const [error, setError] = useState("");
    const [ errors, setErrors ] = useState({});
    const parentError = errors.message?.includes('保護者名');
    const schoolError = errors.message?.includes('学校名');

    const [formData, setFormData] = useState(
        location.state?.formData || {
            applicantName: '',
            kana: '',
            age: '',
            address: '',
            tel: '',
            email: '',
            parentName: '',
            groupId: '',
            positionId: '',
            isStudent: true,
            schoolName: '',
            schoolGrade: '',
            schoolClass: '',
            note: '',
            staffMemo: '',
        }
    )

    useEffect(() => {
        fetch("/api/admin/me", {
            credentials: "include",
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error("管理者情報の取得に失敗しました");
                }

                return response.json();
            })
            .then(data => {
                setRole(data.role);
                setGroupId(data.groupId);

                if (data.role === "ROLE_ADMIN") {
                    setFormData(prev => ({
                        ...prev,
                        groupId: data.groupId
                    }));
                }
            })
            .catch(error => {
                setError(error.message);
            });
    }, [])

    // 特権管理者のときグループ情報を取得
    useEffect(() => {
        if (role !== "ROLE_SUPER_ADMIN") {
            return;
        }

        fetch("/api/groups", {
            credentials: "include",
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error("山車組情報の取得に失敗しました");
                }

                window.scrollTo({
                    top: 0,
                    behavior: "smooth",
                });

                return response.json();
            })
            .then(data => {
                setGroups(data);
            })
            .catch(error => {
                setError(error.message);
            });
    }, [role]);

    // 山車組ごとのポジション取得
    const filteredPositions = positions.filter(
        position => position.groupId === Number(formData.groupId)
    );

    useEffect(() => {
        fetch("/api/admin/positions", {
            credentials: "include",
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error("ポジション情報の取得に失敗しました");
                }

                window.scrollTo({
                    top: 0,
                    behavior: "smooth",
                });

                return response.json();
            })
            .then(data => {
                setPositions(data);
            })
            .catch(error => {
                setError(error.message);
            });
    }, []);

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

        // データ取得エラー
        setError("");
        // フォームバリデーションエラー
        setErrors({})

        const requestData = {
            ...formData,
            age: formData.age === '' ? null : Number(formData.age),
            groupId: Number(formData.groupId),
            positionId: formData.positionId === '' ? null : Number(formData.positionId),
        }

        try {
            const response = await fetch("/api/admin/applicants", {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(requestData)
            })

            if (!response.ok) {
                const data = await response.json()
                setErrors(data);

                window.scrollTo({
                    top: 0,
                    behavior: "smooth",
                });
                return;
            }

            navigate("/admin/applicants", { state: { message: "申込者を登録しました", }, });

        } catch(error) {
            setError("申込者の登録に失敗しました");
        }
    }

    return (
        <section>

            <h1>
                参加申込者 新規登録
            </h1>

            <form onSubmit={handleSubmit}>
                {/* 特権管理者のみ山車組を選択 */}
                {role === "ROLE_SUPER_ADMIN" && (
                    <div>
                        <label>
                            <span className="required">＊必須項目</span>
                            山車組
                        </label>
                        <select
                            value={formData.groupId}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    groupId: e.target.value,
                                    positionId: "",
                                })
                            }
                        >
                            <option value="">山車組を選択してください</option>

                            {groups.map(group => (
                                <option key={group.groupId} value={group.groupId}>
                                    {group.groupName}
                                </option>
                            ))}
                        </select>
                    </div>
                )}

                {/* ポジション */}
                <div className="mb-5">
                    <label>
                        <span className="required">＊必須項目</span>
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
                        disabled={!formData.groupId}
                    >
                        <option value="">ポジションを選択してください</option>

                        {filteredPositions.map((position) => (
                            <option
                                key={position.positionId}
                                value={position.positionId}
                            >
                                {position.positionName}
                            </option>
                        ))}
                    </select>

                </div>

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
                        <label>
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

                        <label>
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
                            <p className="text-error">
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
                            </label>

                            <input
                                type="text"
                                name="schoolGrade"
                                className="short-text"
                                value={formData.schoolGrade}
                                onChange={handleChange}
                            />
                            <span>年</span>
                        </div>

                        <div>
                            <label>
                                <span className="required">＊小中高生の場合は必須項目</span>
                                クラス
                            </label>

                            <input
                                type="text"
                                name="schoolClass"
                                className="short-text"
                                value={formData.schoolClass}
                                onChange={handleChange}
                            />
                            <span>組</span>
                        </div>

                    </div>
                )}

                {/* 連絡事項 */}
                <div className="mb-6">
                    <label>
                        連絡事項
                    </label>
                    <p>参加できない日が予めわかっている場合や、体調・体質でを付けるべきことなど、<br />
                        申込者から山車組への連絡事項があれば入力してください</p>

                    <textarea
                        name="note"
                        value={formData.note}
                        onChange={handleChange}
                        className="textarea textarea-bordered w-full"
                        rows="4"
                    />
                </div>

                {/* 担当者メモ */}
                <div className="mb-6">
                    <label>
                        担当者メモ
                    </label>
                    <p>申込者からの問い合わせ対応履歴など、山車組内で共有したい情報があれば入力してください</p>
                    <textarea
                        name="staffMemo"
                        className="textarea textarea-bordered w-full"
                        rows="4"
                        value={formData.staffMemo}
                        onChange={handleChange}
                    />
                </div>

                <div className="flex justify-center my-10">
                    <button
                        type="submit"
                        className="submit-btn"
                    >
                        登録する
                    </button>
                </div>

                <button type="button"
                        onClick={() => navigate('/admin/applicants')}
                        className="back-to-btn"
                >
                    ← 申込者管理トップへ戻る
                </button>

            </form>
        </section>
    )

}

export default AdminApplicantNew;