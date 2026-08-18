import {
    LuBookmark,
    LuCalendarDays,
    LuChevronRight,
    LuClapperboard,
    LuEye,
    LuHeart,
    LuLockKeyhole, LuLogIn,
    LuMail,
    LuMessageSquare,
    LuPencil,
    LuSettings,
    LuStar,
    LuUser,
} from "react-icons/lu";
import {useAuthStore} from "../../store/authStore.js";
import {formatingDate, formatingTime} from "../../utils/dateUtils.js";
import {Link, useLocation, useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import {getMyPageApi} from "../../api/common/UserApi.js";
import LoadingSpinner from "../../components/common/LoadingSpinner.jsx";
import {toast} from "sonner";

export default function MyPage() {
    const {isLogin, user, subscribe} = useAuthStore();
    const navigate = useNavigate();
    const location = useLocation();
    const [loading, setLoading] = useState(true);

    const [myPage, setMyPage] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await getMyPageApi();
                setMyPage(res || null)
            } catch (error) {
                console.error('에러 발생', error);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, [])

    useEffect(() => {
        if (location.state?.changePasswordSuccess) {
            toast.success('비밀번호를 변경했습니다.');
        }
        if (location.state?.changeUserInfoSuccess) {
            toast.success('사용자를 수정했습니다.');
        }
    }, [])

    useEffect(() => {
        if (!isLogin) {
            navigate("/auth/login");
        }
    }, [isLogin, navigate]);

    if (!isLogin || !user) {
        return null;
    }

    if (loading) {
        return <LoadingSpinner/>;
    }

    return (
        <main className="min-h-screen px-5 pb-20 pt-24 text-white sm:px-8 lg:px-12">
            <section className="mx-auto max-w-7xl">
                {/* 페이지 제목 */}
                <div className="mb-8">
                    <p className="text-xs font-semibold tracking-[0.2em] text-primary">
                        MY CINEVERSE
                    </p>

                    <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
                        마이페이지
                    </h1>

                    <p className="mt-2 text-sm text-muted">
                        프로필과 나의 활동 내역을 확인할 수 있습니다.
                    </p>
                </div>

                {/* 프로필 */}
                <section
                    className="
                    relative overflow-hidden rounded-3xl
                    border border-border bg-card
                    p-6 sm:p-8
                "
                >
                    {/* 배경 효과 */}
                    <div
                        className="
                        pointer-events-none absolute
                        -right-24 -top-32
                        h-80 w-80 rounded-full
                        bg-primary/10 blur-3xl
                    "
                    />

                    <div className="relative grid gap-8 lg:grid-cols-[1fr_320px] lg:items-stretch">
                        {/* 기본 회원 정보 */}
                        <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
                            {/* 프로필 이미지 */}
                            <div className="relative mx-auto shrink-0 sm:mx-0">
                                <div
                                    className="
                                    flex h-28 w-28 items-center justify-center
                                    rounded-full bg-gradient-to-br
                                    from-primary to-secondary
                                    text-3xl font-bold text-white
                                    ring-4 ring-white/5
                                    sm:h-32 sm:w-32
                                "
                                />

                                <span
                                    className="
                                    absolute bottom-1 right-1
                                    h-4 w-4 rounded-full
                                    border-4 border-card
                                    bg-emerald-400
                                "
                                />
                            </div>

                            <div className="min-w-0 flex-1 text-center sm:text-left">
                                <div className="flex flex-wrap items-center justify-center gap-3 sm:justify-start">
                                    <h2 className="truncate text-2xl font-bold text-white">
                                        {user.nickname || user.email}
                                    </h2>

                                    {subscribe && (
                                        <span
                                            className="
                                            rounded-full bg-primary/10
                                            px-3 py-1
                                            text-xs font-semibold text-primary
                                        "
                                        >
                                        구독 중
                                    </span>
                                    )}
                                </div>

                                <div className="mt-5 space-y-2.5">
                                    <div
                                        className="flex items-center justify-center gap-2 text-sm text-muted sm:justify-start">
                                        <LuMail className="shrink-0"/>
                                        <span className="truncate">
                                        {user.email}
                                    </span>
                                    </div>

                                    <div
                                        className="flex items-center justify-center gap-2 text-sm text-muted sm:justify-start">
                                        <LuCalendarDays className="shrink-0"/>
                                        <span>
                                        {formatingDate(user.createdAt)} 가입
                                    </span>
                                    </div>

                                    <div
                                        className="flex items-center justify-center gap-2 text-sm text-muted sm:justify-start">
                                        <LuLogIn className="shrink-0"/>

                                        <span>
                                        마지막 로그인{" "}
                                            {user.lastLoginAt
                                                ? formatingTime(user.lastLoginAt)
                                                : "기록 없음"}
                                    </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 구독 정보 */}
                        <div
                            className="
                            flex flex-col justify-between
                            rounded-2xl border border-primary/20
                            bg-gradient-to-br
                            from-primary/10 to-primary/[0.02]
                            p-5 sm:p-6
                        "
                        >
                            <div>
                                <div className="flex items-center justify-between">
                                <span
                                    className="
                                        flex h-11 w-11 items-center
                                        justify-center rounded-xl
                                        bg-primary/15 text-lg text-primary
                                    "
                                >
                                    <LuStar className={subscribe ? "fill-primary" : ""}/>
                                </span>

                                    <span
                                        className={`
                                        rounded-full px-3 py-1
                                        text-xs font-semibold
                                        ${
                                            subscribe
                                                ? "bg-emerald-400/10 text-emerald-400"
                                                : "bg-white/5 text-muted"
                                        }
                                    `}
                                    >
                                        이용중
                                </span>
                                </div>

                                <p className="mt-5 text-xs font-medium text-muted">
                                    현재 이용권
                                </p>

                                <h3 className="mt-1 text-xl font-bold text-white">
                                    {myPage.subscriptionPlan.name}
                                </h3>
                            </div>

                            <div className="mt-8 border-t border-primary/10 pt-4">
                                <div className="flex items-center justify-between gap-4">
                                <span className="text-sm text-muted">
                                    구독 종료일
                                </span>

                                    <strong className="text-sm font-semibold text-foreground">
                                        {formatingDate(myPage.subscriptionPlan.currentPeriodEndAt)}
                                    </strong>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 활동 통계 */}
                <section className="mt-10">
                    <div className="mb-4 flex items-end justify-between">
                        <div>
                            <h2 className="text-lg font-bold">
                                나의 활동
                            </h2>

                            <p className="mt-1 text-xs text-muted">
                                시네버스에서 남긴 활동 기록입니다.
                            </p>
                        </div>

                        <span className="text-xs text-muted">
                        전체 활동 기준
                    </span>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">

                        {/* 작성한 리뷰 */}
                        <Link to={'/mypage/reviewlist'} className="group flex items-center gap-5 rounded-2xl border border-border
                                    bg-card p-5 transition hover:-translate-y-0.5 hover:border-white/20">
                            <div
                                className={`flex h-12 w-12 shrink-0
                                        items-center justify-center
                                        rounded-2xl bg-blue-400/10 text-blue-400`}>
                                <LuMessageSquare className="text-xl"/>
                            </div>

                            <div className="min-w-0">
                                <p className="text-sm text-muted">
                                    {myPage.userSummaryList[0].title}
                                </p>

                                <p className="mt-1 text-2xl font-bold text-white">
                                    {myPage.userSummaryList[0].value}
                                </p>
                            </div>

                            <LuChevronRight className="ml-auto text-muted/40 transition-transform
                                        group-hover:translate-x-1 group-hover:text-muted"/>
                        </Link>

                        {/* 찜한 콘텐츠 */}
                        <Link to={'/mypage/wishlist'} className="group flex items-center gap-5 rounded-2xl border border-border
                                    bg-card p-5 transition hover:-translate-y-0.5 hover:border-white/20">
                            <div
                                className={`flex h-12 w-12 shrink-0
                                        items-center justify-center
                                        rounded-2xl bg-red-400/10 text-red-400`}>
                                <LuHeart className="text-xl"/>
                            </div>

                            <div className="min-w-0">
                                <p className="text-sm text-muted">
                                    {myPage.userSummaryList[1].title}
                                </p>

                                <p className="mt-1 text-2xl font-bold text-white">
                                    {myPage.userSummaryList[1].value}
                                </p>
                            </div>

                            <LuChevronRight className="ml-auto text-muted/40 transition-transform
                                        group-hover:translate-x-1 group-hover:text-muted"/>
                        </Link>

                    </div>
                </section>

                {/* 리뷰 / 계정 설정 */}
                <div className="mt-10 grid gap-8 xl:grid-cols-[1.35fr_0.65fr]">
                    {/* 최근 리뷰 */}
                    <section>
                        <div className="mb-4 flex items-end justify-between">
                            <div>
                                <h2 className="text-lg font-bold">
                                    최근 작성한 리뷰
                                </h2>

                                <p className="mt-1 text-xs text-muted">
                                    최근 작성한 리뷰를 확인해 보세요.
                                </p>
                            </div>

                            <Link to="/mypage/reviewlist"
                                  className="
                                flex items-center gap-1
                                text-sm text-muted transition
                                hover:text-white
                            "
                            >
                                전체 보기
                                <LuChevronRight/>
                            </Link>
                        </div>

                        <div className="overflow-hidden rounded-2xl border border-border bg-card">
                            {myPage.contentReviews.map((review, index) => (
                                <Link to={`/review/${review.contentReviewId}`} key={index}>
                                    <article
                                        className="
                                    group border-b border-border
                                    px-5 py-5
                                    transition-colors
                                    last:border-b-0
                                    hover:bg-white/[0.03]
                                    sm:px-6
                                "
                                    >
                                        <div className="flex items-start gap-4">
                                            <div
                                                className="
                                            flex h-11 w-11 shrink-0
                                            items-center justify-center
                                            rounded-xl bg-primary/10
                                            text-primary
                                        "
                                            >
                                                <LuClapperboard/>
                                            </div>

                                            <div className="min-w-0 flex-1">
                                                <div className="flex items-start justify-between gap-4">
                                                    <h3 className="truncate font-semibold text-foreground">
                                                        {review.contentTitle}
                                                    </h3>

                                                    <div
                                                        className="
                                                    flex shrink-0 items-center gap-1
                                                    rounded-lg bg-amber-300/10
                                                    px-2.5 py-1
                                                    text-sm font-semibold
                                                    text-amber-300
                                                "
                                                    >
                                                        <LuStar className="fill-amber-300"/>
                                                        {review.score}
                                                    </div>
                                                </div>

                                                <p className="mt-2 line-clamp-2 text-sm leading-6 text-muted">
                                                    {review.reviewTitle}
                                                </p>

                                                <p className="mt-3 text-xs text-muted/60">
                                                    {formatingDate(review.createdAt)}
                                                </p>
                                            </div>
                                        </div>
                                    </article>
                                </Link>
                            ))}
                        </div>
                    </section>

                    {/* 계정 설정 */}
                    <section>
                        <div className="mb-4">
                            <h2 className="text-lg font-bold">
                                계정 설정
                            </h2>

                            <p className="mt-1 text-xs text-muted">
                                회원 정보를 안전하게 관리하세요.
                            </p>
                        </div>

                        <div className="overflow-hidden rounded-2xl border border-border bg-card">
                            <Link to={'/mypage/modify'}>
                                <SettingItem
                                    icon={LuUser}
                                    title="회원 정보 수정"
                                    description="닉네임과 이메일 정보를 변경합니다."
                                />
                            </Link>

                            <Link to={'/mypage/modify/password'}>
                                <SettingItem
                                    icon={LuLockKeyhole}
                                    title="비밀번호 변경"
                                    description="계정 비밀번호를 변경합니다."
                                />
                            </Link>
                        </div>
                    </section>
                </div>
            </section>
        </main>
    );
}

function SettingItem({icon: Icon, title, description}) {
    return (
        <button
            type="button"
            className="
                group flex w-full items-center gap-4
                border-b border-border
                px-5 py-5 text-left
                transition-colors
                last:border-b-0
                hover:bg-white/[0.03]
            "
        >
            <span
                className="
                    flex h-11 w-11 shrink-0
                    items-center justify-center
                    rounded-xl bg-background
                    text-muted transition-colors
                    group-hover:bg-primary/10
                    group-hover:text-primary
                "
            >
                <Icon/>
            </span>

            <span className="min-w-0 flex-1">
                <span className="block text-sm font-semibold text-foreground">
                    {title}
                </span>

                <span className="mt-1 block truncate text-xs text-muted">
                    {description}
                </span>
            </span>

            <LuChevronRight
                className="
                    shrink-0 text-muted/40
                    transition-transform
                    group-hover:translate-x-1
                    group-hover:text-muted
                "
            />
        </button>
    );
}