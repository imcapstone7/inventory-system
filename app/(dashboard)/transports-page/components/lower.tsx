import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton"
import useMount from "@/hook/use-mount"
import { SortingState, VisibilityState, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useReactTable } from "@tanstack/react-table";
import { Printer, SlidersVertical } from "lucide-react";
import { useTheme } from "next-themes";
import { useState } from "react";
import { Transport, columns } from "./column";
import { DataTable } from "./data-table";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import axios from "axios";
import toast from "react-hot-toast";

interface LowerProps {
    data: Transport[]
}

const Lower: React.FC<LowerProps> = ({
    data
}) => {

    const { isMounted } = useMount();
    const { theme } = useTheme();

    const [globalFilter, setGlobalFilter] = useState('');
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
    const [sorting, setSorting] = useState<SortingState>([])
    const [loading, setLoading] = useState(false);

    const table = useReactTable({
        data,
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

    const dataWithCreatedAtAsString = data.map(item => ({
        ...item,
        createdAt: String(item.createdAt) // or item.createdAt.toString()
    }));

    const printBarcode = async () => {
        try {
            setLoading(true);
            const response = await axios.post('/api/printBarcode1', dataWithCreatedAtAsString, { responseType: 'blob' });

            // Create URL for PDF blob
            const url = window.URL.createObjectURL(new Blob([response.data]));
            // Create anchor element to trigger download
            const a = document.createElement('a');
            a.href = url;
            a.download = 'barcodes(TRANSPORTS).pdf';
            document.body.appendChild(a);
            a.click();
            a.remove();
        } catch (error) {
            console.error('Error generating barcodes:', error);
            toast.error('Error generating barcodes.');
        } finally {
            setLoading(false);
        }
    }

    return (
        <>
            {
                !isMounted ?
                    <Skeleton className="h-[900px] w-full" />
                    :
                    <div className={`flex flex-col gap-4 ${theme === 'dark' ? ' bg-[#172030]' : 'bg-[#F4F4F4]'} p-4 rounded-lg`}>
                        <div className="flex justify-between item-center md:grid md:grid-cols-12">
                            <div className="md:col-span-7 text-xl font-semibold flex items-center">
                                Inventory Cargo
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
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Button disabled={loading} onClick={printBarcode} size={"icon"} className={`${theme === 'dark' ? 'bg-[#3fab71] hover:bg-[#3fab71]/80' : 'bg-[#030d71] hover:bg-[#030d71]/80'}`}>
                                                {loading ? (
                                                    <div className={`h-6 w-6 rounded-full border-2 border-solid ${theme === 'dark' ? 'border-black' : 'border-white'} border-e-transparent animate-spin`} />
                                                ) :
                                                    <Printer className="h-6 w-6" />
                                                }
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p className="font-bold">Print the barcodes</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            </div>
                        </div>
                        <DataTable columns={columns} data={data} globalFilter={globalFilter} setGlobalFilter={setGlobalFilter} columnVisibility={columnVisibility} setColumnVisibility={setColumnVisibility} table={table} />
                    </div>
            }
        </>
    )
}

export default Lower;