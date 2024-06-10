"use client";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import useMount from "@/hook/use-mount";
import { FileText } from "lucide-react";
import AddInventory from "../../dashboard-page/components/add-inventory";
import { Inventory } from "./columns";
import axios from "axios";
import toast from "react-hot-toast";
import { useTheme } from "next-themes";
import { useState } from "react";

interface UpperProps {
    data: Inventory[]
}

const Upper: React.FC<UpperProps> = ({
    data
}) => {

    const { theme } = useTheme();
    const { isMounted } = useMount();
    const [loading, setLoading] = useState(false);

    const dataWithCreatedAtAsString = data.map(item => ({
        ...item,
        createdAt: String(item.createdAt) // or item.createdAt.toString()
    }));

    const generateReport = async () => {
        try {
            setLoading(true);
            const response = await axios.post('/api/generatePdfReport', dataWithCreatedAtAsString, { responseType: 'blob' });

            // Create URL for PDF blob
            const url = window.URL.createObjectURL(new Blob([response.data]));
            // Create anchor element to trigger download
            const a = document.createElement('a');
            a.href = url;
            a.download = 'report(INVENTORY).pdf';
            document.body.appendChild(a);
            a.click();
            a.remove();
        } catch (error) {
            console.error('Error generating report:', error);
            toast.error('Error generating report.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col md:flex-row md:justify-between md:items-center md:gap-0 gap-2">
            <div className="flex flex-col">
                {
                    !isMounted ?
                        <Skeleton className="h-7 w-96" />
                        :
                        <div className="text-2xl font-bold">
                            Elevate Efficiency with Inventory
                        </div>
                }
                {
                    !isMounted ?
                        <Skeleton className="h-6 w-24 mt-2" />
                        :
                        <div className=" text-lg text-gray-500 font-medium">
                            Inventory
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
                        <Button onClick={generateReport} className="text-xs bg-[#fb4c0a]">
                            {loading ? (
                                <div className={`h-6 w-6 rounded-full border-2 border-solid ${theme === 'dark' ? 'border-black' : 'border-white'} border-e-transparent animate-spin`} />
                            ) :
                                (<><FileText className="h-4 w-4 mr-1" />Generate Report</>)}</Button>
                    </div>
            }
        </div>
    )
}

export default Upper;