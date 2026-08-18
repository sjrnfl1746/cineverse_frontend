import {LuClapperboard, LuUsers, LuCreditCard, LuWallet, LuClock3, LuCircleCheck} from "react-icons/lu";
import {Link} from "react-router-dom";
import TitleLabel from "../../components/admin/TitleLabel.jsx";

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    Filler
} from "chart.js";
import {Bar, Line} from "react-chartjs-2";
import {useEffect, useState} from "react";
import LoadingSpinner from "../../components/common/LoadingSpinner.jsx";
import {getDashboardDataApi} from "../../api/admin/AdminDashboardApi.js";
import {formatTimeAgo} from "../../utils/dateUtils.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, Filler);

export default function AdminDashBoard() {
    const [loading, setLoading] = useState(true);

    const [dashboardStats, setDashboardStats] = useState([]);
    const [contentStatusList, setContentStatusList] = useState([]);
    const [recentContents, setRecentContents] = useState([]);
    const [recentUsers, setRecentUsers] = useState([]);
    const [recentPayments, setRecentPayments] = useState([]);
    const [monthlyRevenueList, setMonthlyRevenueList] = useState([]);
    const [topViewedContents, setTopViewedContents] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await getDashboardDataApi();
                setDashboardStats(res.summaryList)
                setContentStatusList(res.contentStatusList)
                setRecentContents(res.contentList)
                setRecentUsers(res.userList)
                setRecentPayments(res.recentPaymentList)
                setMonthlyRevenueList(res.monthlySalesList)
                setTopViewedContents(res.contentTopViewList)
            } catch (error) {
                console.error('에러 발생', error);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, [])

    const formatNumber = (value) => {
        return new Intl.NumberFormat("ko-KR").format(value);
    }

    const formatStatus = (status) => {
        if (status === 'PUBLISHED') {
            return '공개중'
        }
        if (status === 'READY') {
            return '준비중'
        }
        if (status === 'END') {
            return '종료'
        }
        if (status === 'HIDDEN') {
            return '숨김'
        }
    };

    const StatusBadge = ({status}) => {
        const statusClass = {
            "PUBLISHED": "bg-green-500/10 text-green-400",
            "READY": "bg-blue-500/10 text-blue-400",
            "END": "bg-zinc-500/10 text-zinc-400"
        };

        return (
            <span
                className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium
                ${statusClass[status] ?? "bg-zinc-500/10 text-zinc-400"}`}
            >
            {formatStatus(status)}
        </span>
        );
    }

    const monthlyRevenueChartData = {
        labels: monthlyRevenueList.map((item) => item.month),
        datasets: [
            {
                label: "월별 매출",
                data: monthlyRevenueList.map((item) => item.amount),
                borderColor: "#5B8CFF",
                backgroundColor: "rgba(91, 140, 255, 0.15)",
                pointBackgroundColor: "#5B8CFF",
                pointBorderColor: "#5B8CFF",
                pointRadius: 4,
                pointHoverRadius: 6,
                borderWidth: 2,
                fill: true,
                tension: 0.35
            }
        ]
    };

    const monthlyRevenueChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
            mode: "index",
            intersect: false
        },
        plugins: {
            legend: {
                display: false
            },
            tooltip: {
                callbacks: {
                    label: (context) => {
                        return ` 매출: ₩${formatNumber(context.raw)}`;
                    }
                }
            }
        },
        scales: {
            x: {
                grid: {
                    display: false
                },
                ticks: {
                    color: "#9CA3AF"
                },
                border: {
                    color: "rgba(255, 255, 255, 0.08)"
                }
            },
            y: {
                beginAtZero: true,
                grid: {
                    color: "rgba(255, 255, 255, 0.06)"
                },
                ticks: {
                    color: "#9CA3AF",
                    callback: (value) => {
                        if (value >= 10000000) {
                            return `${value / 10000000}천만`;
                        }

                        if (value >= 10000) {
                            return `${value / 10000}만`;
                        }

                        return formatNumber(value);
                    }
                },
                border: {
                    display: false
                }
            }
        }
    };

    const topViewedChartData = {
        labels: topViewedContents.map((content) => content.title),
        datasets: [
            {
                label: "시청 횟수",
                data: topViewedContents.map((content) => content.viewCnt),
                backgroundColor: "rgba(91, 140, 255, 0.75)",
                borderColor: "#5B8CFF",
                borderWidth: 1,
                borderRadius: 6,
                barThickness: 20
            }
        ]
    };

    const topViewedChartOptions = {
        indexAxis: "y",
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false
            },
            tooltip: {
                callbacks: {
                    label: (context) => {
                        return ` 시청 횟수: ${formatNumber(context.raw)}회`;
                    }
                }
            }
        },
        scales: {
            x: {
                beginAtZero: true,
                grid: {
                    color: "rgba(255, 255, 255, 0.06)"
                },
                ticks: {
                    color: "#9CA3AF",
                    callback: (value) => `${formatNumber(value)}회`
                },
                border: {
                    display: false
                }
            },
            y: {
                grid: {
                    display: false
                },
                ticks: {
                    color: "#E5E7EB",
                    font: {
                        size: 12
                    }
                },
                border: {
                    color: "rgba(255, 255, 255, 0.08)"
                }
            }
        }
    };

    if (loading) {
        return <LoadingSpinner/>
    }

    return (
        <div className="space-y-8">
            <TitleLabel
                title="대시보드"
                desc="CINEVERSE 서비스의 주요 현황을 한눈에 확인합니다."
            />

            {/* 통계 카드 */}
            <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {dashboardStats.map((stat) => {
                    const summaryIconMap = {
                        "전체 콘텐츠": LuClapperboard,
                        "전체 회원": LuUsers,
                        "구독 회원": LuCreditCard,
                        "이번 달 매출": LuWallet
                    };

                    const summaryUnitMap = {
                        "전체 콘텐츠": '개',
                        "전체 회원": '명',
                        "구독 회원": '명',
                    }

                    const Icon = summaryIconMap[stat.title] ?? LuWallet;

                    return (
                        <div
                            key={stat.title}
                            className="rounded-2xl border border-border bg-card p-5"
                        >
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="text-sm text-muted-foreground">
                                        {stat.title}
                                    </p>

                                    <p className="mt-3 text-2xl font-bold text-foreground">
                                        {stat.money
                                            ? `₩${formatNumber(stat.value)}`
                                            : `${formatNumber(stat.value)}${summaryUnitMap[stat.title]}`
                                        }
                                    </p>
                                </div>

                                <div
                                    className="flex h-11 w-11 items-center justify-center
                                        rounded-xl bg-primary/10 text-primary"
                                >
                                    <Icon size={22}/>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </section>

            {/* 월별 매출 + 최고 시청 영화 */}
            <section className="grid gap-6 xl:grid-cols-2">
                {/* 월별 매출 */}
                <div className="rounded-2xl border border-border bg-card p-6">
                    <div className="mb-6 flex items-start justify-between">
                        <div>
                            <h2 className="text-lg font-semibold text-foreground">
                                {new Date().getFullYear()}년 월별 매출
                            </h2>

                            <p className="mt-1 text-sm text-muted-foreground">
                                월별 완료된 구독 결제 금액입니다.
                            </p>
                        </div>

                        <span
                            className="rounded-lg bg-primary/10 px-3 py-1.5
                    text-xs font-semibold text-primary"
                        >
                {new Date().getFullYear()}년
            </span>
                    </div>

                    <div className="h-80">
                        <Line
                            data={monthlyRevenueChartData}
                            options={monthlyRevenueChartOptions}
                        />
                    </div>
                </div>

                {/* 최고 시청 영화 */}
                <div className="rounded-2xl border border-border bg-card p-6">
                    <div className="mb-6 flex items-start justify-between">
                        <div>
                            <h2 className="text-lg font-semibold text-foreground">
                                최고 시청 영화
                            </h2>

                            <p className="mt-1 text-sm text-muted-foreground">
                                누적 시청 횟수가 높은 영화 TOP 5입니다.
                            </p>
                        </div>

                        <span
                            className="rounded-lg bg-primary/10 px-3 py-1.5
                    text-xs font-semibold text-primary"
                        >
                TOP 5
            </span>
                    </div>

                    <div className="h-80">
                        <Bar
                            data={topViewedChartData}
                            options={topViewedChartOptions}
                        />
                    </div>
                </div>
            </section>

            {/* 콘텐츠 현황 + 최근 등록 콘텐츠 */}
            <section className="grid gap-6 xl:grid-cols-2">
                <div className="rounded-2xl border border-border bg-card p-6">
                    <div className="mb-6">
                        <h2 className="text-lg font-semibold text-foreground">
                            콘텐츠 현황
                        </h2>
                        <p className="mt-1 text-sm text-muted-foreground">
                            콘텐츠 공개 상태별 등록 수입니다.
                        </p>
                    </div>

                    <div className="space-y-6">
                        {contentStatusList.map((item) => (
                            <div key={item.contentStatus}>
                                <div className="mb-2 flex items-center justify-between">
                                    <span className="text-sm font-medium text-foreground">
                                        {formatStatus(item.contentStatus)}
                                    </span>

                                    <span className="text-sm text-muted-foreground">
                                        {item.value}개
                                    </span>
                                </div>

                                <div className="h-2 overflow-hidden rounded-full bg-muted">
                                    <div
                                        className="h-full rounded-full bg-primary"
                                        style={{width: `${item.percent}%`}}
                                    />
                                </div>

                                <p className="mt-2 text-right text-xs text-muted-foreground">
                                    전체의 {item.percent}%
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="rounded-2xl border border-border bg-card">
                    <div className="flex items-center justify-between border-b border-border p-6">
                        <div>
                            <h2 className="text-lg font-semibold text-foreground">
                                최근 등록 콘텐츠
                            </h2>
                            <p className="mt-1 text-sm text-muted-foreground">
                                최근 관리자에 의해 등록된 콘텐츠입니다.
                            </p>
                        </div>

                        <Link
                            to="/admin/content"
                            className="text-sm font-medium text-primary hover:underline"
                        >
                            전체 보기
                        </Link>
                    </div>

                    <div className="divide-y divide-border">
                        {recentContents.map((content) => (
                            <Link
                                key={content.contentId}
                                to={`/admin/content/${content.contentId}`}
                                className="flex items-center justify-between px-6 py-4
                                    transition-colors hover:bg-muted/40"
                            >
                                <div>
                                    <p className="font-medium text-foreground">
                                        {content.title}
                                    </p>

                                    <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                                        <LuClock3 size={13}/>
                                        {formatTimeAgo(content.createdAt)}
                                    </p>
                                </div>

                                <StatusBadge status={content.contentStatus}/>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* 최근 회원 + 최근 결제 */}
            <section className="grid gap-6 xl:grid-cols-2">
                <div className="rounded-2xl border border-border bg-card">
                    <div className="flex items-center justify-between border-b border-border p-6">
                        <div>
                            <h2 className="text-lg font-semibold text-foreground">
                                최근 가입 회원
                            </h2>
                            <p className="mt-1 text-sm text-muted-foreground">
                                최근 CINEVERSE에 가입한 회원입니다.
                            </p>
                        </div>

                        <Link
                            to="/admin/user"
                            className="text-sm font-medium text-primary hover:underline"
                        >
                            전체 보기
                        </Link>
                    </div>

                    <div className="divide-y divide-border">
                        {recentUsers.map((user) => (
                            <div
                                key={user.userId}
                                className="flex items-center justify-between px-6 py-4"
                            >
                                <div className="flex min-w-0 items-center gap-3">
                                    <div className="h-10 w-10 rounded-full bg-gradient-to-r from-primary to-secondary"/>

                                    <div className="min-w-0">
                                        <p className="font-medium text-foreground">
                                            {user.name}
                                        </p>

                                        <p className="truncate text-xs text-muted-foreground">
                                            {user.email}
                                        </p>
                                    </div>
                                </div>

                                <span className="shrink-0 text-xs text-muted-foreground">
                                    {formatTimeAgo(user.createdAt)}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="rounded-2xl border border-border bg-card">
                    <div className="border-b border-border p-6">
                        <h2 className="text-lg font-semibold text-foreground">
                            최근 결제
                        </h2>
                        <p className="mt-1 text-sm text-muted-foreground">
                            최근 완료된 구독 결제 내역입니다.
                        </p>
                    </div>

                    <div className="divide-y divide-border">
                        {recentPayments.map((payment) => (
                            <div
                                key={payment.paymentId}
                                className="flex items-center justify-between px-6 py-4"
                            >
                                <div className="flex items-center gap-3">
                                    <div
                                        className="flex h-10 w-10 items-center justify-center
                                            rounded-xl bg-green-500/10 text-green-400"
                                    >
                                        <LuCircleCheck size={20}/>
                                    </div>

                                    <div>
                                        <p className="font-medium text-foreground">
                                            {payment.name}
                                        </p>

                                        <p className="mt-1 text-xs text-muted-foreground">
                                            {payment.plan} · {formatTimeAgo(payment.paidAt)}
                                        </p>
                                    </div>
                                </div>

                                <p className="font-semibold text-foreground">
                                    ₩{formatNumber(payment.amount)}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}