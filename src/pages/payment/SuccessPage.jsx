import {useEffect} from "react";
import {Link, useNavigate, useSearchParams} from "react-router-dom";
import {useAuthStore} from "../../store/authStore.js";
import {IoIosAlert} from "react-icons/io";
import {FaCircleCheck} from "react-icons/fa6";
import {meApi} from "../../api/common/UserApi.js";

export function SuccessPage() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const {accessToken, setUser} = useAuthStore();

    useEffect(() => {
        // 쿼리 파라미터 값이 결제 요청할 때 보낸 데이터와 동일한지 반드시 확인하세요.
        // 클라이언트에서 결제 금액을 조작하는 행위를 방지할 수 있습니다.
        const requestData = {
            orderId: searchParams.get("orderId"),
            amount: searchParams.get("amount"),
            paymentKey: searchParams.get("paymentKey"),
        };

        async function confirm() {
            const response = await fetch("http://localhost:8080/api/widget/confirm", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${accessToken}`,
                },
                body: JSON.stringify(requestData),
            });

            const json = await response.json();

            if (!response.ok) {
                // 결제 실패 비즈니스 로직을 구현하세요.
                navigate(`/fail?message=${json.message}&code=${json.code}`);
                return;
            }

            // 결제 성공 비즈니스 로직을 구현하세요.
            // 결제 성공후 me 정보 다시 반환
            const res = await meApi();
            setUser(res);
        }

        confirm();
    }, []);

    return (
        <>
            <div className="result wrapper flex min-h-screen items-center justify-center bg-gray-50 px-4">
                <div className="box_section w-full max-w-xl rounded-3xl bg-white px-6 py-12 shadow-lg sm:px-10">
                    {/* logo */}
                    <Link to={'/'} className="flex justify-center items-center font-extrabold text-4xl tracking-tight">
                        CINEVERSE
                    </Link>

                    <div className="mt-14 flex justify-center">
                        <div className="flex h-36 w-36 items-center justify-center rounded-full bg-green-50">
                            <FaCircleCheck size={100} className="text-green-500"/>
                        </div>
                    </div>

                    <div className="mt-8 text-center">
                        <h1 className="text-3xl font-bold text-gray-900">
                            결제가 완료되었습니다
                        </h1>
                    </div>

                    {/* 결제 정보 */}
                    <div
                        className="mx-auto mt-10 w-full max-w-md overflow-hidden rounded-2xl border border-gray-200 bg-gray-50">
                        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-5">
                            <span className="text-sm font-medium text-gray-500">
                                주문번호
                            </span>
                            <span className="max-w-[65%] break-all text-right text-sm font-semibold text-gray-900">
                                {searchParams.get("orderId")}
                            </span>
                        </div>

                        <div className="flex items-center justify-between px-6 py-5">
                            <span className="text-sm font-medium text-gray-500">
                                {Number(searchParams.get("amount")).toLocaleString("ko-KR")}원
                            </span>
                        </div>
                    </div>

                    <div className="mx-auto mt-10 flex w-full max-w-md gap-3">
                        <Link to={'/'} className="flex-1 rounded-xl border border-gray-300 px-5 py-4 text-center font-semibold
                            text-gray-700 transition hover:bg-gray-100">
                            홈으로
                        </Link>
                        <Link to={'/subscription'} className="flex-1 rounded-xl bg-black px-5 py-4 text-center font-semibold text-white
                            transition hover:bg-gray-800">
                            구독 확인
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
}