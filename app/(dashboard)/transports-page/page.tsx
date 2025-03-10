"use client"

import { useEffect, useState } from "react";
import Upper from "./components/upper";
import { database } from "@/firebase";
import { onValue, ref } from "firebase/database";
import Lower from "./components/lower";

type Transport = {
    id: string
    barcodeImageUrl: string
    user: string
    itemId: string
    item: string
    receiver: string
    purpose: string
    returnDate: string
    status: string
    createdAt: number
}

const Transports = () => {

    const [data, setData] = useState<Transport[]>([]);

    useEffect(() => {

        const transportRef = ref(database, 'transport');

        const fetchData = (snapshot: any) => {
            const transportData = snapshot.val();
            if (transportData) {
                const transportArray: Transport[] = Object.keys(transportData).map(key => ({
                    id: key,
                    ...transportData[key]
                }));

                setData(transportArray);
            }
        };

        onValue(transportRef, fetchData);

        return () => {
            // Unsubscribe from the real-time listener when component unmounts
            onValue(transportRef, fetchData);
        };
    }, []);

    return (
        <div className="h-[82%] flex flex-col gap-4 lg:gap-8 p-4 xl:p-8">
            <Upper dataTransport={data} />
            <Lower data={data} />
        </div>
    )
}

export default Transports;