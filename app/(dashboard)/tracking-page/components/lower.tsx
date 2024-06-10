"use client";

import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useTheme } from "next-themes";
import Inventory from "../../inventory-page/page";
import useMount from "@/hook/use-mount";
import { Skeleton } from "@/components/ui/skeleton";
import { Transport } from "../../transports-page/components/column";
import { useState } from "react";

interface LowerProps {
    data: Inventory | Transport | undefined
    loadingSearch: boolean
}

const Lower: React.FC<LowerProps> = ({
    data,
    loadingSearch
}) => {

    const { theme } = useTheme();
    const { isMounted } = useMount();

    const isInventory = (data: Inventory | Transport | undefined): data is Inventory => {
        return !!data && "inventoryName" in data;
    };

    const isTransport = (data: Inventory | Transport | undefined): data is Transport => {
        return !!data && "receiver" in data;
    };

    return (
        <div className="flex flex-col-reverse gap-16 md:grid md:grid-cols-12 md:gap-4">
            {
                !isMounted ?
                    <div className="col-span-12 flex items-center justify-center h-[68vh] w-full">
                        <Skeleton className="col-span-5 h-10 w-11/12" />
                    </div>

                    :
                    <div className={`${loadingSearch || data?.id ? 'hidden' : 'block'} col-span-12 flex items-center justify-center text-center font-mono italic text-gray-500 h-[68vh]`}>
                        -The purpose of tracking inventory data is to maintain accurate records of items stored, their quantities, and their locations. This helps in efficient inventory management, ensuring that stock levels are adequate, and assists in locating items quickly when needed-
                    </div>
            }
            {
                loadingSearch ?
                    <Skeleton className="col-span-5 h-[370px]" />
                    :
                    <div className={`${theme === 'dark' ? ' bg-[#172030]' : 'bg-[#F4F4F4]'} ${loadingSearch || data?.id ? 'block' : 'hidden'} col-span-5 border border-1 rounded-lg p-4`}>
                        <div className="flex flex-col gap-4">
                            <div className="text-2xl font-semibold">
                                Tracking Info
                            </div>
                            <Separator />
                            <div className="flex flex-col gap-4">
                                <div className="flex text-md gap-1 font-mono">
                                    Code:
                                    <Badge>{data?.id}</Badge>
                                </div>
                                {isInventory(data) && (
                                    <div className="flex text-md gap-1 font-mono">
                                        Inventory Name:
                                        <div className="font-extrabold text-[#fb4c0a]">
                                            {data.inventoryName}
                                        </div>
                                    </div>
                                )}
                                {isTransport(data) && (
                                    <div className="flex text-md gap-1 font-mono">
                                        Receiver Name:
                                        <div className="font-extrabold text-[#fb4c0a]">
                                            {data.receiver}
                                        </div>
                                    </div>
                                )}
                                {isInventory(data) && (
                                    <div className="flex text-md gap-1 font-mono">
                                        Description:
                                        <div className="font-extrabold text-[#fb4c0a]">
                                            {data.description}
                                        </div>
                                    </div>
                                )}
                                {isTransport(data) && (
                                    <div className="flex text-md gap-1 font-mono">
                                        Item:
                                        <div className="font-extrabold text-[#fb4c0a]">
                                            {data.item}
                                        </div>
                                    </div>
                                )}
                                {isInventory(data) && (
                                    <div className="flex text-md gap-1 font-mono">
                                        Category:
                                        <div className="font-extrabold text-[#fb4c0a]">
                                            {data.category}
                                        </div>
                                    </div>
                                )}
                                {isTransport(data) && (
                                    <div className="flex text-md gap-1 font-mono">
                                        Purpose:
                                        <div className="font-extrabold text-[#fb4c0a]">
                                            {data.purpose}
                                        </div>
                                    </div>
                                )}
                                {isInventory(data) && (
                                    <div className="flex text-md gap-1 font-mono">
                                        Contents:
                                        <div className="font-extrabold text-[#fb4c0a]">
                                            {data.contents}
                                        </div>
                                    </div>
                                )}
                                {isTransport(data) && (
                                    <div className="flex text-md gap-1 font-mono">
                                        Return Date:
                                        <div className="font-extrabold text-[#fb4c0a]">
                                            {data.returnDate}
                                        </div>
                                    </div>
                                )}
                                {isInventory(data) && (
                                    <div className="flex text-md gap-1 font-mono">
                                        Quantity:
                                        <div className="font-extrabold text-[#fb4c0a]">
                                            {data.quantity}
                                        </div>
                                    </div>
                                )}
                                {isInventory(data) && (
                                    <div className="flex text-md gap-1 font-mono">
                                        location:
                                        <div className="font-extrabold text-[#fb4c0a]">
                                            {data.location}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
            }
            {
                loadingSearch ?
                    <div className="mt-20 md:mt-0 md:col-span-7 h-full flex flex-col items-center justify-center gap-16">
                        <Skeleton className="h-2 w-[85%]" />
                        <div className="flex flex-row justify-between w-11/12">
                            <Skeleton className="h-10 w-28" />
                            <Skeleton className="h-10 w-28" />
                            <Skeleton className="h-10 w-28" />
                        </div>
                    </div>
                    :
                    <div className={`${loadingSearch || data?.id ? 'block' : 'hidden'} mt-20 md:mt-0 md:col-span-7 h-full flex flex-col items-center justify-center gap-16`}>
                        <div className={`relative flex items-center h-2 w-[85%] ${theme === 'dark' ? 'bg-[#172030] ' : 'bg-gray-300'} rounded-full`}>
                            <div className={`${data?.status === "Out of Stock" ? 'block' : data?.status === "Borrowed" ? 'block' : 'hidden'} absolute h-16 w-16`}>
                                <div className="absolute h-16 w-16 bg-[#fb4c0a] rounded-full animate-ping" />
                                <div className="absolute h-16 w-16 bg-[#fb4c0a] rounded-full " />
                            </div>
                            <div className={`${data?.status === "Low Stock" ? 'block' : 'hidden'} absolute h-16 w-16 right-[270px]`}>
                                <div className="absolute h-16 w-16 bg-[#fb4c0a] rounded-full animate-ping" />
                                <div className="absolute h-16 w-16 bg-[#fb4c0a] rounded-full " />
                            </div>
                            <div className={`${data?.status === "Available" ? 'block' : data?.status === "Returned" ? 'block' : 'hidden'} absolute h-16 w-16 right-0`}>
                                <div className="absolute h-16 w-16 bg-[#fb4c0a] rounded-full animate-ping" />
                                <div className="absolute h-16 w-16 bg-[#fb4c0a] rounded-full " />
                            </div>
                        </div>
                        <div className={`relative flex justify-between h-8 w-11/12 rounded-full text-xl font-extrabold`}>
                            <div className={`${data?.status === "Out of Stock" ? 'text-red-500' : data?.status === "Borrowed" ? 'text-yellow-500' : 'text-gray-600'}`}>
                                {isInventory(data) ? 'Out of Stock' : data?.status === "Borrowed" || "Returned" ? "Borrowed" : 'Borrowed'}
                            </div>
                            <div className={`${data?.status === "Low Stock" ? 'text-yellow-500' : 'text-gray-500'}`}>
                                {
                                    isInventory(data) ?
                                        'Low Stock'
                                        :
                                        ''
                                }
                            </div>
                            <div className={`${data?.status === "Available" ? 'text-green-500' : data?.status === "Returned" ? 'text-green-500' : 'text-gray-600'}`}>
                                {isInventory(data) ? 'Available' : data?.status === "Returned" || "Borrowed" ? "Returned" : 'Returned'}
                            </div>
                        </div>
                    </div>
            }
        </div>
    )
}

export default Lower;