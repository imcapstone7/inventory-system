import { UseFormReturn } from "react-hook-form"
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { searchSchema } from "../page";
import { z } from "zod"
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SearchingProps {
    form: UseFormReturn<{
        search: string;
    }, any, undefined>
    onSearch: (values: z.infer<typeof searchSchema>) => Promise<void>
    loadingSearch: boolean
}

const Searching: React.FC<SearchingProps> = ({
    form,
    onSearch,
    loadingSearch
}) => {

    return (
        <Form {...form}>
            <form className="flex gap-2" onSubmit={form.handleSubmit(onSearch)}>
                <FormField
                    control={form.control}
                    name="search"
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <Input className="w-[350px] md:w-[400px] h-10" placeholder="Put the ID of Inventory or Transports data here" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit" size={"default"} className="text-xs bg-[#fb4c0a]">
                    {
                        loadingSearch ?
                            (
                                <div className="h-6 w-6 rounded-full border-2 border-solid border-white border-e-transparent animate-spin" />
                            ) : (
                                <Search className="h-4 w-4 mr-1" />
                            )}
                </Button>
            </form>
        </Form>
    )
}

export default Searching;