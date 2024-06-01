"use client";

import { Box, Footprints, Handshake, Home } from "lucide-react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import { Skeleton } from "../ui/skeleton";

interface MainNavigationProps {
    isMounted: boolean
}

const MainNavigation: React.FC<MainNavigationProps> = ({
    isMounted
}) => {

    const { theme } = useTheme();
    const pathname = usePathname();

    const skeletonArray = [1, 2, 3, 4];

    const routes = [
        {
            href: '/dashboard-page',
            label: 'Dashboard',
            icon: <Home className="h-4 w-4 mr-1" />,
            active: pathname === '/dashboard-page'
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
        <nav className="mx-6 hidden lg:flex items-center space-x-6 lg:space-x-4 font-semibold">
            {
                !isMounted ?
                    <React.Fragment>
                        {
                            skeletonArray.map((_, index) => (
                                <Skeleton key={index} className="h-6 w-[125px] p-3" />
                            ))
                        }
                    </React.Fragment>
                    :
                    <React.Fragment>
                        {routes.map((route) => (
                            <Link key={route.href} href={route.href}
                                className={`${route.active ? ` ${theme === 'dark' ? ' bg-[#172030]' : 'bg-[#F4F4F4]'} text-[#fb4c0a] ` : ''} flex items-center hover:scale-105 cursor-pointer transition p-3 rounded-xl`}>
                                {route.icon}
                                {route.label}
                            </Link>
                        ))}
                    </React.Fragment>
            }
        </nav>
    )
}

export default MainNavigation;