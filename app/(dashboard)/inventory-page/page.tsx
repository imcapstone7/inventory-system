"use client"

import { useEffect, useState } from "react";
import Lower from "./components/lower";
import Upper from "./components/upper";
import { onValue, ref } from "firebase/database";
import { database } from "@/firebase";

type Inventory = {
    id: string
    barcodeImageUrl: string
    category: string
    contents: string
    createdAt: number
    description: string
    inventoryName: string
    location: string
    quantity: string
    baseQuantity: string
    status: string
}

const Inventory = () => {

    const [data, setData] = useState<Inventory[]>([]);

    useEffect(() => {

        const inventoryRef = ref(database, 'inventory');

        const fetchData = (snapshot: any) => {
            const inventoryData = snapshot.val();
            if (inventoryData) {
                const inventoryArray: Inventory[] = Object.keys(inventoryData).map(key => ({
                    id: key,
                    ...inventoryData[key]
                }));

                setData(inventoryArray);
            }
        };

        onValue(inventoryRef, fetchData);

        return () => {
            // Unsubscribe from the real-time listener when component unmounts
            onValue(inventoryRef, fetchData);
        };
    }, []);

    return (
        <div className="h-[82%] flex flex-col gap-4 lg:gap-8 p-4 xl:p-8">
            <Upper data={data} />
            <Lower data={data} />
        </div>
    )
}

export default Inventory;