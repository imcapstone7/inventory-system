import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { useTheme } from "next-themes";
import { DataTable } from "./data-table";
import { useState } from "react";
import { Inventory, columns } from "./columns";
import { SortingState, VisibilityState, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useReactTable } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { SlidersVertical } from "lucide-react";
import useMount from "@/hook/use-mount";
import { Skeleton } from "@/components/ui/skeleton";

interface LowerProps{
    data: Inventory[]
}

const Lower: React.FC<LowerProps> = ({
    data
}) => {

    const { isMounted } = useMount();

    const { theme } = useTheme();
    const [globalFilter, setGlobalFilter] = useState('');
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
    const [sorting, setSorting] = useState<SortingState>([])

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
                            </div>
                        </div>
                        <DataTable columns={columns} data={data} globalFilter={globalFilter} setGlobalFilter={setGlobalFilter} columnVisibility={columnVisibility} setColumnVisibility={setColumnVisibility} table={table} />
                    </div>
            }
        </>
    )
}

export default Lower;