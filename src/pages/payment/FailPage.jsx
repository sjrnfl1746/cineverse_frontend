import {Link, useSearchParams} from "react-router-dom";
import {IoIosAlert} from "react-icons/io";

export function FailPage() {
    const [searchParams] = useSearchParams();

    const code = searchParams.get("code");
    const message = searchParams.get("message");
    const orderId = searchParams.get("orderId");

    return (
        <>
            <div className="result wrapper flex min-h-screen items-center justify-center bg-gray-50 px-4">
                <div className="box_section w-full max-w-xl rounded-3xl bg-white px-6 py-12 shadow-lg sm:px-10">
                    {/* logo */}
                    <Link to={'/'} className="flex justify-center items-center font-extrabold text-4xl tracking-tight">
                        CINEVERSE
                    </Link>

                    {/* 아이콘 */}
                    <div className="mt-14 flex justify-center">
                        <div className="flex h-36 w-36 items-center justify-center rounded-full bg-amber-50">
                            <IoIosAlert size={110} className="text-amber-500"/>
                        </div>
                    </div>

                    {/* 안내 문구 */}
                    <div className="mt-8 text-center">
                        <h1 className="text-3xl font-bold text-gray-900">
                            결제를 실패했습니다
                        </h1>
                        <p className="mt-3 leading-relaxed text-gray-500">
                            결제 정보를 확인한 후 다시 시도해 주세요.
                            <br/>
                            문제가 반복된다면 고객센터로 문의해 주세요.
                        </p>
                    </div>

                    {/* 오류 정보 */}
                    <div
                        className="mx-auto mt-10 w-full max-w-md overflow-hidden rounded-2xl border border-gray-200 bg-gray-50">
                        {code && (
                            <div className="flex items-center justify-between border-b border-gray-200 px-6 py-5">
                                <span className="text-sm font-medium text-gray-500">
                                    오류 코드
                                </span>
                                <span className="rounded-lg bg-red-50 px-3 py-1.5 text-sm font-semibold text-red-600">
                                    {code}
                                </span>
                            </div>
                        )}

                        {orderId && (
                            <div className="flex items-center justify-between border-b border-gray-200 px-6 py-5">
                                <span className="text-sm font-medium text-gray-500">
                                    주문번호
                                </span>
                                <span className="max-w-[65%] break-all text-right text-sm font-semibold text-gray-900">
                                    {orderId}
                                </span>
                            </div>
                        )}

                        <div className="px-6 py-5">
                            <span className="text-sm font-medium text-gray-500">
                                실패 사유
                            </span>

                            <p className="mt-2 break-words text-sm leading-relaxed text-gray-800">
                                {message || '결제 처리 중 알 수 없는 오류가 발생했습니다.'}
                            </p>
                        </div>
                    </div>

                    {/* 버튼 */}
                    <div className="mx-auto mt-10 flex w-full max-w-md gap-3">
                        <Link to={'/'} className="flex-1 rounded-xl border border-gray-300 px-5 py-4 text-center font-semibold
                            text-gray-700 transition hover:bg-gray-100">
                            홈으로
                        </Link>
                        <Link to={'/subscription'} className="flex-1 rounded-xl bg-black px-5 py-4 text-center font-semibold text-white
                            transition hover:bg-gray-800">
                            다시 결제하기
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
}