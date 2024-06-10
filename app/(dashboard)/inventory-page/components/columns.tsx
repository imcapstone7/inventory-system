"use client"

import { ColumnDef } from "@tanstack/react-table"
import Image from "next/image"
import { format } from 'date-fns';
import { ArrowUpDown } from "lucide-react"
import { Button } from "@/components/ui/button";
import RowAction from "./row-action";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";


// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Inventory = {
  id: string
  barcodeImageUrl: string
  category: string
  contents: string
  createdAt: number
  description: string
  inventoryName: string
  location: string
  quantity: string
  baseQuantity: string
  status: string
}

export const columns: ColumnDef<Inventory>[] = [
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
    accessorKey: "category",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Category
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  {
    accessorKey: "inventoryName",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  {
    accessorKey: "contents",
    header: "Contents",
  },
  {
    accessorKey: "quantity",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Quantity
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  {
    accessorKey: "location",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Location
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
      <div className={`${row.original.status === 'Available' ? ' text-green-500' : `${row.original.status === "Low Stock" ? 'text-yellow-500' : 'text-red-500'}`} font-semibold`}>
        {row.original.status}
      </div>
    ),
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
