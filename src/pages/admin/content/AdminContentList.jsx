import {useEffect, useState} from "react";
import LoadingSpinner from "../../../components/common/LoadingSpinner.jsx";
import TitleLabel from "../../../components/admin/TitleLabel.jsx";
import {Link, useLocation} from "react-router-dom";
import {LuPlus} from "react-icons/lu";
import InputLabel from "../../../components/common/InputLabel.jsx";
import Button from "../../../components/common/Button.jsx";
import Select from "../../../components/common/Select.jsx";
import {contentStatusList} from "../../../constants/admin/contentStatusList.js";
import {getContentListApi} from "../../../api/admin/AdminContentApi.js";
import {toast} from "sonner";
import ContentStatusBadge from "../../../components/admin/content/ContentStatusBadge.jsx";
import Pagination from "../../../components/common/Pagination.jsx";
import getAgeRatingLabel from "../../../components/admin/content/getAgeRatingLabel.jsx";

export default function AdminContentList() {
    const location = useLocation();
    const [loading, setLoading] = useState(true);

    // 검색 조건
    const [keyword, setKeyword] = useState('');
    const [contentStatus, setContentStatus] = useState('');

    // 콘텐츠 응답 저장
    const [contentPage, setContentPage] = useState(null);

    const fetchContentList = async (page = 0) => {
        const search = {
            keyword: keyword?.trim() || null,
            contentStatus: contentStatus || null,
            page,
            size: 10,
        }

        setLoading(true);

        try {
            const res = await getContentListApi(search);
            setContentPage(res);
        } catch (error) {
            console.error('콘텐츠 목록 조회 실패', error);
            setContentPage(null);
            toast.error('콘텐츠를 불러오는데 실패했습니다.');
        } finally {
            setLoading(false);
        }
    };

    // 검색 메서드
    const handleSearch = async () => {
        fetchContentList(0); // 첫 페이지 부터 조회
    }

    // 페이지 변경
    const handlePageChange = (page) => {
        if (page < 0 || page >= contentPage.totalPages) {
            return;
        }
        fetchContentList(page);
    }

    useEffect(() => {
        const fetchInitData = async () => {
            setLoading(true);

            try {
                const res = await getContentListApi({
                    keyword: null,
                    contentStatus: null,
                    page: 0,
                    size: 10,
                });
                setContentPage(res);
            } catch (error) {
                console.error('에러 발생', error);
                setContentPage(null);
                toast.error('콘텐츠를 불러오는데 실패했습니다.');
            } finally {
                setLoading(false);
            }
        };

        fetchInitData();
    }, [])

    useEffect(() => {
        if (location.state?.addContentSuccess) {
            toast.success('콘텐츠를 등록했습니다.');
        }

        if (location.state?.deleteContentSuccess) {
            toast.success('콘텐츠를 삭제했습니다.');
        }

        if (location.state?.notExistingVideo) {
            toast.error('잘못된 접근입니다.');
        }

        if (location.state?.notExistingContent) {
            toast.error('잘못된 접근입니다.');
        }
    }, []);

    if (loading) {
        return <LoadingSpinner/>
    }

    const contentList = contentPage?.content ?? [];

    return (
        <>
            <TitleLabel title={'콘텐츠 관리'} desc={'영화 정보와 이미지. 영상 및 공개 상태를 관리합니다.'}>
                <Link to={'add'} className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5
                    text-sm font-semibold text-white transition hover:bg-primary-hover">
                    <LuPlus className="text-base"/>
                    영화 등록
                </Link>
            </TitleLabel>

            {/* 콘텐츠 검색 */}
            <section className="mt-8 rounded-2xl border border-border bg-card p-5">
                <div className="flex items-end gap-4">
                    <div className="flex-1">
                        <InputLabel type="text" label="제목" name="keyword" value={keyword} placeholder="영화 제목을 입력해주세요"
                                    onChange={(e) => setKeyword(e.target.value)}/>
                    </div>
                    <div className="w-56">
                        <Select name="contentStatus" label="콘텐츠 상태" value={contentStatus}
                                onChange={(e) => setContentStatus(e.target.value)} options={contentStatusList}/>
                    </div>
                    <div className="w-32">
                        <Button type="button" label="검색" onClick={handleSearch}/>
                    </div>
                </div>
            </section>

            {/* 콘텐츠 목록 */}
            <section className="mt-6 overflow-hidden rounded-2xl border border-border bg-card">
                <div className="flex items-center justify-between border-b border-border px-6 py-4">
                    <div>
                        <h2 className="font-semibold text-foreground">
                            영화 목록
                        </h2>
                        <p className="mt-1 text-sm text-muted">
                            총 {contentPage?.totalElements ?? 0}개의 영화가 있습니다.
                        </p>
                    </div>
                </div>

                {!contentPage ? (
                    <div className="py-16 text-center text-muted">
                        콘텐츠 리스트를 불러오지 못했습니다.
                    </div>
                ) : contentList.length === 0 ? (
                    <div className="py-16 text-center text-muted">
                        검색 조건에 해당하는 콘텐츠가 없습니다.
                    </div>
                ) : (
                    <>
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[900px]">
                                <thead className="bg-background/50">
                                <tr className="border-b border-border text-left text-sm text-muted">
                                    <th className="px-6 py-4">영화</th>
                                    <th className="px-4 py-4">제작 국가</th>
                                    <th className="px-4 py-4">상영 시간</th>
                                    <th className="px-4 py-4">관람 등급</th>
                                    <th className="px-4 py-4">상태</th>
                                    <th className="px-6 py-4 font-medium">관리</th>
                                </tr>
                                </thead>
                                <tbody>
                                {contentList.map((content) => (
                                    <tr key={content.contentId}
                                        className="border-b border-border last:border-b-0 hover:bg-background/40">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-4">
                                                {content.path ?
                                                    (
                                                        <img src={`${import.meta.env.VITE_API_SERVER}/uploads/${content.path}`}
                                                            alt={content.title} className="h-20 w-14 rounded-lg object-cover"/>
                                                    ) : (
                                                        <img src="/favicon.svg" alt="임시 이미지"
                                                             className="h-20 w-14 rounded-lg object-cover"/>
                                                    )}
                                                <div>
                                                    <p className="font-medium text-foreground">
                                                        {content.title}
                                                    </p>
                                                    <p className="mt-1 text-sm text-muted">
                                                        {content.ogTitle || '-'}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-4 text-sm text-foreground">
                                            {content.productionCountry || '-'}
                                        </td>
                                        <td className="px-4 py-4 text-sm text-foreground">
                                            {content.runningTime}분
                                        </td>
                                        <td className="px-4 py-4 text-sm text-foreground">
                                            {getAgeRatingLabel(content.ageRating)}
                                        </td>
                                        <td className="px-4 py-4">
                                            <ContentStatusBadge status={content.contentStatus}/>
                                        </td>
                                        <td className="px-6 py-4">
                                            <Link to={`${content.contentId}`} className="inline-flex rounded-lg border border-border px-3 py-2
                                                text-sm text-foreground transition hover:border-primary hover:text-primary">
                                                상세보기
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>

                        <Pagination currentPage={contentPage.number} totalPages={contentPage.totalPages}
                                    first={contentPage.first}
                                    last={contentPage.last} onPageChange={handlePageChange}/>
                    </>
                )}
            </section>
        </>
    )
}