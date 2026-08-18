import {useLocation} from "react-router-dom";
import {useEffect} from "react";
import {toast} from "sonner";
import HeroBanner from "../components/main/hero/HeroBanner.jsx";
import ContentSection from "../components/main/common/ContentSection.jsx";
import NewsSection from "../components/main/news/NewsSection.jsx";

export default function Main() {
    const location = useLocation();

    useEffect(() => {
        if (location.state?.loginSuccess) {
            toast.success('로그인 되었습니다.');
        }
    }, []);

    return (
        <>
            <main className="min-h-screen bg-background">
                {/* heroBanner */}
                <HeroBanner/>

                {/* content section */}
                <ContentSection title={'지금 인기 있는 영화'} link={'/movie'}/>

                {/* news section */}
                <NewsSection/>
            </main>
        </>
    )
}