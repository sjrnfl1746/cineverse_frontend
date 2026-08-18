import {loadTossPayments, ANONYMOUS} from "@tosspayments/tosspayments-sdk";
import {useEffect, useState} from "react";
import LoadingSpinner from "../../components/common/LoadingSpinner.jsx";
import {getPaymentApi} from "../../api/common/PaymentApi.js";
import {Link, useParams} from "react-router-dom";

const clientKey = import.meta.env.VITE_TOSS_CLIENT_KEY;

export function CheckoutPage() {
    const {orderId} = useParams();

    const [loading, setLoading] = useState(true);
    const [paymentData, setPaymentData] = useState(null); // 결제 관련 데이터
    const [widgets, setWidgets] = useState(null);
    const [ready, setReady] = useState(false);

    const [amount, setAmount] = useState({
        currency: "KRW",
        value: 0,
    });

    const formattedAmount = paymentData?.amount?.toLocaleString("ko-KR");

    // 결제 관련 데이터 조회
    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await getPaymentApi(orderId);
                setPaymentData(res);
                setAmount({
                    currency: res.currency ?? "KRW",
                    value: res.amount ?? 0,
                });
            } catch (error) {
                console.error('에러 발생', error);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, [orderId]);

    // paymentData의 값이 반환된 후 위젯 객체 생성
    useEffect(() => {
        if (!paymentData?.customerKey) { // paymentData값 생성되기 전이면 return
            return;
        }

        const fetchPaymentWidgets = async () => {
            try {
                const tossPayments = await loadTossPayments(clientKey);

                const widgets = tossPayments.widgets({
                    customerKey: paymentData.customerKey,
                })
                setWidgets(widgets);
            } catch (error) {
                console.error('에러 발생', error);
            }
        };

        fetchPaymentWidgets();
    }, [paymentData]);

    // loading 종료 후 결제 UI 렌더링
    useEffect(() => {
        if (loading || !widgets || !paymentData) { // 로딩중 / 위젯 없음 / 결제 데이터 없음 - 1가지라도 해당 시 return
            return;
        }

        const renderPaymentWidgets = async () => {
            try {
                // ------ 주문의 결제 금액 설정 ------
                await widgets.setAmount(amount);

                await Promise.all([
                    // ------  결제 UI 렌더링 ------
                    widgets.renderPaymentMethods({
                        selector: "#payment-method",
                        variantKey: "DEFAULT",
                    }),
                    // ------  이용약관 UI 렌더링 ------
                    widgets.renderAgreement({
                        selector: "#agreement",
                        variantKey: "AGREEMENT",
                    }),
                ]);

                setReady(true);
            } catch (error) {
                console.error('에러 발생', error);
            }
        }

        renderPaymentWidgets();
    }, [loading, widgets, paymentData]);

    // 결제 메서드
    const handlePayment = async () => {
        if (!widgets || !paymentData || !paymentData) {
            return;
        }

        try {
            // ------ '결제하기' 버튼 누르면 결제창 띄우기 ------
            // 결제를 요청하기 전에 orderId, amount를 서버에 저장하세요.
            // 결제 과정에서 악의적으로 결제 금액이 바뀌는 것을 확인하는 용도입니다.
            await widgets.requestPayment({
                orderId: orderId,
                orderName: paymentData.orderName,
                successUrl: window.location.origin + "/payment/success",
                failUrl: window.location.origin + "/payment/fail",
            });
        } catch (error) {
            console.error('에러 발생', error);
        }
    };

    if (loading) {
        return <LoadingSpinner/>
    }

    if (!paymentData) {
        return <div>결제 정보를 불러올 수 없습니다.</div>
    }

    return (
        <div className="wrapper my-8">
            <div className="box_section">
                {/* logo */}
                <Link to={'/'} className="flex justify-center items-center font-extrabold text-4xl">
                    <span>CINEVERSE</span>
                </Link>

                {/* 주문 정보 */}
                <section className="mt-8 mx-6 mb-6 rounded-xl border border-gray-200 bg-white p-5">
                    <h2 className="mb-4 text-lg font-semibold text-gray-900">
                        주문 정보
                    </h2>

                    <div className="flex items-start justify-between gap-6">
                        <span className="text-sm text-gray-500">
                            상품명
                        </span>
                        <span className="text-right font-medium text-gray-900">
                            {paymentData.orderName}
                        </span>
                    </div>

                    <div className="my-4 border-t border-gray-100"/>

                    <div className="flex items-center justify-between">
                        <span className="font-medium text-gray-700">
                            최종 결제 금액
                        </span>
                        <strong className="text-xl text-primary">
                            {formattedAmount}원
                        </strong>
                    </div>
                </section>

                {/* 결제 UI */}
                <div id="payment-method"/>
                {/* 이용약관 UI */}
                <div id="agreement"/>

                {/* 결제하기 버튼 */}
                <div className="flex justify-center">
                    <button type="button" className="button w-full mx-6 py-4 bg-primary rounded-lg text-xl text-white
                        hover:bg-primary-hover cursor-pointer" disabled={!ready} onClick={handlePayment}>
                        결제하기
                    </button>
                </div>
            </div>
        </div>
    );
}