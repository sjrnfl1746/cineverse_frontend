import {useState} from "react";
import {useNavigate} from "react-router-dom";
import {
    LuArrowLeft,
    LuBell,
    LuPin,
} from "react-icons/lu";

import TitleLabel from "../../../components/admin/TitleLabel.jsx";
import {addNoticeApi} from "../../../api/admin/AdminNoticeApi.js";
import {toast} from "sonner";

export default function AdminNoticeAdd() {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        title: "",
        content: "",
        pinned: false,
    });

    const [submitting, setSubmitting] = useState(false);

    const handleChange = (e) => {
        const {name, value, type, checked} = e.target;

        setForm((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const title = form.title.trim();
        const content = form.content.trim();

        if (!title) {
            toast.error("공지 제목을 입력해 주세요.");
            return;
        }

        if (!content) {
            toast.error("공지 내용을 입력해 주세요.");
            return;
        }

        try {
            setSubmitting(true);

            await addNoticeApi({
                title,
                content,
                pinned: form.pinned,
            });

            navigate("/admin/notice", {
                state: {
                    addNoticeSuccess: true,
                },
            });
        } catch (error) {
            console.error("공지 등록 중 에러 발생", error);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <>
            <TitleLabel
                title="공지 등록"
                desc="새로운 공지를 등록합니다."
            />

            <form onSubmit={handleSubmit} className="mt-8">
                <section className="overflow-hidden rounded-2xl border border-border bg-card">
                    {/* 폼 제목 */}
                    <div className="flex items-center gap-3 border-b border-border px-6 py-5 sm:px-8">
                        <div
                            className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                            <LuBell className="text-lg"/>
                        </div>

                        <div>
                            <h2 className="font-semibold text-foreground">
                                공지 정보
                            </h2>
                            <p className="mt-0.5 text-xs text-muted">
                                공지에 표시할 제목과 내용을 입력해 주세요.
                            </p>
                        </div>
                    </div>

                    <div className="space-y-7 px-6 py-7 sm:px-8 sm:py-8">
                        {/* 제목 */}
                        <div>
                            <div className="mb-2 flex items-center justify-between">
                                <label
                                    htmlFor="title"
                                    className="text-sm font-semibold text-foreground"
                                >
                                    제목
                                </label>

                                <span className="text-xs text-muted">
                                    {form.title.length} / 100
                                </span>
                            </div>

                            <input
                                id="title"
                                type="text"
                                name="title"
                                value={form.title}
                                maxLength={100}
                                disabled={submitting}
                                placeholder="공지 제목을 입력해 주세요."
                                onChange={handleChange}
                                className="w-full rounded-xl border border-border bg-background px-4 py-3
                                    text-sm text-foreground outline-none transition placeholder:text-muted/60
                                    focus:outline-none disabled:cursor-not-allowed disabled:opacity-60"/>
                        </div>

                        {/* 내용 */}
                        <div>
                            <div className="mb-2 flex items-center justify-between">
                                <label
                                    htmlFor="content"
                                    className="text-sm font-semibold text-foreground"
                                >
                                    내용
                                    <span className="ml-1 text-red-400">*</span>
                                </label>

                                <span className="text-xs text-muted">
                                    {form.content.length.toLocaleString()} / 2000
                                </span>
                            </div>

                            <textarea
                                id="content"
                                name="content"
                                value={form.content}
                                rows={14}
                                maxLength={2000}
                                disabled={submitting}
                                placeholder="공지 내용을 입력해 주세요."
                                onChange={handleChange}
                                className="min-h-80 w-full resize-y rounded-xl border border-border
                                    bg-background px-4 py-4 text-sm leading-7 text-foreground
                                    outline-none transition placeholder:text-muted/60 focus:outline-none
                                    disabled:cursor-not-allowed disabled:opacity-60"/>
                        </div>

                        {/* 고정 설정 */}
                        <div className="rounded-xl border border-border bg-background/40 p-4">
                            <label
                                htmlFor="pinned"
                                className="flex cursor-pointer items-start justify-between gap-4"
                            >
                                <div className="flex gap-3">
                                    <div
                                        className={`
                                            mt-0.5 flex h-9 w-9 shrink-0
                                            items-center justify-center
                                            rounded-lg transition-colors
                                            ${
                                            form.pinned
                                                ? "bg-red-500/10 text-red-400"
                                                : "bg-background text-muted"
                                        }
                                        `}
                                    >
                                        <LuPin/>
                                    </div>

                                    <div>
                                        <p className="text-sm font-semibold text-foreground">
                                            상단 고정
                                        </p>

                                        <p className="mt-1 text-xs leading-5 text-muted">
                                            중요한 공지를 목록 상단에 고정합니다.
                                        </p>
                                    </div>
                                </div>

                                <div className="relative mt-1 shrink-0">
                                    <input
                                        id="pinned"
                                        type="checkbox"
                                        name="pinned"
                                        checked={form.pinned}
                                        disabled={submitting}
                                        onChange={handleChange}
                                        className="peer sr-only"
                                    />

                                    <div
                                        className="
                                            h-6 w-11 rounded-full bg-border
                                            transition-colors
                                            peer-checked:bg-primary
                                            peer-focus-visible:ring-2
                                            peer-focus-visible:ring-primary/40
                                            peer-disabled:cursor-not-allowed
                                            peer-disabled:opacity-60
                                        "
                                    />

                                    <div
                                        className="
                                            absolute left-1 top-1
                                            h-4 w-4 rounded-full bg-white
                                            shadow-sm transition-transform
                                            peer-checked:translate-x-5
                                        "
                                    />
                                </div>
                            </label>
                        </div>
                    </div>
                </section>

                {/* 하단 버튼 */}
                <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                    <button
                        type="button"
                        disabled={submitting}
                        onClick={() => navigate("/admin/notice")}
                        className="
                            inline-flex items-center justify-center gap-2
                            rounded-xl border border-border
                            px-5 py-3 text-sm font-semibold text-muted
                            transition
                            hover:border-gray-400 hover:text-foreground
                            disabled:cursor-not-allowed disabled:opacity-60
                        "
                    >
                        <LuArrowLeft/>
                        취소
                    </button>

                    <button
                        type="submit"
                        disabled={submitting}
                        className="
                            inline-flex min-w-32 items-center justify-center
                            gap-2 rounded-xl bg-primary
                            px-5 py-3 text-sm font-semibold text-white
                            transition hover:bg-primary-hover
                            disabled:cursor-not-allowed disabled:opacity-60
                        "
                    >

                        {submitting ? "등록 중..." : "공지 등록"}
                    </button>
                </div>
            </form>
        </>
    );
}