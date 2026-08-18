import Header from "./Header.jsx";
import {Outlet} from "react-router-dom";
import Footer from "./Footer.jsx";

export default function Layout() {
    return (
        <>
            <div className="flex flex-col min-h-screen bg-background">
                <Header/>
                <main className="flex-grow mb-8">
                    <Outlet/>
                </main>
                <Footer/>
            </div>
        </>
    )
}