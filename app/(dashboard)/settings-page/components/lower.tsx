"use client";

import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { SessionData } from "@/lib/lib";
import { IronSession } from "iron-session";
import { ChevronsUpDown, SlidersVertical } from "lucide-react";
import { useEffect, useState } from "react";
import { onValue, ref } from "firebase/database";
import { database } from "@/firebase";
import { format } from "date-fns";
import { ModeToggle } from "@/components/theme-toggle";
import { DataTable } from "./data-table";
import { SortingState, VisibilityState, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useReactTable } from "@tanstack/react-table";
import { Logs, columns } from "./columns";
import { Input } from "@/components/ui/input";
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import Delete from "./delete";
import useMount from "@/hook/use-mount";
import { Skeleton } from "@/components/ui/skeleton";

interface LowerProps {
    session: IronSession<SessionData>
}

type History = {
    osUsed: string;
    browserUsed: string;
    createdAt: number
}

const Lower: React.FC<LowerProps> = ({
    session
}) => {

    const { isMounted } = useMount();
    const [isOpen, setIsOpen] = useState(false)

    const [data, setData] = useState<History[]>([]);
    const [dataLogs, setDataLogs] = useState<Logs[]>([]);

    const [globalFilter, setGlobalFilter] = useState('');
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
    const [sorting, setSorting] = useState<SortingState>([])

    const table = useReactTable({
        data: dataLogs,
        columns,
        getCoreRowModel: getCoreRowModel(),
        onGlobalFilterChange: setGlobalFilter,
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onSortingChange: setSorting,
        getSortedRowModel: getSortedRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        state: {
            globalFilter,
            columnVisibility,
            sorting,
        },
    });

    useEffect(() => {

        const logsDataRef = ref(database, 'logs');

        const fetchData = (snapshot: any) => {
            const logsData = snapshot.val();
            if (logsData) {
                const LogsArray: Logs[] = Object.keys(logsData).map(key => ({
                    id: key,
                    ...logsData[key]
                }));

                setDataLogs(LogsArray);
            }
        };

        onValue(logsDataRef, fetchData);

        return () => {
            // Unsubscribe from the real-time listener when component unmounts
            onValue(logsDataRef, fetchData);
        };
    }, []);

    useEffect(() => {

        const inventoryRef = ref(database, `users/${session.uid}/history`);

        const fetchData = (snapshot: any) => {
            const userHistoryData = snapshot.val();
            if (userHistoryData) {
                const userHistoryArray: History[] = Object.keys(userHistoryData).map(key => ({
                    id: key,
                    ...userHistoryData[key]
                }));

                setData(userHistoryArray);
            }
        };

        onValue(inventoryRef, fetchData);

        return () => {
            // Unsubscribe from the real-time listener when component unmounts
            onValue(inventoryRef, fetchData);
        };
    }, []);

    return (
        <> {
            !isMounted ?
                <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-2">
                        <Skeleton className="ml-3 h-7 w-48" />
                        <Skeleton className="h-10 w-10" />
                    </div>
                    <div className="flex flex-col gap-2">
                        <Skeleton className="ml-3 h-10 w-80" />
                        <Skeleton className=" h-16 w-96 mb-6" />
                    </div>
                    <div className="flex flex-col gap-2">
                        <Skeleton className="ml-3 h-7 w-16" />
                        <Skeleton className="ml-3 h-96 w-full md:w-4/6" />
                    </div>
                    <div className="flex flex-col gap-2">
                        <Skeleton className="ml-3 h-7 w-16" />
                        <div className="flex justify-between w-full md:w-4/6">
                            <div className="flex flex-col px-8 gap-1">
                                <Skeleton className="ml-3 h-5 w-24" />
                                <Skeleton className="ml-3 h-5 w-40" />
                            </div>
                            <Skeleton className="ml-3 h-10 w-36" />
                        </div>
                    </div>
                </div>
                :
                <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-2">
                        <div className="text-lg font-bold ml-3">
                            Theme preference
                        </div>
                        <ModeToggle />
                    </div>
                    <div className="flex flex-col gap-8">
                        <Collapsible
                            open={isOpen}
                            onOpenChange={setIsOpen}
                            className="w-[350px] space-y-2"
                        >
                            <div className="flex items-center justify-between space-x-4 px-4">
                                <div className="text-lg font-bold">
                                    Sign-in History
                                </div>
                                <CollapsibleTrigger asChild>
                                    <Button variant="ghost" size="sm" className="w-9 p-0">
                                        <ChevronsUpDown className="h-4 w-4" />
                                        <span className="sr-only">Toggle</span>
                                    </Button>
                                </CollapsibleTrigger>
                            </div>
                            <div className="flex justify-between rounded-md border px-4 py-3 font-mono text-sm">
                                <div>
                                    <div>
                                        OS: {data[0]?.osUsed}
                                    </div>
                                    <div>
                                        Browser: {data[0]?.browserUsed}
                                    </div>
                                    <div>
                                        When: {data[0] && format(data[0]?.createdAt, 'MMM dd, yyyy')}
                                    </div>
                                </div>
                                <div className="text-gray-500 italic">
                                    latest
                                </div>
                            </div>
                            <CollapsibleContent className="space-y-2">
                                {data.slice(1).map((item, index) => (
                                    <div key={index} className="flex flex-col rounded-md border px-4 py-3 font-mono text-sm">
                                        <div>
                                            OS: {item.osUsed}
                                        </div>
                                        <div>
                                            Browser: <span className="text-green-500">{item.browserUsed}</span>
                                        </div>
                                        <div>
                                            When: {format(item.createdAt, 'MMM dd, yyyy')}
                                        </div>
                                    </div>
                                ))}
                            </CollapsibleContent>
                        </Collapsible>
                        <div className="flex flex-col gap-2 w-full md:w-4/6">
                            <div className="text-lg font-bold ml-3">
                                Logs
                            </div>
                            <div className="flex items-center gap-2">
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
                            <DataTable columns={columns} data={dataLogs} globalFilter={globalFilter} setGlobalFilter={setGlobalFilter} columnVisibility={columnVisibility} setColumnVisibility={setColumnVisibility} table={table} />
                        </div>
                        <div className="flex flex-col gap-2 w-full md:w-4/6">
                            <div className="text-lg font-bold ml-3">
                                Danger
                            </div>
                            <div className="flex justify-between">
                                <div className="px-8">
                                    <div className="font-bold text-xs">
                                        DELETE ACCOUNT
                                    </div>
                                    <div className="text-xs italic text-gray-500">
                                        Delete your account and all its associated data
                                    </div>
                                </div>
                                <Delete session={session} />
                            </div>
                        </div>
                    </div>
                </div>
        }
        </>
    )
}

export default Lower;