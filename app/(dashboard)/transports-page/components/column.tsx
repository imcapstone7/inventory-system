"use client"

import { ColumnDef } from "@tanstack/react-table"
import Image from "next/image"
import { ArrowUpDown } from "lucide-react"
import { Button } from "@/components/ui/button";
import RowAction from "./row-actions";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Transport = {
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

export const columns: ColumnDef<Transport>[] = [
    {
        accessorKey: "id",
        header: "ID",
    },
    {
        accessorKey: "barcodeImageUrl",
        header: "Barcode",
        cell: ({ row }) => (
            <Popover>
                <PopoverTrigger asChild>
                    <div className="w-[80px] h-auto hover:scale-150 cursor-pointer transition">
                        <Image src={row.original.barcodeImageUrl} width={100} height={100} alt="Barcode" quality={100} />
                    </div>
                </PopoverTrigger>
                <PopoverContent>
                    <Image src={row.original.barcodeImageUrl} width={350} height={350} alt="Barcode" quality={100} />
                </PopoverContent>
            </Popover>
        ),
    },
    {
        accessorKey: "user",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    User
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
    },
    {
        accessorKey: "item",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Item
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
    },
    {
        accessorKey: "receiver",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Receiver
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
    },
    {
        accessorKey: "purpose",
        header: "Purpose",
    },
    {
        accessorKey: "returnDate",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    returnDate
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
    },
    {
        accessorKey: "status",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Status
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => (
            <div className={`${row.original.status === 'Borrowed' ? ' text-yellow-500' : 'text-green-500'} font-semibold`}>
                {row.original.status}
            </div>
        ),
    },
    {
        id: "actions",
        cell: ({ row }) => {
            return (
                <RowAction row={row} />
            )
        },
    },
]
