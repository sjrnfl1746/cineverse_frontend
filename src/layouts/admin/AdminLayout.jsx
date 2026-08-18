import {Link, NavLink, Outlet} from "react-router-dom";
import {adminList} from "../../constants/admin/adminList.jsx";

export default function AdminLayout() {
    return (
        <div className="flex min-h-screen bg-background text-white">
            <aside className="fixed inset-y-0 left-0 w-64 border-r border-border bg-surface">
                <div className="flex h-16 items-center border-b border-border px-6">
                    <span className="text-xl font-bold">CINEVERSE ADMIN</span>
                </div>

                <nav className="space-y-2 p-4">
                    {adminList.map((admin) => (
                        <AdminNavLink key={admin.id} to={admin.to}>
                            {admin.icon}
                            {admin.title}
                        </AdminNavLink>
                    ))}
                </nav>
            </aside>

            <div className="ml-64 flex min-h-screen flex-1 flex-col">
                <header className="flex h-16 items-center justify-between border-b border-border px-8">
                    <h1 className="font-semibold">관리자 페이지</h1>
                    <Link to="/">사용자 페이지로 이동</Link>
                </header>

                <main className="flex-1 p-8">
                    <Outlet/>
                </main>
            </div>
        </div>
    );
}

function AdminNavLink({to, children}) {
    return (
        <NavLink
            to={to}
            className={({isActive}) =>
                `flex gap-3 items-center rounded-lg px-4 py-3 transition ${
                    isActive
                        ? "bg-primary text-white"
                        : "text-muted hover:bg-white/5 hover:text-white"
                }`
            }
        >
            {children}
        </NavLink>
    );
}