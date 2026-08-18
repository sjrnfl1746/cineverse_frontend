import './App.css'
import {useEffect} from "react";
import AOS from "aos/src/js/aos.js";
import {RouterProvider} from "react-router-dom";
import {router} from "./router/router.jsx";
import {Toaster} from "sonner";
import useAuthInit from "./hooks/useAuthInit.jsx";

function App() {
    // 사용자 초기화
    useAuthInit();

    // AOS
    useEffect(() => {
        AOS.init({
            duration: 800,
            once: true,
            offset: 100,
            easing: "ease-in-out",
        });
    }, []);

    return (
        <>
            <RouterProvider router={router}/>

            {/* Toast */}
            <Toaster richColors position={"bottom-right"}/>
        </>
    )
}

export default App
