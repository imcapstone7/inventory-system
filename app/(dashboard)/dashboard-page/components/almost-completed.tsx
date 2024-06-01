import { Card, CardContent } from "@/components/ui/card"
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel"
import Image from "next/image";

import laptop from "@/public/assets/images/laptop.png";
import { Slider } from "@/components/ui/slider";

const AlmostCompleted = () => {
    return (
        <Carousel className="w-7/12 max-w-xs">
            <CarouselContent>
                {Array.from({ length: 5 }).map((_, index) => (
                    <CarouselItem key={index}>
                        <div className="p-1">
                            <Card>
                                <CardContent className="flex flex-col gap-1 aspect-square p-4">
                                    <div className="text-md font-bold">
                                        Electronics
                                    </div>
                                    <div className="relative aspect-square h-32 md:h-28 border border-1 w-full">
                                        <Image className="object-cover object-center" src={laptop} alt="" />
                                    </div>
                                    <div className="text-lg font-extrabold">
                                        TRK12345052
                                    </div>
                                    <div className="text-xs font-semibold text-gray-500">
                                        Warehouse A
                                    </div>
                                    <div className="flex justify-between gap-2 mb-2">
                                        <Slider disabled className="mt-1 w-10/12" value={[65]} max={100} step={1} />
                                        <div className="text-xs font-semibold">
                                            70%
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </CarouselItem>
                ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
        </Carousel>
    )
}

export default AlmostCompleted;