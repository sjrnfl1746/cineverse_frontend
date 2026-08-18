import {Link, useNavigate} from "react-router-dom";

export default function NotFound() {
    const navigate = useNavigate();

    return (
        <>
            <main
                className="relative flex min-h-screen items-center justify-center overflow-hidden px-6 text-white">

                <div className="relative z-10 mx-auto max-w-2xl text-center">
                    <p className="mb-3 text-sm font-semibold uppercase tracking-[0.35em] text-primary">
                        Page not found
                    </p>
                    <h1 className="text-8xl sm:text-9xl">
                        404
                    </h1>
                    <p className="mt-8 text-2xl font-bold sm:text-3xl">
                        요청하신 페이지를 찾을 수 없습니다.
                    </p>

                    <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
                        <Link to='/' className="inline-flex w-full items-center justify-center rounded-lg bg-primary px-6 py-3
                            text-sm font-semibold text-white transition duration-300 hover:bg-primary-hover focus:outline-none">
                            홈으로 이동
                        </Link>
                        <button type='button' onClick={() => navigate(-1)}
                                className="inline-flex w-full items-center justify-center rounded-lg border border-border px-6 py-3
                                text-sm font-semibold text-muted hover:border-neutral-500 focus:outline-none cursor-pointer">
                            이전 페이지
                        </button>
                    </div>
                </div>
            </main>
        </>
    )
}