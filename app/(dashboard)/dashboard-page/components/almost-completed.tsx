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
import { Transport } from "../../transports-page/components/column";

interface AlmostCompletedProps {
    allData: Transport[]
}

const AlmostCompleted: React.FC<AlmostCompletedProps> = ({
    allData
}) => {

    const latestTransports = allData.slice().sort((a, b) => b.createdAt - a.createdAt).slice(0, 5);

    return (
        <Carousel className="w-7/12 max-w-xs">
            <CarouselContent>
                {latestTransports.map((transport, index) => (
                    <CarouselItem key={index}>
                        <div className="p-1">
                            <Card>
                                <CardContent className="flex flex-col gap-1 aspect-square p-4">
                                    <div className="relative aspect-square h-32 md:h-[70px] border border-1 w-full">
                                        <Image className="object-cover object-center" width={210} height={210} src={transport.barcodeImageUrl} alt="" />
                                    </div>
                                    <div className="text-lg font-extrabold">
                                        {transport.item}
                                    </div>
                                    <div className="text-xs font-semibold text-gray-500">
                                        {transport.receiver}
                                    </div>
                                    <div className={`text-xs font-semibold ${transport.status === 'Borrowed' ? 'text-yellow-500' : 'text-green-500'}`}>
                                        {transport.status}
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