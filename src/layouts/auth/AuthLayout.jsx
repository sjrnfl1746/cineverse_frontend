import {Link, Outlet} from "react-router-dom";
import logo from "../../assets/logo/logo-horizontal.png"

export default function AuthLayout() {
    return (
        <>
            <div className="min-h-screen bg-background text-white">
                <div className="mx-auto flex min-h-screen max-w-lg flex-col px-6 py-16">
                    <Link to="/" className="mb-4 flex justify-center">
                        <img src={logo} alt="CINEVERSE" className="h-12 w-auto"/>
                    </Link>

                    <Outlet/>
                </div>
            </div>
        </>
    )
}