"use client";

import { useEffect, useState } from "react";
import Lower from "./components/lower";
import Upper from "./components/upper";
import { Inventory } from "./components/columns";
import { Transport } from "../transports-page/components/column";
import { Unsubscribe, onValue, ref } from "firebase/database";
import { database } from "@/firebase";

export interface DataState {
    inventory: Inventory[];
    transport: Transport[];
}

const Dashboard = () => {

    const [data, setData] = useState<DataState>({ inventory: [], transport: [] });

    useEffect(() => {
        const inventoryRef = ref(database, 'inventory');
        const transportRef = ref(database, 'transport');

        const fetchData = (snapshot: any, type: 'inventory' | 'transport') => {
            const fetchedData = snapshot.val();
            if (fetchedData) {
                const dataArray = Object.keys(fetchedData).map(key => ({
                    id: key,
                    ...fetchedData[key]
                }));
                setData(prevData => ({
                    ...prevData,
                    [type]: dataArray
                }));
            }
        };

        const inventoryListener: Unsubscribe = onValue(inventoryRef, snapshot => fetchData(snapshot, 'inventory'));
        const transportListener: Unsubscribe = onValue(transportRef, snapshot => fetchData(snapshot, 'transport'));

        return () => {
            // Unsubscribe from the real-time listeners when component unmounts
            inventoryListener();
            transportListener();
        };
    }, []);

    return (
        <div className="h-full">
            <div className="mx-8 my-4 space-y-4">
                <Upper data={data.inventory} />
                <Lower allData={data} />
            </div>
        </div>
    )
}

export default Dashboard;

