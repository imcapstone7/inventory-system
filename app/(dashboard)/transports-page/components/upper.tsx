"use client";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import useMount from "@/hook/use-mount";
import { FileText } from "lucide-react";
import AddTransports from "./add-transports";
import { useEffect, useState } from "react";
import { onValue, ref } from "firebase/database";
import { database } from "@/firebase";
import Inventory from "../../inventory-page/page";
import { Transport } from "./column";
import axios from "axios";
import toast from "react-hot-toast";
import { format } from "date-fns";
import { useTheme } from "next-themes";

interface UpperProps {
    dataTransport: Transport[]
}

const Upper: React.FC<UpperProps> = ({
    dataTransport
}) => {

    const { theme } = useTheme();
    const { isMounted } = useMount();
    const [data, setData] = useState<Inventory[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {

        const inventoryRef = ref(database, 'inventory');

        const fetchData = (snapshot: any) => {
            const inventoryData = snapshot.val();
            if (inventoryData) {
                const inventoryArray: Inventory[] = Object.keys(inventoryData).map(key => ({
                    id: key,
                    ...inventoryData[key]
                }));

                // const sortedData = inventoryArray.sort((a, b) => b.createdAt - a.createdAt).slice(0, 6);
                setData(inventoryArray);
            }
        };

        onValue(inventoryRef, fetchData);

        return () => {
            // Unsubscribe from the real-time listener when component unmounts
            onValue(inventoryRef, fetchData);
        };
    }, []);

    const dataWithCreatedAtAsString = dataTransport.map(item => ({
        ...item,
        createdAt: String(format(item.createdAt, 'MMM dd, yyyy'))
    }));

    const generateReport = async () => {
        try {
            setLoading(true);
            const response = await axios.post('/api/generatePdfPrint', dataWithCreatedAtAsString, { responseType: 'blob' });

            // Create URL for PDF blob
            const url = window.URL.createObjectURL(new Blob([response.data]));

            // Create anchor element to trigger download
            const a = document.createElement('a');
            a.href = url;
            a.download = 'report(TRANSPORTS).pdf';
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
                            Effortless Transports Management
                        </div>
                }
                {
                    !isMounted ?
                        <Skeleton className="h-6 w-24 mt-2" />
                        :
                        <div className=" text-lg text-gray-500 font-medium">
                            Transports
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
                        <AddTransports data={data} />
                        <Button onClick={generateReport} className="text-xs bg-[#fb4c0a]">
                            {loading ? (
                                <div className={`h-6 w-6 rounded-full border-2 border-solid ${theme === 'dark' ? 'border-black' : 'border-white'} border-e-transparent animate-spin`} />
                            ) :
                                (<><FileText className="h-4 w-4 mr-1" />Print</>)
                            }
                        </Button>
                    </div>
            }
        </div>
    )
}

export default Upper;