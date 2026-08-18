import {snsLink} from "../../constants/footer/snsLink.jsx";

export default function SnsLink() {
    return (
        <>
            <div className="flex items-center gap-3">
                {snsLink.map((sns) => (
                    <a key={sns.id} href={sns.href} target="_blank" rel="noopener noreferrer"
                       className="flex h-9 w-9 items-center justify-center rounded-full border border-border
                       text-muted transition duration-300 hover:border-primary hover:text-primary">
                        {sns.icon}
                    </a>
                ))}
            </div>
        </>
    )
}