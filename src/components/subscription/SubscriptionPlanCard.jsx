import {formatDate} from "../../utils/subscriptionUtils.js";
import {preparePaymentApi} from "../../api/common/PaymentApi.js";
import {useNavigate} from "react-router-dom";

export default function SubscriptionPlanCard({plan}) {
    const navigate = useNavigate();

    // 구독하기
    const handlePreparePayment = async () => {

        const paymentPrepareRequestDTO = {
            subscriptionPlanId: plan.subscriptionPlanId,
        }

        try {
            const res = await preparePaymentApi(paymentPrepareRequestDTO);
            navigate(`/payment/checkout/${res.orderId}`);
        } catch (error) {
            console.error('에러 발생', error);
        }
    }

    return (
        <article
            className={`flex flex-col justify-between relative overflow-hidden rounded-2xl border p-7 transition
                ${plan.subscribed ? "border-primary/60 bg-primary/10 shadow-lg shadow-primary/5"
                    : "border-white/10 bg-white/[0.04] hover:border-white/20 hover:bg-white/[0.06]"}`}>
            {plan.subscribed && (
                <span className="absolute right-5 top-5 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-white">
                    구독 중
                </span>
            )}

            <div>
                <h2 className="text-lg font-bold text-white">
                    {plan.name}
                </h2>

                <p className="mt-3 text-3xl font-bold text-white">
                    {plan.amount.toLocaleString("ko-KR")}원

                    <span className="ml-1 text-sm font-normal text-white/50">
                        / {plan.billingCycleMonths}개월
                    </span>
                </p>
            </div>

            {plan.subscribed ? (
                <div className="mt-8">
                    <div className="rounded-xl bg-black/20 p-4">
                        <p className="text-sm text-white/50">
                            이용 만료일
                        </p>

                        <p className="mt-1 font-medium text-white">
                            {formatDate(plan.currentPeriodEndAt)}
                        </p>
                    </div>

                    <button type="button" disabled className="mt-6 w-full cursor-default rounded-lg bg-primary/20 py-3
                        font-semibold text-primary">
                        현재 이용 중
                    </button>
                </div>
            ) : (
                <button type="button" onClick={handlePreparePayment} className="mt-8 w-full rounded-lg bg-primary
                    py-3 font-semibold text-white transition hover:bg-primary/90 cursor-pointer">
                    구독하기
                </button>
            )}
        </article>
    );
}