"use client"

import Lower from "./components/lower";
import Upper from "./components/upper";
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import Inventory from "../inventory-page/page";
import { searchSchema } from "@/lib/types";

const Tracking = () => {

    const [loadingSearch, setLoadingSearch] = useState(false);
    const [data, setData] = useState<Inventory>();

    const form = useForm<z.infer<typeof searchSchema>>({
        resolver: zodResolver(searchSchema),
        defaultValues: {
            search: "",
        },
    });

    const onSearch = async (values: z.infer<typeof searchSchema>) => {
        setLoadingSearch(true);
        try {

            const response = await axios.post('/api/searchData', {
                values
            });

            if (response.data.status === 200) {
                setData(response.data.formatData);
            }

        } catch (error) {
            console.log(error);
            toast.error('Something went wrong.');
        } finally {
            setTimeout(() => {
                setLoadingSearch(false);
            }, 1000);
        }
    }

    return (
        <div className="h-full">
            <div className="mx-8 my-4 space-y-4">
                <Upper form={form} onSearch={onSearch} loadingSearch={loadingSearch} />
                <Lower data={data} loadingSearch={loadingSearch} />
            </div>
        </div>
    )
}

export default Tracking;