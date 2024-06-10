"use client";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Skeleton } from "@/components/ui/skeleton";
import useMount from "@/hook/use-mount";
import { MoreHorizontal, ChevronsUpDown } from "lucide-react";

const Lower = () => {

    const { isMounted } = useMount();

    return (
        <>
            {
                !isMounted ?
                    <div className="flex justify-center items-center w-full h-[68vh]">
                        <div className="flex flex-row gap-4 w-4/5">
                            <Skeleton className="h-[300px] w-full" />
                            <Skeleton className="h-[300px] w-full" />
                        </div>
                    </div>
                    :
                    <div className="flex justify-center items-center w-full h-[68vh]">
                        <div className="flex flex-row gap-4 w-4/5">
                            <Accordion type="single" collapsible className="w-full">
                                <AccordionItem value="item-1">
                                    <AccordionTrigger>How do I add a new item to the inventory?</AccordionTrigger>
                                    <AccordionContent>
                                        Go to the <span className="italic text-[#fb4c0a]">&quot;Dashboard&quot;</span> or <span className="italic text-[#fb4c0a]">&quot;Inventory&quot; </span>
                                        and find the button <span className="italic text-[#fb4c0a]">&quot;Add Inventory&quot;</span> to add a new item to the Inventory.
                                    </AccordionContent>
                                </AccordionItem>
                                <AccordionItem value="item-2">
                                    <AccordionTrigger>How can I update the quantity of an existing item?</AccordionTrigger>
                                    <AccordionContent className="relative">
                                        <p>Go to the <span className="italic text-[#fb4c0a]">"Inventory"</span>, and find &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; in the table and click it to edit the quantity of an item.</p>
                                        <span className="absolute top-1 right-[284px] italic text-[#fb4c0a] flex flex-row"><MoreHorizontal className="h-4 w-4" /></span>
                                    </AccordionContent>
                                </AccordionItem>
                                <AccordionItem value="item-3">
                                    <AccordionTrigger>What should I do if I need to delete an item from the inventory?</AccordionTrigger>
                                    <AccordionContent className="relative">
                                        <p>Go to the <span className="italic text-[#fb4c0a]">&quot;Inventory&quot;</span>, and find &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; and click <span className="italic text-[#fb4c0a] mr-1">&quot;Delete&quot;</span> to remove an item in the inventory.</p>
                                        <span className="absolute top-1 right-[284px] italic text-[#fb4c0a] flex flex-row"><MoreHorizontal className="h-4 w-4" /></span>
                                    </AccordionContent>
                                </AccordionItem>
                                <AccordionItem value="item-4">
                                    <AccordionTrigger>How can I categorize items in the inventory?</AccordionTrigger>
                                    <AccordionContent className="relative">
                                        <p>Go to the <span className="italic text-[#fb4c0a]">&quot;Inventory&quot;</span>, and find &nbsp;&nbsp;&nbsp;&nbsp; and click it to categorize the table in the inventory.</p>
                                        <span className="absolute top-0 right-[284px] italic text-[#fb4c0a] flex flex-row"><ChevronsUpDown className="h-5 w-5" /></span>
                                    </AccordionContent>
                                </AccordionItem>
                            </Accordion>
                            <Accordion type="single" collapsible className="w-full">
                                <AccordionItem value="item-1">
                                    <AccordionTrigger>What are the different statuses an inventory item can have?</AccordionTrigger>
                                    <AccordionContent className="flex flex-col gap-1">
                                        <p><span className="font-semibold text-[#fb4c0a]">Available:</span> Indicates that an item is currently in stock and ready for use or purchase.</p>
                                        <p><span className="font-semibold text-[#fb4c0a]">Borrowed:</span> Indicates that an item has been borrowed or loaned out to someone and is not currently available for use by others.</p>
                                        <p><span className="font-semibold text-[#fb4c0a]">Returned:</span> Indicates that a borrowed item has been returned and is now available for others to use or purchase again.</p>
                                    </AccordionContent>
                                </AccordionItem>
                                <AccordionItem value="item-2">
                                    <AccordionTrigger>How do I track borrowed and returned items?</AccordionTrigger>
                                    <AccordionContent>
                                        Go to the <span className="italic text-[#fb4c0a]">"Dashboard"</span> and find the pie-graph.
                                    </AccordionContent>
                                </AccordionItem>
                                <AccordionItem value="item-3">
                                    <AccordionTrigger>How do I change the theme of the inventory system?</AccordionTrigger>
                                    <AccordionContent>
                                        Go to the upper-right corner of the page and click your name, and click the <span className="italic text-[#fb4c0a]">"Settings"</span> to change your theme preferences.
                                    </AccordionContent>
                                </AccordionItem>
                                <AccordionItem value="item-4">
                                    <AccordionTrigger>How do I generate a report of all inventory items?</AccordionTrigger>
                                    <AccordionContent>
                                        Go to the <span className="italic text-[#fb4c0a]">&quot;Inventory&quot; </span>
                                        and find the button <span className="italic text-[#fb4c0a]">&quot;Generate Report&quot;</span> to generate an inventory report.
                                    </AccordionContent>
                                </AccordionItem>
                            </Accordion>
                        </div>
                    </div>
            }
        </>
    )
}

export default Lower;