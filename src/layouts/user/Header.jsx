import {Link} from "react-router-dom";
import logo from "../../assets/logo/logo-horizontal.png";
import {navList} from "../../constants/header/navList.js";
import {BiSearch} from "react-icons/bi";
import {useAuthStore} from "../../store/authStore.js";
import {useEffect, useRef, useState} from "react";
import ProfileButton from "../../components/header/ProfileButton.jsx";
import {RxHamburgerMenu} from "react-icons/rx";

export default function Header() {
    const {isLogin} = useAuthStore();

    // 메뉴
    const [isOpen, setIsOpen] = useState(false);
    const desktopProfileRef = useRef(null);
    const mobileProfileRef = useRef(null);
    const mobileMenuRef = useRef(null);

    // 모바일 메뉴
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleClickOutside = (e) => {
            const clickedDesktopProfile =
                desktopProfileRef.current?.contains(e.target);

            const clickedMobileProfile =
                mobileProfileRef.current?.contains(e.target);

            // 데스크톱과 모바일 프로필 모두 바깥을 클릭했을 때만 닫기
            if (!clickedDesktopProfile && !clickedMobileProfile) {
                setIsOpen(false);
            }

            if (mobileMenuRef.current && !mobileMenuRef.current.contains(e.target)) {
                setIsMobileMenuOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);

        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <>
            {/* 데스크톱 용 */}
            <header className="fixed top-0 left-0 z-50 w-full text-text border border-white/10
                bg-background/70 backdrop-blur-md transition-all duration-300 hidden md:block">
                <div className="mx-auto flex h-16 max-w-8xl items-center justify-between px-6 lg:px-8">

                    <div className="flex items-center gap-8">
                        {/* logo */}
                        <Link to="/" className="flex items-center">
                            <img src={logo} alt="CINEVERSE"
                                 className="h-12 w-auto"/>
                        </Link>

                        {/* header */}
                        <nav className="flex gap-8">
                            {navList.map((nav) => (
                                <Link to={nav.link} key={nav.id}
                                      className="font-light transition-colors duration-300 hover:text-white">
                                    {nav.title}
                                </Link>
                            ))}
                        </nav>
                    </div>

                    <div className="flex items-center gap-8">

                        {/* search */}
                        {/*<BiSearch size={22} className="text-text transition-colors duration-300
                            hover:text-white cursor-pointer"/>*/}

                        {/* login - 임시 추후 수정 예정 */}
                        {!isLogin ?
                            (<Link to="/auth/login" className="px-3 py-2 bg-secondary rounded-full text-sm text-white
                                transition-colors duration-300 hover:bg-secondary-hover">
                                로그인
                            </Link>)
                            : (<ProfileButton ref={desktopProfileRef} isOpen={isOpen} setIsOpen={setIsOpen}/>)}
                    </div>
                </div>
            </header>

            {/* 모바일 용 */}
            <header className="fixed top-0 left-0 z-50 w-full text-text border border-white/10
                bg-background/70 backdrop-blur-md transition-all duration-300 md:hidden">
                <div className="mx-auto flex h-16 max-w-8xl items-center justify-between px-6 lg:px-8">

                    <div ref={mobileMenuRef}>
                        {/* 메뉴 버튼 */}
                        <button type='button' onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                className="border border-border p-2 rounded-xl">
                            <RxHamburgerMenu/>
                        </button>

                        {/* 메뉴 목록 */}
                        <aside className={`fixed left-0 top-16 z-50 text-white bg-background/90 min-h-screen w-72 md:hidden
                        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} transition duration-500 ease-out`}>

                            <nav className="flex flex-col gap-4 px-6 py-8">
                                {/* logo */}
                                <Link to="/">
                                    <img src={logo} alt="CINEVERSE"
                                         className="h-12 w-auto"/>
                                </Link>
                                {navList.map((nav) => (
                                    <Link key={nav.id} to={nav.link} onClick={() => setIsMobileMenuOpen(false)}
                                          className="border-b-2 border-border px-2 pb-2 text-muted">
                                        {nav.title}
                                    </Link>
                                ))}
                            </nav>
                        </aside>
                    </div>

                    {/* 프로필 버튼 */}
                    {!isLogin ?
                        (<Link to="/auth/login" className="px-3 py-2 bg-secondary rounded-full text-sm text-white
                                transition-colors duration-300 hover:bg-secondary-hover">
                            로그인
                        </Link>)
                        : (<ProfileButton ref={mobileProfileRef} isOpen={isOpen} setIsOpen={setIsOpen}/>)}
                </div>
            </header>
        </>
    )
}