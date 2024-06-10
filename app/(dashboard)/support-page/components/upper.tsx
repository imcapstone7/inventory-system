"use client";

import { Skeleton } from "@/components/ui/skeleton";
import useMount from "@/hook/use-mount";

const Upper = () => {

    const { isMounted } = useMount();

    return (
        <div className="flex flex-col md:flex-row md:justify-between md:items-center md:gap-0 gap-2">
            <div className="flex flex-col">
                {
                    !isMounted ?
                        <Skeleton className="h-7 w-96" />
                        :
                        <div className="text-2xl font-bold">
                            Access resources and assistance for any issues or questions you may have.
                        </div>
                }
                {
                    !isMounted ?
                        <Skeleton className="h-6 w-24 mt-2" />
                        :
                        <div className=" text-lg text-gray-500 font-medium">
                            Support and Help
                        </div>
                }
            </div>
        </div>
    )
}

export default Upper;