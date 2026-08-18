import {useNavigate, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import TitleLabel from "../../../components/admin/TitleLabel.jsx";
import {toast} from "sonner";
import {addVideoApi, existsVideoByContentIdApi} from "../../../api/admin/AdminVideoApi.js";
import LoadingSpinner from "../../../components/common/LoadingSpinner.jsx";

export default function AdminVideoAdd() {
    const {contentId} = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);

    const [video, setVideo] = useState(null);
    const [videoPreview, setVideoPreview] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    const handleVideoChange = (e) => {
        const file = e.target.files[0];

        if (!file) {
            return;
        }

        // 영상 최대 용량 500MB
        const MAX_VIDEO_SIZE = 500 * 1024 * 1024;

        // 파일 크기 유효성 검사
        if (file.size > MAX_VIDEO_SIZE) {
            toast.error('영상은 최대 500MB 까지 등록할 수 있습니다.');
            e.target.value = '';
            return;
        }

        // 파일 mimeType 유효성 검사
        if (!file.type.startsWith('video/')) {
            toast.error('영상 파일만 등록이 가능합니다.');
            e.target.value = '';
            return;
        }

        setVideo(file);
        setVideoPreview(URL.createObjectURL(file));
    }

    // 영상 등록
    const handleSubmitVideo = async (e) => {
        e.preventDefault();

        if (!video) {
            toast.error('영상을 등록해주세요.');
            return;
        }

        const formData = new FormData();
        formData.append('video', video);

        try {
            setSubmitting(true);

            await addVideoApi(contentId, formData);

            navigate('/admin/content', {
                state: {
                    addContentSuccess: true,
                }
            });
        } catch (error) {
            console.error('에러 발생', error);
        } finally {
            setSubmitting(false);
        }
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await existsVideoByContentIdApi(contentId);

                // 영상이 이미 등록된 경우
                if (res) {
                    navigate(`/admin/content/${contentId}`, {
                        state: {
                            existsVideo: true,
                        }
                    })
                }
            } catch (error) {
                console.error('에러 발생', error);
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, [])

    useEffect(() => {
        return () => {
            if (videoPreview) {
                URL.revokeObjectURL(videoPreview);
            }
        };
    }, [videoPreview]);

    if (loading) {
        return <LoadingSpinner/>
    }

    return (
        <>
            <form onSubmit={handleSubmitVideo}>
                <TitleLabel title={'영상 등록'} desc={'콘텐츠의 본편 영상을 등록합니다.'}>
                    {/* 영상 등록 버튼 */}
                    <button type="submit" disabled={submitting} className="rounded-xl bg-primary px-4 py-2 text-sm
                        font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer">
                        {submitting ? "등록 중..." : "영상 등록"}
                    </button>
                </TitleLabel>

                <section className="rounded-2xl border border-border bg-card p-6">
                    <h2 className="mb-5 text-lg font-semibold text-foreground">
                        영상 파일
                    </h2>

                    <label className="block cursor-pointer">
                        <div className="flex aspect-video items-center justify-center overflow-hidden
                            rounded-xl border border-dashed border-border bg-background">
                            {videoPreview ? (
                                <video src={videoPreview} controls className="h-full w-full object-contain"/>
                            ) : (
                                <span className="px-4 text-center text-sm text-muted">
                                    영상 파일을 선택하세요.
                                </span>
                            )}
                        </div>

                        <input type="file" accept="video/*" onChange={handleVideoChange} className="hidden"/>
                    </label>

                    {video && (
                        <div className="mt-4 space-y-1 text-sm text-muted">
                            <p className="truncate">
                                파일명: {video.name}
                            </p>
                            <p>
                                크기: {(video.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                        </div>
                    )}
                </section>
            </form>
        </>
    )
}