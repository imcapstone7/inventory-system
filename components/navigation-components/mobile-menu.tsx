"use client";

import { Box, Footprints, Handshake, Home, MessageCircleMoreIcon, X } from "lucide-react";
import useMenuModal from "@/hook/use-menu-modal";
import { useTheme } from "next-themes";
import { usePathname } from "next/navigation";
import Link from "next/link";

const MobileMenu = () => {

    const menuModal = useMenuModal();
    const { theme } = useTheme();
    const pathname = usePathname();

    const routes = [
        {
            href: '/dashboard-page',
            label: 'Dashboard',
            icon: <Home className="h-4 w-4 mr-1" />,
            active: pathname === '/dashboard-page'
        },
        {
            href: '/message-page',
            label: 'Messsage',
            icon: <MessageCircleMoreIcon className="h-4 w-4 mr-1" />,
            active: pathname === '/message-page'
        },
        {
            href: '/tracking-page',
            label: 'Tracking',
            icon: <Footprints className="h-4 w-4 mr-1" />,
            active: pathname === '/tracking-page'
        },
        {
            href: '/inventory-page',
            label: 'Inventory',
            icon: <Box className="h-4 w-4 mr-1" />,
            active: pathname === '/inventory-page'
        },
        {
            href: '/transports-page',
            label: 'Transports',
            icon: <Handshake className="h-4 w-4 mr-1" />,
            active: pathname === '/transports-page'
        }
    ];

    return (
        <div className={`fixed z-30 lg:hidden top-0 left-0 w-full h-full ${theme === 'dark' ? 'bg-[#020817]' : 'bg-white'} px-4 overflow-y-scroll`}>
            <div className="flex lg:hidden items-center justify-end p-4 sm:p-6">
                <X onClick={() => menuModal.onClose()} className="hover:scale-110 cursor-pointer transition" />
            </div>
            <div className="flex flex-col p-4 sm:p-6 space-y-8">
                {routes.map((route) => (
                    <Link onClick={() => menuModal.onClose()} key={route.href} href={route.href}
                        className={`${route.active ? ` ${theme === 'dark' ? 'bg-gray-900 text-[#3fab71]' : 'bg-gray-100 text-[#030d71]'}` : ''} px-4 h-24 font-semibold flex items-center rounded-xl cursor-pointer ${theme === 'dark' ? 'hover:bg-gray-900' : 'hover:bg-gray-100'} transition-colors`}>
                        {route.icon}
                        {route.label}
                    </Link>
                ))}
            </div>
        </div>
    )
}

export default MobileMenu;