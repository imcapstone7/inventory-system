"use client"

import { ColumnDef } from "@tanstack/react-table"
import Image from "next/image"
import { format } from 'date-fns';

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
      <div className="w-[80px] h-auto hover:scale-150 cursor-pointer transition">
        <Image src={row.original.barcodeImageUrl} width={100} height={100} alt="Barcode" quality={100} />
      </div>
    ),
  },
  {
    accessorKey: "category",
    header: "Category",
  },
  {
    accessorKey: "inventoryName",
    header: "Inventory Name",
  },
  {
    accessorKey: "contents",
    header: "Contents",
  },
  {
    accessorKey: "quantity",
    header: "Quantity",
  },
  {
    accessorKey: "location",
    header: "Location",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <div className={`${row.original.status === 'Available' ? ' text-green-500' : `${row.original.status === "Low Stock" ? 'text-yellow-500' : 'text-red-500'}`} font-semibold`}>
        {row.original.status}
      </div>
    ),
  },
  // {
  //   accessorKey: "createdAt",
  //   header: "CreatedAt",
  //   cell: ({ row }) => (
  //     <div>
  //       {format(row.original.createdAt,"MMMM dd',' yyyy h:mm a")}
  //     </div>
  //   ),
  // },
]
