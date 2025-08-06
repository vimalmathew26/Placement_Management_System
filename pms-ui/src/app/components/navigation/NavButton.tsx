'use client'

import { useRouter } from "next/navigation";

const NavButton = () => {
    const router = useRouter();
    return (
        <button
            onClick={() => {
                router.push("/");
            }}
        >
        </button>
    );
}

export default NavButton;