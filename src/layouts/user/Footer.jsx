import NavLink from "../../components/footer/NavLink.jsx";
import CompanyInfo from "../../components/footer/CompanyInfo.jsx";
import SnsLink from "../../components/footer/SnsLink.jsx";

export default function Footer() {
    return (
        <>
            <footer className="bg-background border-t border-border text-text">
                <div className="mx-auto max-w-8xl px-6 py-10 lg:px-8">
                    {/* 상단 링크 */}
                    {/*<NavLink/>*/}

                    {/*<div className="my-7 h-px bg-border"/>*/}

                    {/* 회사 정보 */}
                    <CompanyInfo/>

                    {/* 안내 문구 */}
                    <p className="mt-5 max-w-3xl text-xs leading-6 text-muted/80">
                        CINEVERSE는 포트폴리오 목적으로 제작된 영화 및 OTT 정보 서비스입니다.
                        표시된 영화, 포스터 및 콘텐츠 정보의 권리는 각 원저작권자에게 있습니다.
                    </p>

                    {/* 하단 */}
                    <div className="mt-8 flex flex-col gap-5 border-t border-border pt-6
                        sm:flex-row sm:items-center sm:justify-between">
                        <p className="text-xs text-muted">
                            © {new Date().getFullYear()} CINEVERSE. All rights reserved.
                        </p>

                        {/* 관련 SNS 링크 */}
                        <SnsLink/>
                    </div>
                </div>
            </footer>
        </>
    )
}