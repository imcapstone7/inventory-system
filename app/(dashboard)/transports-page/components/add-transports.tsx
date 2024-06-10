"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CalendarIcon, SquarePlus, Truck } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import Inventory from "../../inventory-page/page";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useTheme } from "next-themes";

interface AddTransportsProps {
    data: Inventory[]
}

const formSchema = z.object({
    receiver: z.string().min(1, "Receiver name is required"),
    purpose: z.string().min(1, "Purpose is required"),
    item: z.string().min(1, "Item is required"),
    returnDate: z.preprocess((arg) => {
        if (typeof arg === "string" || arg instanceof Date) {
            return new Date(arg);
        }
    }, z.date({ required_error: "Return date is required", invalid_type_error: "Invalid date" })),
    returnTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time format")
});
const AddTransports: React.FC<AddTransportsProps> = ({
    data
}) => {

    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const { theme } = useTheme();

    const currentDate = new Date();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            receiver: "",
            purpose: "",
            item: undefined,
            returnDate: undefined,
            returnTime: undefined
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
            const response = await axios.post('/api/addTransports', {
                values
            });

            if (response.data.status === 200) {
                toast.success('Transports added.');
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
                <Button className="text-xs bg-[#fb4c0a]"><Truck className="h-4 w-4 mr-1" />Add Transports</Button>
            </SheetTrigger>
            <SheetContent>
                <SheetHeader>
                    <SheetTitle>Add Transports</SheetTitle>
                    <SheetDescription>
                        Keep accurate records and ensure smooth operations by regularly updating your transport assets.
                    </SheetDescription>
                    <ScrollArea className=" h-[480px] w-full">
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4 pl-1 pr-4">
                                <FormField
                                    control={form.control}
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
                                    control={form.control}
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
                                    control={form.control}
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
                                        control={form.control}
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
                                        control={form.control}
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

export default AddTransports;