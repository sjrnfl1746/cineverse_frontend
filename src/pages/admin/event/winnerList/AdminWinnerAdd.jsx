import TitleLabel from "../../../../components/admin/TitleLabel.jsx";
import {useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {toast} from "sonner";
import InputLabel from "../../../../components/common/InputLabel.jsx";
import {addEventAnnouncementApi} from "../../../../api/admin/AdminEventAnnouncementApi.js";

export default function AdminWinnerAdd() {
    const {eventId} = useParams();
    const navigate = useNavigate();

    const initForm = {
        title: '',
        description: '',
    }

    const [form, setForm] = useState(initForm);

    const handleChange = (e) => {
        const {name, value} = e.target;

        setForm((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (form.title.trim() === '') {
            toast.error('제목을 입력해주세요.');
            return;
        }
        if (form.description.trim() === '') {
            toast.error('내용을 입력해주세요.');
            return;
        }

        try {
            await addEventAnnouncementApi(eventId, form);

            // 등록 후 이벤트 페이지로 이동
            navigate(`/admin/event/${eventId}`, {
                state: {
                    addEventAnnouncementSuccess: true,
                }
            })
        } catch (error) {
            console.error('에러 발생', error);
        }
    }


    return (
        <>
            <TitleLabel title={'당첨자 등록'} desc={'이벤트 당첨자를 등록합니다.'}/>

            <section className="mt-8 rounded-2xl border border-white/10 bg-white/[0.03] p-6">
                <form onSubmit={handleSubmit} className="space-y-6">

                    <div>
                        <InputLabel label={'제목'} name={'title'} type={'text'} maxLength={100} onChange={handleChange}
                                    placeholder={'당첨자 발표 제목을 입력해주세요.'} value={form.title}/>
                        <p className="mt-2 text-right text-xs text-white/40">
                            {form.title.length}/100
                        </p>
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-semibold text-white">
                            내용
                        </label>

                        <textarea name={'description'} value={form.description} onChange={handleChange} rows={14}
                                  maxLength={2000}
                                  placeholder={"이벤트 당첨자와 안내사항을 입력해주세요."}
                                  className="w-full resize-none rounded-xl border border-white/10 bg-black/20
                                  px-4 py-3 leading-7 text-white outline-none transition placeholder:text-white/30 focus:outline-none"/>

                        <p className="mt-2 text-right text-xs text-white/40">
                            {form.description.length}/2000
                        </p>
                    </div>

                    <div className="flex justify-end">
                        <button type="submit" className="rounded-xl bg-primary px-6 py-3 font-semibold text-white
                            transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-50">
                            당첨자 등록
                        </button>
                    </div>
                </form>
            </section>
        </>
    )
}