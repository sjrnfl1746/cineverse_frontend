import {useEffect, useState} from "react";
import LoadingSpinner from "../../components/common/LoadingSpinner.jsx";
import SubscriptionPlanCard from "../../components/subscription/SubscriptionPlanCard.jsx";
import {getSubscriptionPlanListApi} from "../../api/common/SubscriptionApi.js";

export default function SubscriptionManage() {
    const [loading, setLoading] = useState(true);
    const [plans, setPlans] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await getSubscriptionPlanListApi();
                setPlans(res);
            } catch (error) {
                console.error('에러 발생', error);
                setPlans([]);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, [])

    if (loading) {
        return <LoadingSpinner/>
    }

    return (
        <>
            <section className="min-h-screen bg-background px-6 py-20">
                <div className="mx-auto max-w-7xl">
                    <div className="mt-10 mb-10">
                        <h1 className="text-3xl font-bold text-white">
                            구독 관리
                        </h1>

                        <p className="mt-2 text-white">
                            원하는 구독 상품을 선택해 주세요.
                        </p>
                    </div>

                    {plans.length < 0 ? (
                        <div
                            className="flex min-h-60 items-center justify-center rounded-xl border border-white/10 bg-white/5">
                            <p className="text-sm text-gray-400">
                                현재 이용 가능한 구독 플랜이 없습니다.
                            </p>
                        </div>
                    ) : (<div className="grid gap-6 md:grid-cols-3">
                        {plans.map((plan) => (
                            <SubscriptionPlanCard key={plan.subscriptionPlanId} plan={plan}/>
                        ))}
                    </div>)}
                </div>
            </section>
        </>
    )
}