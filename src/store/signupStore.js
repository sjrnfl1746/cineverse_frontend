import {create} from "zustand/react";
import {createJSONStorage, persist} from "zustand/middleware";

export const useSignupStore = create(
    persist(
        (set) => ({
            agreedTermsIds: [],

            // 약관동의 내역 저장
            setTermsAgreement: (agreedTermsIds) => set({agreedTermsIds}),

            // 회원가입 완료 또는 취소시
            clearTermsAgreement: () => set({agreedTermsIds: []}),
        }),
        {
            name: "signupStore",
            storage: createJSONStorage(() => sessionStorage),
        }
    )
);