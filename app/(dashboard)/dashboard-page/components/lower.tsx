"use client"

import { CircleArrowUp, Container, SlidersVertical } from "lucide-react";
import LeftChart from "./left-chart";
import MiddleChart from "./middle-chart";
import TrackChart from "./track-chart";
import AlmostCompleted from "./almost-completed";
import { DataTable } from "./data-table";
import { Inventory, columns } from "./columns";
import { useEffect, useState } from "react";
import { database } from "@/firebase";
import { onValue, ref } from "firebase/database";
import { Input } from "@/components/ui/input";
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { VisibilityState, getCoreRowModel, getFilteredRowModel, useReactTable } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import useMount from "@/hook/use-mount";
import { Skeleton } from "@/components/ui/skeleton";
import { useTheme } from "next-themes";

const Lower = () => {

    const { isMounted } = useMount();
    const { theme } = useTheme();
    const [data, setData] = useState<Inventory[]>([]);
    const [globalFilter, setGlobalFilter] = useState('');
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        onGlobalFilterChange: setGlobalFilter,
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        state: {
            globalFilter,
            columnVisibility,
        },
    });

    useEffect(() => {

        const inventoryRef = ref(database, 'inventory');

        const fetchData = (snapshot: any) => {
            const inventoryData = snapshot.val();
            if (inventoryData) {
                const inventoryArray: Inventory[] = Object.keys(inventoryData).map(key => ({
                    id: key,
                    ...inventoryData[key]
                }));

                const sortedData = inventoryArray.sort((a, b) => b.createdAt - a.createdAt).slice(0, 6);
                setData(sortedData);
            }
        };

        onValue(inventoryRef, fetchData);

        return () => {
            // Unsubscribe from the real-time listener when component unmounts
            onValue(inventoryRef, fetchData);
        };
    }, []);

    return (
        <div className="flex flex-col md:grid md:grid-cols-10 gap-4">
            {
                !isMounted ?
                    <div className="md:col-span-7 flex flex-col gap-4">
                        <div className="flex w-full gap-2">
                            <Skeleton className="h-36 w-1/3" />
                            <Skeleton className="h-36 w-1/3" />
                            <Skeleton className="h-36 w-1/3" />
                        </div>
                        <Skeleton className="h-[600px] w-full" />
                    </div>
                    :
                    <div className="md:col-span-7 flex flex-col gap-4">
                        <div className="flex flex-col md:flex-row w-full gap-2">
                            <div className={`${theme === 'dark' ? ' bg-[#172030]' : 'bg-[#F4F4F4]'} w-full md:w-1/3 flex justify-center items-center p-4 rounded-lg`}>
                                <div className="flex flex-col w-full">
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <div className="text-xl font-semibold">
                                                Borrowed Rate
                                            </div>
                                            <div className="text-xs font-medium text-gray-500">
                                                Percentage of borrowed items
                                            </div>
                                        </div>
                                        <CircleArrowUp className="h-6 w-6 text-[#81ddd5]" />
                                    </div>
                                    <div className="flex items-center justify-between mt-4">
                                        <LeftChart />
                                        <div className="text-4xl font-bold">
                                            92%
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className={`relative ${theme === 'dark' ? ' bg-[#172030]' : 'bg-[#F4F4F4]'} w-full md:w-1/3 flex justify-center items-center p-4 rounded-lg`}>
                                <div className="md:absolute top-0 p-4 flex flex-col w-full">
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <div className="text-xl font-semibold">
                                                Inventory
                                            </div>
                                            <div className="text-xs font-medium text-gray-500">
                                                The number of inventory
                                            </div>
                                        </div>
                                        <CircleArrowUp className="h-6 w-6 text-[#81ddd5]" />
                                    </div>
                                    <div className="relative flex justify-evenly mt-4">
                                        <MiddleChart />
                                        <div className="absolute text-4xl font-bold right-0 top-1">
                                            547
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className={`${theme === 'dark' ? ' bg-[#172030]' : 'bg-[#F4F4F4]'} w-full md:w-1/3 flex justify-center items-center p-4 rounded-lg`}>
                                <div className="flex flex-col w-full">
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <div className="text-xl font-semibold">
                                                Efficiency
                                            </div>
                                            <div className="text-xs font-medium text-gray-500">
                                                Percentage of successfully returned
                                            </div>
                                        </div>
                                        <CircleArrowUp className="h-6 w-6 text-[#81ddd5]" />
                                    </div>
                                    <div className="flex items-center justify-between mt-4">
                                        <LeftChart />
                                        <div className="text-4xl font-bold">
                                            86%
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className={`flex flex-col gap-4 ${theme === 'dark' ? ' bg-[#172030]' : 'bg-[#F4F4F4]'} p-4 rounded-lg`}>
                            <div className="flex justify-between item-center md:grid md:grid-cols-12">
                                <div className="md:col-span-7 text-xl font-semibold flex items-center">
                                    Latest Inventory
                                </div>
                                <div className="md:col-span-5 flex items-center gap-2">
                                    <Input
                                        placeholder="Search"
                                        value={globalFilter}
                                        onChange={e => setGlobalFilter(e.target.value)}
                                        className="w-2/3"
                                    />
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button className="text-xs w-1/3">
                                                <SlidersVertical className="h-4 w-4 mr-1" />Advance
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            {table
                                                .getAllColumns()
                                                .filter(
                                                    (column) => column.getCanHide()
                                                )
                                                .map((column) => {
                                                    return (
                                                        <DropdownMenuCheckboxItem
                                                            key={column.id}
                                                            className="capitalize"
                                                            checked={column.getIsVisible()}
                                                            onCheckedChange={(value) =>
                                                                column.toggleVisibility(!!value)
                                                            }
                                                        >
                                                            {column.id}
                                                        </DropdownMenuCheckboxItem>
                                                    )
                                                })}
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                            </div>
                            <DataTable columns={columns} data={data} globalFilter={globalFilter} setGlobalFilter={setGlobalFilter} columnVisibility={columnVisibility} setColumnVisibility={setColumnVisibility} table={table} />
                        </div>
                    </div>
            }
            {
                !isMounted ?
                    <div className="col-span-3 flex flex-col gap-2">
                        <Skeleton className="h-52 w-full" />
                        <Skeleton className="h-[542px] w-full" />
                    </div>
                    :
                    <div className="col-span-3 flex flex-col gap-2">
                        <div className={`${theme === 'dark' ? ' bg-[#172030]' : 'bg-[#F4F4F4]'} p-4 rounded-lg`}>
                            <div className="text-xl font-semibold">
                                Total Shipment
                            </div>
                            <div className="flex items-center gap-2">
                                <Container className="h-28 w-28" />
                                <div className="text-3xl font-bold">
                                    452 items
                                </div>
                            </div>
                            <div className="text-xs font-medium text-gray-500 mt-2">
                                The total number of shipments currently managed in the system.
                            </div>
                        </div>
                        <div className={`${theme === 'dark' ? ' bg-[#172030]' : 'bg-[#F4F4F4]'}  p-4 rounded-lg`}>
                            <div className="text-xl font-semibold">
                                Tracking
                            </div>
                            <div>
                                <TrackChart />
                            </div>
                            <div className="mt-2 flex flex-col gap-4">
                                <div className="font-semibold">
                                    Latest Borrowed/Returned
                                </div>
                                <div className="flex justify-center items-center">
                                    <AlmostCompleted />
                                </div>
                            </div>
                        </div>
                    </div>
            }
        </div>
    )
}

export default Lower;