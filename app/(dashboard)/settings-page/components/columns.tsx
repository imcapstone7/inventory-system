"use client"

import { ColumnDef } from "@tanstack/react-table"
import { format } from 'date-fns';
import { ArrowUpDown } from "lucide-react"
import { Button } from "@/components/ui/button";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Logs = {
    id: string;
    userId: string;
    action: string;
    createdAt: number;
}

export const columns: ColumnDef<Logs>[] = [
    {
        accessorKey: "id",
        header: "ID",
    },
    {
        accessorKey: "userId",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    User ID
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
    },
    {
        accessorKey: "action",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Action
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
    },
    {
        accessorKey: "createdAt",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Created At
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => (
            <div className="text-xs">
                {format(row.original.createdAt, "MM/dd/yyyy h:mm a")}
            </div>
        ),
    }
]
