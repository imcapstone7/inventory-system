"use client";

import { useEffect, useState } from "react"
import { useTheme } from "next-themes";

import MenuNav from "./navigation-components/menu";
import useMenuModal from "@/hook/use-menu-modal";
import MobileMenu from "./navigation-components/mobile-menu";
import { IronSession } from "iron-session";
import { SessionData } from "@/lib/lib";
import { onValue, ref, update } from "firebase/database";
import { database } from "@/firebase";
import Inventory from "@/app/(dashboard)/inventory-page/page";
import { useToast } from "./ui/use-toast";
import { format } from "date-fns";

interface NavbarProps {
    session: IronSession<SessionData>
}

export type UserData = {
    displayName: string;
    photoURL: string
}

const Navbar: React.FC<NavbarProps> = ({
    session
}) => {

    const [scrollY, setScrollY] = useState(0);
    const { theme } = useTheme();
    const { toast } = useToast()
    const menuModal = useMenuModal();

    useEffect(() => {
        const handleScroll = () => {
            setScrollY(window.scrollY);
        };
        window.addEventListener('scroll', handleScroll);
    }, [scrollY]);

    const [user, setUser] = useState<UserData>();

    useEffect(() => {

        const userRef = ref(database, `users/${session.uid}`);

        const fetchData = (snapshot: any) => {
            const userData = snapshot.val();
            if (userData) {
                const userArray: UserData[] = Object.keys(userData).map(key => ({
                    id: key,
                    ...userData[key]
                }));

                setUser(userData);
            }
        };

        onValue(userRef, fetchData);

        return () => {
            // Unsubscribe from the real-time listener when component unmounts
            onValue(userRef, fetchData);
        };
    }, []);

    useEffect(() => {

        const inventoryRef = ref(database, 'inventory');

        const fetchData = async (snapshot: any) => {
            const inventoryData = snapshot.val();
            if (inventoryData) {
                const inventoryArray: Inventory[] = Object.keys(inventoryData).map(key => ({
                    id: key,
                    ...inventoryData[key]
                }));

                for (const item of inventoryArray) {
                    const lowStock = 0.5 * Number(item.baseQuantity);
                    const outOfStock = 0;
                    
                    if (Number(item.quantity) <= lowStock && Number(item.quantity) !== outOfStock) {
                        await update(ref(database, `inventory/${item.id}`), {
                            status: "Low Stock"
                        });
                        toast({
                            duration: 100000000000,
                            title: `${item.id + ' : ' + item.contents}`,
                            description: `Low Stock Alert: The quantity of item is exactly 50% of the base quantity.`,
                        })
                    }

                    if (Number(item.quantity) === outOfStock) {
                        await update(ref(database, `inventory/${item.id}`), {
                            status: "Out of Stock"
                        });

                        toast({
                            duration: 100000000000,
                            title: `Out of Stock Alert: The quantity of item "${item.contents}" is exactly 0% of the base quantity.`,
                            description: `${format(new Date(), 'MMMM dd, yyyy hh:mm aa')}`,
                        })
                    }
                }
            }
        };

        onValue(inventoryRef, fetchData);

        return () => {
            // Unsubscribe from the real-time listener when component unmounts
            onValue(inventoryRef, fetchData);
        };
    }, []);

    return (
        <>
            <div className={`${theme === 'dark' ? 'bg-[#020817]' : ''} ${theme === 'light' ? 'bg-white' : ''} sticky top-0 z-20 ${scrollY === 0 ? '' : 'border-b transition-all duration-300 ease-out'}`}>
                <div className="relative px-2 sm:px-4 lg:px-8 flex h-20 items-center justify-between">
                    <MenuNav session={session} user={user} />
                </div>
            </div>
            {menuModal.isOpen && <MobileMenu />}
        </>
    )
}

export default Navbar;
