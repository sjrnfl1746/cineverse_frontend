import TitleDesc from "../../components/common/TitleDesc.jsx";
import {Link, useNavigate} from "react-router-dom";
import {MdKeyboardDoubleArrowLeft} from "react-icons/md";
import {useState} from "react";
import MovieSearch from "../../components/review/MovieSearch.jsx";
import ReviewForm from "../../components/review/ReviewForm.jsx";
import {useAuthStore} from "../../store/authStore.js";

export default function ReviewAdd() {
    const navigate = useNavigate();
    const {isLogin} = useAuthStore();

    if (!isLogin) {
        navigate('/login', {
            state: {
                notLogin: true,
            }
        })
    }

    const [selectedMovie, setSelectedMovie] = useState(null);

    return (
        <>
            <main className="min-h-screen px-5 py-10 text-white sm:px-8 lg:px-12">
                <section className="mx-auto max-w-[1600px]">
                    <TitleDesc title={'리뷰 작성'} description={'시청하신 콘텐츠의 리뷰를 남겨주세요'}>
                        <Link to={'/review'} className="flex justify-center items-center gap-2 px-4 py-2 border border-border
                            rounded-xl text-muted hover:border-gray-600 transition duration-300">
                            <MdKeyboardDoubleArrowLeft/>
                            리뷰 목록
                        </Link>
                    </TitleDesc>

                    {/* 영화 검색 / 리뷰 선택 */}
                    {!selectedMovie ? (
                        <MovieSearch onSelect={setSelectedMovie}/>
                    ) : (
                        <ReviewForm movie={selectedMovie} onChangeMovie={() => setSelectedMovie(null)}/>
                    )}
                </section>
            </main>
        </>
    )
}