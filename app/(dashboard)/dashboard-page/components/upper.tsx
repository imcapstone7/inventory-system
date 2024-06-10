"use client"

import { useSession } from "@/app/session-context";
import AddInventory from "./add-inventory";
import useMount from "@/hook/use-mount";
import { Skeleton } from "@/components/ui/skeleton";
import AddTransports from "../../transports-page/components/add-transports";
import { Inventory } from "./columns";

interface UpperProps {
    data: Inventory[]
}

const Upper: React.FC<UpperProps> = ({
    data
}) => {

    const session = useSession();
    const { isMounted } = useMount();

    const emailParts = session.email?.split('@');
    const email = emailParts ? emailParts[0] : 'Unknown';


    return (
        <div className="flex flex-col md:flex-row md:justify-between md:items-center md:gap-0 gap-2">
            <div className="flex flex-col">
                {
                    !isMounted ?
                        <Skeleton className="h-7 w-96" />
                        :
                        <div className="text-2xl font-bold">
                            Welcome back, {email}
                        </div>
                }
                {
                    !isMounted ?
                        <Skeleton className="h-6 w-24 mt-2" />
                        :
                        <div className=" text-lg text-gray-500 font-medium">
                            Overview
                        </div>
                }
            </div>
            {
                !isMounted ?
                    <div className="flex gap-2">
                        <Skeleton className="h-10 w-36" />
                        <Skeleton className="h-10 w-36" />
                    </div>
                    :
                    <div className="flex gap-2">
                        <AddInventory />
                        <AddTransports data={data} />
                    </div>
            }
        </div>
    )
}

export default Upper;