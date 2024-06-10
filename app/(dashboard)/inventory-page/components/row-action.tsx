"use client"

import { Button } from "@/components/ui/button";
import { Row } from "@tanstack/react-table";
import { Minus, MoreHorizontal, Plus } from "lucide-react";
import { Inventory } from "./columns";
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import toast from "react-hot-toast";
import { useState } from "react";
import axios from "axios";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useTheme } from "next-themes";

interface RowActionProps {
    row: Row<Inventory>
}

const formSchema = z.object({
    quantity: z.number(),
});

const formSchema1 = z.object({
    inventoryName: z.string().min(1, "Inventory name is required"),
    description: z.string().min(1, "Description is required"),
    category: z.string().min(1, "Category is required"),
    contents: z.string().min(1, "Contents are required"),
    location: z.string().min(1, "Location is required"),
    status: z.string().min(1, "Status is required")
});

const RowAction: React.FC<RowActionProps> = ({
    row
}) => {

    const { theme } = useTheme();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            quantity: Number(row.original.quantity),
        },
    });

    const form1 = useForm<z.infer<typeof formSchema1>>({
        resolver: zodResolver(formSchema1),
        defaultValues: {
            inventoryName: row.original.inventoryName,
            description: row.original.description,
            category: row.original.category,
            contents: row.original.contents,
            location: row.original.location,
            status: row.original.status
        },
    });

    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [open1, setOpen1] = useState(false);
    const [open2, setOpen2] = useState(false);

    const addValue = (value: number) => {
        form.setValue("quantity", value + 1);
    }

    const minusValue = (value: number) => {
        form.setValue("quantity", value - 1);
    }

    const onOpen = () => {
        setOpen(true);
    }

    const handleOnOpenChange = (isOpen: boolean) => {
        if (!isOpen) {
            setOpen(false);
        }
    }

    const onOpen1 = () => {
        setOpen1(true);
    }

    const handleOnOpenChange1 = (isOpen: boolean) => {
        if (!isOpen) {
            setOpen1(false);
        }
    }

    const onOpen2 = () => {
        setOpen2(true);
    }

    const handleOnOpenChange2 = (isOpen: boolean) => {
        if (!isOpen) {
            setOpen2(false);
        }
    }

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        setLoading(true);
        try {
            const id = row.original.id;
            const response = await axios.post('/api/editQuantity', {
                values,
                id
            });

            if (response.data.status === 200) {
                toast.success("Quantity changed.");
            }
        } catch (error) {
            console.log(error);
            toast.error('Someting went wrong.');
        } finally {
            setLoading(false);
            setOpen(false);
        }
    }

    const onSubmit1 = async (values: z.infer<typeof formSchema1>) => {
        setLoading(true);
        try {
            const id = row.original.id;
            const response = await axios.post('/api/editInventory', {
                values,
                id
            });

            if (response.data.status === 200) {
                toast.success("Data changed.");
            }
        } catch (error) {
            console.log(error);
            toast.error('Someting went wrong.');
        } finally {
            setLoading(false);
            setOpen1(false);
        }
    }

    const onDelete = async (id: string) => {
        setLoading(true);
        try {
            const response = await axios.post('/api/deleteInventory', {
                id
            });

            if (response.data.status === 200) {
                toast.success("Data has been deleted.");
            }
        } catch (error) {
            console.log(error);
            toast.error('Someting went wrong.');
        } finally {
            setLoading(false);
            setOpen2(false);
        }
    }

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                    <span className="sr-only">Open menu</span>
                    <MoreHorizontal className="h-4 w-4" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-fit flex flex-col gap-1">
                <div className="text-sm font-bold">
                    Action
                </div>
                <Separator />
                <Dialog open={open} onOpenChange={handleOnOpenChange}>
                    <DialogTrigger onClick={onOpen} asChild>
                        <Button variant={"ghost"} size={"sm"} className="text-xs font-bold text-[#fb4c0a] cursor-pointer">
                            Edit Quantity
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="w-fit">
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                                <FormField
                                    control={form.control}
                                    name="quantity"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Quantity</FormLabel>
                                            <FormControl>
                                                <div className="flex items-center gap-3">
                                                    <Button onClick={() => minusValue(field.value)} className="rounded-full" size={"sm"} variant={"outline"} type="button">
                                                        <Minus className="h-4 w-4" />
                                                    </Button>
                                                    <Input disabled className="w-14 text-center" {...field} />
                                                    <Button onClick={() => addValue(field.value)} className="rounded-full" size={"sm"} variant={"outline"} type="button">
                                                        <Plus className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <Button disabled={loading} className="w-full" type="submit">
                                    {
                                        loading ? (
                                            <div className={`h-6 w-6 rounded-full border-2 border-solid ${theme === 'dark'? 'border-black' : 'border-white'} border-e-transparent animate-spin`} />
                                        ) :
                                            'Save'
                                    }
                                </Button>
                            </form>
                        </Form>
                    </DialogContent>
                </Dialog>
                <Separator />
                <Dialog open={open1} onOpenChange={handleOnOpenChange1}>
                    <DialogTrigger onClick={onOpen1} asChild>
                        <Button variant={"ghost"} size={"sm"} className="text-xs cursor-pointer">
                            Edit
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="w-fit">
                        <DialogTitle>Update Inventory</DialogTitle>
                        <DialogDescription>
                            This action cannot be undone. This will permanently change your data from the server.
                        </DialogDescription>
                        <Form {...form1}>
                            <form onSubmit={form1.handleSubmit(onSubmit1)} className="space-y-8">
                                <div className="flex gap-2">
                                    <div>
                                        <FormField
                                            control={form1.control}
                                            name="inventoryName"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Inventory Name</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="Enter Inventory Name" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form1.control}
                                            name="description"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Description</FormLabel>
                                                    <FormControl>
                                                        <Textarea className="h-[185px]" placeholder="Enter Description" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                    <div>
                                        <FormField
                                            control={form1.control}
                                            name="category"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Category</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="Enter Category" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form1.control}
                                            name="contents"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Contents</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="Enter Contents" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form1.control}
                                            name="location"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Location</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="Enter Location" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form1.control}
                                            name="status"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Status</FormLabel>
                                                    <FormControl>
                                                        <Select value={field.value} defaultValue={field.value} onValueChange={field.onChange}>
                                                            <SelectTrigger>
                                                                <SelectValue defaultValue={field.value} placeholder="Select a status" />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItem value="Available">Available</SelectItem>
                                                                <SelectItem value="Low Stock">Low Stock</SelectItem>
                                                                <SelectItem value="Out of Stock">Out of Stock</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                </div>
                                <Button disabled={loading} className="w-full" type="submit">
                                    {
                                        loading ? (
                                            <div className={`h-6 w-6 rounded-full border-2 border-solid ${theme === 'dark'? 'border-black' : 'border-white'} border-e-transparent animate-spin`} />
                                        ) :
                                            'Save'
                                    }
                                </Button>
                            </form>
                        </Form>
                    </DialogContent>
                </Dialog>
                <Separator />
                <AlertDialog open={open2} onOpenChange={handleOnOpenChange2}>
                    <AlertDialogTrigger onClick={onOpen2} asChild>
                        <Button variant={"ghost"} size={"sm"} className="text-xs text-red-500 cursor-pointer">
                            Delete
                        </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete your data from the server.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <Button onClick={() => onDelete(row.original.id)} variant={"destructive"} className={`cursor-pointer ${theme === 'dark'? 'border-black' : 'border-white'}`}>
                                Delete
                            </Button>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </PopoverContent>
        </Popover>
    )
}

export default RowAction;