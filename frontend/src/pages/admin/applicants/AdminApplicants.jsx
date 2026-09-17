import { useEffect, useState } from "react";
import {Link, useNavigate} from "react-router-dom";
import { Pencil, Trash2 } from "lucide-react";
import { useAdmin } from "../../../components/admin/AdminContext";

function AdminApplicants() {
    const admin = useAdmin();
    const navigate = useNavigate();

    const [applicants, setApplicants] = useState([]);

    const [searchText, setSearchText] = useState("");
    const [groupFilter, setGroupFilter] = useState("");
    const groups = [
        ...new Set(applicants.map((applicant) => applicant.groupName))
    ];
    const [positionFilter, setPositionFilter] = useState("");
    const positions = [
        ...new Set(applicants.map((applicant) => applicant.positionName))
    ];

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showCancelModal, setShowCancelModal] = useState(false);

    const [selectedApplicant, setSelectedApplicant] = useState(null);

    useEffect(() => {

        if (!admin) {
            return <p>管理者情報を取得中...</p>;
        }

        const getApplicants = async () => {
            try {
                const response = await fetch("/api/admin/applicants", {
                    credentials: "include",
                });

                if (!response.ok) {
                    throw new Error("申込者一覧の取得に失敗しました");
                }

                const data = await response.json();
                setApplicants(data);

            } catch (error) {
                console.error(error);
            }
        };

        getApplicants();

    }, [admin]);

    // 検索・山車組・ポジション絞込
    const filteredApplicants = applicants.filter((applicant) => {
        const keyword = searchText.trim().toLowerCase();

        return (
            (
                applicant.applicantName?.toLowerCase().includes(keyword) ||
                applicant.kana?.toLowerCase().includes(keyword) ||
                applicant.address?.toLowerCase().includes(keyword) ||
                String(applicant.receptionNumber).includes(keyword) ||
                applicant.tel?.includes(keyword)
            ) &&
            (
                groupFilter === "" ||
                applicant.groupName === groupFilter
            ) &&
            (
                positionFilter === "" ||
                applicant.positionName === positionFilter
            )
        );
    });

    // 申込者を削除
    const handleDelete = async () => {
        if (!selectedApplicant) return;

        try {
            const response = await fetch(
                `/api/admin/applicants/${selectedApplicant.applicantId}`,
                {
                    method: "DELETE",
                    credentials: "include",
                }
            );

            if (!response.ok) {
                const data = await response.json();
                console.error(data);
                alert("申込者の削除に失敗しました");
                return;
            }

            setApplicants((prev) =>
                prev.filter(
                    (applicant) =>
                        applicant.applicantId !== selectedApplicant.applicantId
                )
            );

            alert("申込者を削除しました");

            setShowDeleteModal(false);
            setSelectedApplicant(null);

        } catch (error) {
            console.error("申込者の削除に失敗しました", error);
            alert("申込者の削除に失敗しました");
        }
    };

    const handleConfirmCancel = () => {
        if (selectedApplicant?.cancelStatus === "REQUESTED") {
            handleApproveCancel();
        } else {
            handleCancel();
        }
    };

    // 直接キャンセル
    const handleCancel = async () => {
        if (!selectedApplicant) return;

        try {
            const response = await fetch(
                `/api/admin/applicants/${selectedApplicant.applicantId}/cancel`,
                {
                    method: "PUT",
                    credentials: "include",
                }
            );

            if (!response.ok) {
                alert("キャンセルに失敗しました");
                return;
            }

            setShowCancelModal(false);
            setSelectedApplicant(null);

            setApplicants((prev) =>
                prev.map((applicant) =>
                    applicant.applicantId === selectedApplicant.applicantId
                        ? { ...applicant, cancelStatus: "CANCELED" }
                        : applicant
                )
            );

            alert("キャンセルに成功しました");

        } catch (error) {
            console.error("キャンセルに失敗しました", error);
            alert("キャンセルに失敗しました");
        }
    };

// キャンセル承認
    const handleApproveCancel = async () => {
        if (!selectedApplicant) return;

        try {
            const response = await fetch(
                `/api/admin/applicants/${selectedApplicant.applicantId}/approve`,
                {
                    method: "PUT",
                    credentials: "include",
                }
            );

            if (!response.ok) {
                alert("キャンセル承認に失敗しました");
                return;
            }

            // 一覧を更新
            setApplicants((prev) =>
                prev.map((applicant) =>
                    applicant.applicantId === selectedApplicant.applicantId
                        ? { ...applicant, cancelStatus: "CANCELED" }
                        : applicant
                )
            );

            alert("キャンセルを承認しました");

            // モーダルを閉じる
            setShowCancelModal(false);
            setSelectedApplicant(null);

        } catch (error) {
            console.error("キャンセル承認に失敗しました", error);
            alert("キャンセル承認に失敗しました");
        }
    };

    return (
        <section>
            <div className="flex justify-start gap-x-10">
                <h1>参加申込者一覧</h1>
                <div className="flex gap-2 mb-4">
                    <input
                        type="text"
                        placeholder="検索したい文字列を入力してください"
                        className="input input-bordered min-w-75"
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                    />
                    <button className="btn btn-primary">
                        検索
                    </button>
                </div>
            </div>

            <div className="flex gap-2 flex-wrap my-5 items-center">
                <p className="font-semibold pr-3 w-40">ポジションを選択</p>
                <button
                    type="button"
                    className={`${
                        positionFilter === "" ? "filter-btn-active" : "filter-btn"
                    }`}
                    onClick={() => setPositionFilter("")}
                >
                    すべて
                </button>

                {positions.map((position) => (
                    <button
                        key={position}
                        type="button"
                        className={`${
                            positionFilter === position ? "filter-btn-active" : "filter-btn"
                        }`}
                        onClick={() => setPositionFilter(position)}
                    >
                        {position}
                    </button>
                ))}
            </div>


            {admin.role === "ROLE_SUPER_ADMIN" && (
                <div className="flex gap-2 flex-wrap my-5 items-center">
                    <p className="font-semibold pr-3 w-40">山車組を選択</p>
                    <button
                        type="button"
                        className={`${
                            positionFilter === "" ? "filter-btn-active" : "filter-btn"
                        }`}
                        onClick={() => setGroupFilter("")}
                    >
                        すべて
                    </button>
                    {groups.map((group) => (
                        <button
                            key={group}
                            type="button"
                            className={`${
                                positionFilter === group ? "filter-btn-active" : "filter-btn"
                            }`}
                            onClick={() => setGroupFilter(group)}
                        >
                            {group}
                        </button>
                    ))}
                </div>
            )}

            <div className="overflow-x-auto">
                <div className="float-right mb-5">
                    <button type="button"
                            onClick={() => navigate('/admin/applicants/register')}
                            className="add-data-btn"
                    >
                        ＋申込者を追加する
                    </button>
                </div>
                <table className="table">
                    <thead>
                        <tr>
                            <th>受付番号</th>
                            {admin.role === "ROLE_SUPER_ADMIN" && <th>山車組</th>}
                            <th>お名前</th>
                            <th>よみがな</th>
                            <th>年齢</th>
                            <th>ポジション</th>
                            <th>住所</th>
                            <th>電話番号</th>
                            <th>学校名</th>
                            <th>学年</th>
                            <th>連絡事項</th>
                            <th>メモ</th>
                            <th>キャンセル</th>
                            <th>編集</th>
                            <th>削除</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredApplicants.map((applicant) => (
                            <tr
                                key={applicant.applicantId}
                                className={`hover:bg-green-200 cursor-pointer ${
                                    applicant.cancelStatus === "CANCELED"
                                        ? "bg-base-300"
                                        : ""
                                }`}
                                onClick={() => navigate(`/admin/applicants/${applicant.applicantId}`)}
                            >
                                {/*受付番号*/}
                                <td className="text-center">{applicant.receptionNumber}</td>
                                {/*山車組：特権管理者の一覧のみ表示*/}
                                {admin.role === "ROLE_SUPER_ADMIN" && (
                                    <td>{applicant.groupName}</td>
                                )}
                                {/*お名前*/}
                                <td>{applicant.applicantName}</td>
                                {/*よみがな*/}
                                <td>{applicant.kana}</td>
                                {/*年齢*/}
                                <td className="text-center">{applicant.age}</td>

                                {/*ポジション*/}
                                <td className="text-center">{applicant.positionName}</td>
                                {/*住所*/}
                                <td>{applicant.address}</td>
                                {/*電話番号*/}
                                <td>{applicant.tel}</td>
                                {/*学校名*/}
                                <td className="text-center">{applicant.schoolName}</td>
                                {/*学年*/}
                                <td className="text-center">{applicant.schoolGrade}</td>
                                {/*連絡事項*/}
                                <td className="text-center font-lg" title={applicant.note || ""}>
                                    {applicant.note ? "●" : ""}
                                </td>
                                {/*メモ*/}
                                <td className="text-center" title={applicant.staffMemo || ""}>
                                    {applicant.staffMemo ? "●" : ""}
                                </td>
                                {/* キャンセルステータス */}
                                <td
                                    onClick={(e) => e.stopPropagation()}
                                    className="text-center"
                                >
                                    {applicant.cancelStatus === "REQUESTED" && (
                                        <button
                                            type="button"
                                            className="cancel-btn requested"
                                            onClick={() => {
                                                setSelectedApplicant(applicant);
                                                setShowCancelModal(true);
                                            }}
                                        >
                                            キャンセル承認
                                        </button>
                                    )}

                                    {applicant.cancelStatus === "CANCELED" && (
                                        <span className="cancel-btn canceled">
                                            キャンセル済み
                                        </span>
                                    )}

                                    {applicant.cancelStatus === "NONE" && (
                                        <button
                                            type="button"
                                            className="cancel-btn"
                                            onClick={() => {
                                                setSelectedApplicant(applicant);
                                                setShowCancelModal(true);
                                            }}
                                        >
                                            キャンセルする
                                        </button>
                                    )}
                                </td>

                                {/* 編集 */}
                                <td
                                    onClick={(e) => e.stopPropagation()}
                                    className="text-center"
                                >
                                    <Link
                                        to={`/admin/applicants/${applicant.applicantId}/edit`}
                                        state={{ from: "list" }}
                                        className="edit-icon"
                                    >
                                        <Pencil size={18} />
                                    </Link>
                                </td>

                                {/* 削除 */}
                                <td
                                    onClick={(e) => e.stopPropagation()}
                                    className="text-center"
                                >
                                    <button
                                        type="button"
                                        className="delete-icon"
                                        onClick={() => {
                                            setSelectedApplicant(applicant);
                                            setShowDeleteModal(true);
                                        }}
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {/*  削除確認モーダル  */}
            {showDeleteModal && (
                <div className="modal modal-open">
                    <div className="modal-box">

                        <h2 className="text-lg font-bold">
                            {selectedApplicant && (
                                `${selectedApplicant.applicantName}さんの申込を削除します`
                            )}
                        </h2>

                        <p className="py-4">
                            この申込者を削除してもよろしいですか？
                        </p>

                        <div className="modal-action">

                            <button
                                className="back-to-btn"
                                onClick={() => setShowDeleteModal(false)}
                            >
                                戻る
                            </button>

                            <button
                                className="btn btn-error"
                                onClick={handleDelete}
                            >
                                削除を実行する
                            </button>

                        </div>
                    </div>
                </div>
            )}

            {/*  キャンセル確認モーダル  */}
            {showCancelModal && (
                <div className="modal modal-open">
                    <div className="modal-box">

                        <h2 className="text-lg font-bold">
                            {selectedApplicant &&
                                `${selectedApplicant.applicantName}さんの申込を${
                                    selectedApplicant.cancelStatus === "REQUESTED"
                                        ? "キャンセル承認"
                                        : "キャンセル"
                                }します`
                            }
                        </h2>

                        <p className="py-4">
                            この申込を
                            {selectedApplicant?.cancelStatus === "REQUESTED"
                                ? "キャンセル承認"
                                : "キャンセル"
                            }
                            してもよろしいですか？
                        </p>

                        <div className="modal-action">

                            <button
                                className="back-to-btn"
                                onClick={() => {
                                    setShowCancelModal(false);
                                    setSelectedApplicant(null);
                                }}
                            >
                                戻る
                            </button>

                            <button
                                className="btn btn-error"
                                onClick={handleConfirmCancel}
                            >
                                {selectedApplicant?.cancelStatus === "REQUESTED"
                                    ? "キャンセルを承認する"
                                    : "キャンセルする"
                                }
                            </button>

                        </div>
                    </div>
                </div>
            )}
        </section>
    );
}

export default AdminApplicants;