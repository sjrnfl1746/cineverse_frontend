import InputLabel from "../common/InputLabel.jsx";
import Button from "../common/Button.jsx";
import {useEffect, useState} from "react";
import {toast} from "sonner";
import {getRandomContentApi} from "../../api/common/ContentApi.js";
import LoadingSpinner from "../common/LoadingSpinner.jsx";

export default function MovieSearch({onSelect}) {
    const [loading, setLoading] = useState(false);

    const [movies, setMovies] = useState([]);

    const [keyword, setKeyword] = useState('');

    const handleSearchMovie = async () => {
        if (keyword.trim() === '') {
            toast.error('제목을 입력해주세요.')
            return;
        }

        setLoading(true);

        const searchDTO = {
            type: 'title',
            keyword: keyword,
            seed: Math.floor(Math.random() * 1_000_000_000)
        }

        try {
            const res = await getRandomContentApi(searchDTO);
            setMovies(res.content);
        } catch (error) {
            console.error('에러 발생', error);
        } finally {
            setLoading(false);
        }
    }

    if (loading) {
        return <LoadingSpinner/>
    }

    return (
        <>
            <label className="mb-2 block font-semibold">
                어떤 영화를 리뷰하시나요?
            </label>

            <div className="flex gap-2">
                <div className="w-full">
                    <InputLabel type={'search'} placeholder={'영화 제목을 검색해주세요'}
                                value={keyword} onChange={(e) => setKeyword(e.target.value)}/>
                </div>
                <div className="w-32">
                    <Button type={'button'} label={'검색'} onClick={handleSearchMovie}/>
                </div>
            </div>

            {movies.length > 0 && (<ul className="mt-6 space-y-3">
                {movies.map((movie) => (
                    <li key={movie.contentId}>
                        <button type={'button'} onClick={() => onSelect(movie)} className="flex w-full items-center gap-4
                            rounded-xl border border-white/5 p-4 text-left hover:bg-white/10 cursor-pointer">
                            <img src={`${import.meta.env.VITE_API_SERVER}/uploads/${movie.thumbnailUrl}`}
                                 alt={`${movie.title} 포스터`} className="h-24 w-16 rounded object-cover"/>

                            <span>
                                <strong className="block text-lg">
                                    {movie.title}
                                </strong>
                            </span>
                        </button>
                    </li>
                ))}
            </ul>)}
        </>
    )
}