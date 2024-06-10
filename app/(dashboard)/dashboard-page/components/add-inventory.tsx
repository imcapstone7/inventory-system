"use client";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { SquarePlus } from "lucide-react";

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useTheme } from "next-themes";

const formSchema = z.object({
    inventoryName: z.string().min(1, "Inventory name is required"),
    description: z.string().min(1, "Description is required"),
    category: z.string().min(1, "Category is required"),
    contents: z.string().min(1, "Contents are required"),
    quantity: z.string().min(1, "Quantity is required"),
    location: z.string().min(1, "Location is required"),
    status: z.enum(["Available", "Low Stock", "Out of Stock"], {
        required_error: "Status is required"
    })
});

const AddInventory = () => {

    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const { theme } = useTheme();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            inventoryName: "",
            description: "",
            category: "",
            contents: "",
            quantity: "",
            location: "",
            status: undefined
        },
    });

    const handleOnOpenChange = (open: boolean) => {
        if (!open) {
            setOpen(false);
        }
    }

    const onOpen = () => {
        setOpen(true);
    }

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        setLoading(true);
        try {
            const response = await axios.post('/api/addInventory', {
                values
            });

            if (response.data.status === 200) {
                toast.success('Inventory added.');
                form.reset();
            }
        } catch (error) {
            console.log(error);
            toast.error('Sonething went wrong.');
        } finally {
            setLoading(false);
            setOpen(false);
        }
    }

    return (
        <Sheet open={open} onOpenChange={handleOnOpenChange}>
            <SheetTrigger onClick={onOpen} asChild>
                <Button className="text-xs"><SquarePlus className="h-4 w-4 mr-1" />Add Inventory</Button>
            </SheetTrigger>
            <SheetContent>
                <SheetHeader>
                    <SheetTitle>Add Inventory</SheetTitle>
                    <SheetDescription>
                        Adding inventory enables you to seamlessly manage new items or stock, ensuring accurate records and smooth operations.
                    </SheetDescription>
                    <ScrollArea className=" h-[480px] w-full">
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4 pl-1 pr-4">
                                <FormField
                                    control={form.control}
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
                                    control={form.control}
                                    name="description"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Description</FormLabel>
                                            <FormControl>
                                                <Textarea placeholder="Enter Description" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
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
                                    control={form.control}
                                    name="contents"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Contents</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Ex: Laptop,Mouse,Hard drive and etc." {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="quantity"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Quantity</FormLabel>
                                            <FormControl>
                                                <Input type="number" placeholder="Enter Quantity" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
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
                                    control={form.control}
                                    name="status"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Status</FormLabel>
                                            <FormControl>
                                                <Select value={field.value} defaultValue={field.value} onValueChange={field.onChange}>
                                                    <SelectTrigger>
                                                        <SelectValue defaultValue={field.value} placeholder="Select a status"/>
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
                                <Button disabled={loading} type="submit">
                                    {loading ? (
                                        <div className={`h-6 w-6 rounded-full border-2 border-solid ${theme === 'dark'? 'border-black' : 'border-white'} border-e-transparent animate-spin`} />
                                    ) : (
                                        'Submit'
                                    )}
                                </Button>
                            </form>
                        </Form>
                    </ScrollArea>
                </SheetHeader>
            </SheetContent>
        </Sheet>
    )
}

export default AddInventory;