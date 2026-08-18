import {navLink} from "../../constants/footer/navLink.js";
import {Link} from "react-router-dom";

export default function NavLink() {
    return (
        <>
            <nav className="flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-muted">
                {navLink.map((link) => (
                    <Link key={link.id} to={link.to} className="transition-colors hover:text-white">
                        {link.title}
                    </Link>
                ))}
            </nav>
        </>
    )
}