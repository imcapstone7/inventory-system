"use client";

import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { SessionData } from "@/lib/lib";
import { IronSession } from "iron-session";
import { Check, ChevronsUpDown, SlidersVertical, X } from "lucide-react";
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
import toast from "react-hot-toast";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";

interface LowerProps {
    session: IronSession<SessionData>
}

type Verification = {
    id: string
    email: string;
    creationTime: string;
    verified: boolean
}

type History = {
    osUsed: string;
    browserUsed: string;
    createdAt: number
}

const Lower: React.FC<LowerProps> = ({
    session
}) => {
    const { theme } = useTheme();
    const router = useRouter();
    const { isMounted } = useMount();
    const [isOpen, setIsOpen] = useState(false)

    const [data, setData] = useState<History[]>([]);
    const [dataLogs, setDataLogs] = useState<Logs[]>([]);
    const [dataVerify, setDataVerify] = useState<Verification[]>([]);

    const [globalFilter, setGlobalFilter] = useState('');
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
    const [sorting, setSorting] = useState<SortingState>([])

    const [verifyLoading, setVerifyLoading] = useState<{ [id: string]: boolean }>({});
    const [deleteLoading, setDeleteLoading] = useState<{ [id: string]: boolean }>({});

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

        const verifyDataRef = ref(database, 'mobile/users');

        const fetchData = (snapshot: any) => {
            const verifyData = snapshot.val();
            if (verifyData) {
                const verifyArray: Verification[] = Object.keys(verifyData).map(key => ({
                    id: key,
                    ...verifyData[key]
                }));

                setDataVerify(verifyArray);
            }
        };

        onValue(verifyDataRef, fetchData);

        return () => {
            // Unsubscribe from the real-time listener when component unmounts
            onValue(verifyDataRef, fetchData);
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

    const onVerify = async (id: string) => {
        setVerifyLoading((prev) => ({ ...prev, [id]: true }));

        try {
            const response = await axios.post('/api/verifyUser', { id });

            if (response.data.status === 200) {
                toast.success('Account Verified');
                router.refresh();
            }
        } catch (error) {
            console.log(error);
            toast.error('Something went wrong.');
        } finally {
            setVerifyLoading((prev) => ({ ...prev, [id]: false }));
        }
    };

    const onDelete = async (id: string) => {
        setDeleteLoading((prev) => ({ ...prev, [id]: true }));

        try {
            const response = await axios.post('/api/deleteUser', { id });

            if (response.data.status === 200) {
                toast.success('Account Deleted');
                router.refresh();
            }
        } catch (error) {
            console.log(error);
            toast.error('Something went wrong.');
        } finally {
            setDeleteLoading((prev) => ({ ...prev, [id]: false }));
        }
    };

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
                                {data
                                    .slice(1) // Skip the first item if necessary
                                    .sort((a, b) => b.createdAt - a.createdAt) // Sort by latest to oldest
                                    .map((item, index) => (
                                        <div
                                            key={index}
                                            className="flex flex-col rounded-md border px-4 py-3 font-mono text-sm"
                                        >
                                            <div>
                                                OS: {item.osUsed}
                                            </div>
                                            <div>
                                                Browser: <span className="text-green-500">{item.browserUsed}</span>
                                            </div>
                                            <div>
                                                When: {format(new Date(item.createdAt), "MMM dd, yyyy")}
                                            </div>
                                        </div>
                                    ))}
                            </CollapsibleContent>
                        </Collapsible>
                        <div className="flex flex-col gap-2">
                            <div className="relative text-lg font-bold ml-3">
                                User Verification
                                {dataVerify.filter(data => !data.verified).length === 0 ? '' : (
                                    <div className="absolute left-40 top-0 bg-red-500 p-1 px-2 rounded-full text-xs">
                                        {dataVerify.filter(data => !data.verified).length}
                                    </div>
                                )}
                            </div>
                            {dataVerify.every(data => data.verified) ? (
                                <div className="text-xs text-gray-500 italic ml-3">
                                    There is no user to verify for now...
                                </div>
                            ) : (
                                <div className="flex flex-col gap-2">
                                    {dataVerify.filter((data) => !data.verified).map((data) => (
                                        <div key={data.id} className="flex border rounded-md w-fit p-4">
                                            <div className="flex flex-row items-center justify-center gap-2">
                                                <div className="flex flex-col gap-2 text-xs font-mono font-semibold">
                                                    <div>Email: {data.email}</div>
                                                    <div>Date Created: {format(data.creationTime, 'EEE, dd MMM yyyy')}</div>
                                                </div>
                                                <div className="flex flex-col gap-2">
                                                    <div onClick={() => onVerify(data.id)} className="border rounded-md p-2 cursor-pointer hover:scale-105">
                                                        {verifyLoading[data.id] ? (
                                                            <div className={`h-6 w-6 rounded-full border-2 border-solid ${theme === 'dark' ? 'border-white' : 'border-black'} border-e-transparent animate-spin`} />
                                                        ) : (
                                                            <Check className="h-5 w-5 text-green-500" />
                                                        )}
                                                    </div>
                                                    <div onClick={() => onDelete(data.id)} className="border rounded-md p-2 cursor-pointer hover:scale-105">
                                                        {deleteLoading[data.id] ? (
                                                            <div className={`h-6 w-6 rounded-full border-2 border-solid ${theme === 'dark' ? 'border-white' : 'border-black'} border-e-transparent animate-spin`} />
                                                        ) : (
                                                            <X className="h-5 w-5 text-red-500" />
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
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