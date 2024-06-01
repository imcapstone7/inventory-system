"use client";

import { useEffect, useState } from "react"
import { useTheme } from "next-themes";

import MenuNav from "./navigation-components/menu";
import useMenuModal from "@/hook/use-menu-modal";
import MobileMenu from "./navigation-components/mobile-menu";

const Navbar = () => {

    const [scrollY, setScrollY] = useState(0);
    const { theme } = useTheme();
    const menuModal = useMenuModal();

    useEffect(() => {
        const handleScroll = () => {
            setScrollY(window.scrollY);
        };
        window.addEventListener('scroll', handleScroll);
    }, [scrollY]);

    return (
        <>
            <div className={`${theme === 'dark' ? 'bg-[#020817]' : ''} ${theme === 'light' ? 'bg-white' : ''} sticky top-0 z-20 ${scrollY === 0 ? '' : 'border-b transition-all duration-300 ease-out'}`}>
                <div className="relative px-2 sm:px-4 lg:px-8 flex h-20 items-center justify-between">
                    <MenuNav />
                </div>
            </div>
            {menuModal.isOpen && <MobileMenu />}
        </>
    )
}

export default Navbar;