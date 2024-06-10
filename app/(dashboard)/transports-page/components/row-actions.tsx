"use client"

import { Button } from "@/components/ui/button";
import { Row } from "@tanstack/react-table";
import { CalendarIcon, Minus, MoreHorizontal, Plus } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import axios from "axios";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useTheme } from "next-themes";
import { Transport } from "./column";
import { format, formatISO, parse } from "date-fns";
import { onValue, ref } from "firebase/database";
import { database } from "@/firebase";
import Inventory from "../../inventory-page/page";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

interface RowActionProps {
    row: Row<Transport>
}

const formSchema1 = z.object({
    receiver: z.string().min(1, "Receiver name is required"),
    purpose: z.string().min(1, "Purpose is required"),
    item: z.string().min(1, "Item is required"),
    returnDate: z.preprocess((arg) => {
        if (typeof arg === "string" || arg instanceof Date) {
            return new Date(arg);
        }
    }, z.date({ required_error: "Return date is required", invalid_type_error: "Invalid date" })),
    returnTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time format"),
    status: z.enum(["Borrowed", "Returned"], {
        required_error: "Status is required"
    })
});

const RowAction: React.FC<RowActionProps> = ({
    row
}) => {
    const { theme } = useTheme();
    const currentDate = new Date();

    const [data, setData] = useState<Inventory[]>([]);
    const [loading, setLoading] = useState(false);
    const [open1, setOpen1] = useState(false);
    const [open2, setOpen2] = useState(false);
    const statusChoices = ['Borrowed', 'Returned'];

    useEffect(() => {

        const inventoryRef = ref(database, 'inventory');

        const fetchData = (snapshot: any) => {
            const inventoryData = snapshot.val();
            if (inventoryData) {
                const inventoryArray: Inventory[] = Object.keys(inventoryData).map(key => ({
                    id: key,
                    ...inventoryData[key]
                }));

                const sortedData = inventoryArray.sort((a, b) => b.createdAt - a.createdAt).slice(0, 6);
                setData(sortedData);
            }
        };

        onValue(inventoryRef, fetchData);

        return () => {
            // Unsubscribe from the real-time listener when component unmounts
            onValue(inventoryRef, fetchData);
        };
    }, [open1]);

    function formatDateToISO(dateString: string) {
        // Parse the date string to a Date object
        const parsedDate = parse(dateString, 'MMMM dd, yyyy hh:mm a', new Date());
        // Format the date part to "MMMM dd, yyyy" format
        const formattedDate = format(parsedDate, 'MMMM dd, yyyy');
        // Parse the formatted date string to a Date object
        const parsedFormattedDate = parse(formattedDate, 'MMMM dd, yyyy', new Date());
        // Format the date object to ISO format
        const isoDate = formatISO(parsedFormattedDate);
        return new Date(isoDate);
    }
    // Format the time part to "hh:mm a" format
    function formatTimeToISO(timeString: string) {
        // Parse the date string to a Date object
        const parsedTime = parse(timeString, 'MMMM dd, yyyy hh:mm a', new Date());
        // Format the time part to "hh:mm a" format
        const formattedTime = format(parsedTime, 'hh:mm');
        return formattedTime;
    }

    const form1 = useForm<z.infer<typeof formSchema1>>({
        resolver: zodResolver(formSchema1),
        defaultValues: {
            receiver: row.original.receiver,
            purpose: row.original.purpose,
            item: row.original.item,
            returnDate: formatDateToISO(row.original.returnDate),
            returnTime: formatTimeToISO(row.original.returnDate),
            status: row.original.status as "Borrowed" | "Returned"
        },
    });

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

    const onSubmit1 = async (values: z.infer<typeof formSchema1>) => {
        setLoading(true);
        try {
            const id = row.original.id;
            const response = await axios.post('/api/editTransports', {
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
            const response = await axios.post('/api/deleteTransports', {
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
                            <form onSubmit={form1.handleSubmit(onSubmit1)}>
                                <div className="flex flex-col gap-2">
                                    <FormField
                                        control={form1.control}
                                        name="receiver"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Receiver Name</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Enter Receiver Name" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form1.control}
                                        name="item"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Item</FormLabel>
                                                <FormControl>
                                                    <Select value={field.value} defaultValue={field.value} onValueChange={field.onChange}>
                                                        <SelectTrigger>
                                                            <SelectValue defaultValue={field.value} placeholder="Select a status" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {data.map((item, index) => (
                                                                <SelectItem key={index} value={item.contents}>
                                                                    {item.contents}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form1.control}
                                        name="purpose"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Purpose</FormLabel>
                                                <FormControl>
                                                    <Textarea placeholder="Enter the purpose" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <div className="flex flex-row gap-2 items-end">
                                        <FormField
                                            control={form1.control}
                                            name="returnDate"
                                            render={({ field }) => (
                                                <FormItem className="flex flex-col">
                                                    <FormLabel>Return Date</FormLabel>
                                                    <Popover>
                                                        <PopoverTrigger asChild>
                                                            <Button
                                                                variant={"outline"}
                                                                className={cn(
                                                                    " w-[180px] justify-start text-left font-normal",
                                                                    !field.value && "text-muted-foreground"
                                                                )}
                                                            >
                                                                <CalendarIcon className="mr-2 h-4 w-4" />
                                                                {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                                                            </Button>
                                                        </PopoverTrigger>
                                                        <PopoverContent className="w-auto p-0">
                                                            <Calendar
                                                                mode="single"
                                                                selected={field.value}
                                                                onSelect={field.onChange}
                                                                initialFocus
                                                                fromDate={currentDate}
                                                            />
                                                        </PopoverContent>
                                                    </Popover>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form1.control}
                                            name="returnTime"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormControl>
                                                        <Input type="time" placeholder="HH:MM" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
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
                                                            {statusChoices.map((item, index) => (
                                                                <SelectItem key={index} value={item}>
                                                                    {item}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <Button disabled={loading} className="w-full" type="submit">
                                        {
                                            loading ? (
                                                <div className={`h-6 w-6 rounded-full border-2 border-solid ${theme === 'dark' ? 'border-black' : 'border-white'} border-e-transparent animate-spin`} />
                                            ) :
                                                'Save'
                                        }
                                    </Button>
                                </div>
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
                            <Button onClick={() => onDelete(row.original.id)} variant={"destructive"} className={`cursor-pointer ${theme === 'dark' ? 'border-black' : 'border-white'}`}>
                                Delete
                            </Button>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </PopoverContent>
        </Popover >
    )
}

export default RowAction;