import { Skeleton } from "@/components/ui/skeleton";
import useMount from "@/hook/use-mount";
import Searching from "./search";
import { UseFormReturn } from "react-hook-form";
import { searchSchema } from "../page";
import { z } from "zod"

interface UpperProps {
    onSearch: (values: z.infer<typeof searchSchema>) => Promise<void>
    form: UseFormReturn<{
        search: string;
    }, any, undefined>
    loadingSearch: boolean
}

const Upper: React.FC<UpperProps> = ({
    form,
    onSearch,
    loadingSearch
}) => {

    const { isMounted } = useMount();

    return (
        <div className="flex flex-col md:flex-row md:justify-between md:items-center md:gap-0 gap-2">
            <div className="flex flex-col">
                {
                    !isMounted ?
                        <Skeleton className="h-7 w-96" />
                        :
                        <div className="text-2xl font-bold">
                            Track Every Inventory & Transports
                        </div>
                }
                {
                    !isMounted ?
                        <Skeleton className="h-6 w-24 mt-2" />
                        :
                        <div className=" text-lg text-gray-500 font-medium">
                            Tracking
                        </div>
                }
            </div>
            {
                !isMounted ?
                    <div className="flex gap-2">
                        <Skeleton className="h-11 w-[400px]" />
                        <Skeleton className="h-11 w-[84px]" />
                    </div>
                    :
                    <div className="flex">
                        <Searching form={form} onSearch={onSearch} loadingSearch={loadingSearch}/>
                    </div>
            }
        </div>
    )
}

export default Upper;