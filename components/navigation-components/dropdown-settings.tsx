import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { ChevronDown, CircleHelp, LogOut, Settings, SquareUserRound } from "lucide-react";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";
import { ModeToggle } from "../theme-toggle";
import { Skeleton } from "../ui/skeleton";
import { useSession } from "@/app/session-context";

interface DropdownSettingsProps {
    isMounted: boolean
}

const DropdownSettings: React.FC<DropdownSettingsProps> = ({
    isMounted
}) => {

    const session = useSession();

    const emailParts = session.email?.split('@');
    const email = emailParts ? emailParts[0] : 'Unknown';

    const router = useRouter();

    const signOut = async () => {
        try {
            const response = await axios.post('/api/signOut');
            if (response.data.status === 200) {
                router.push("/auth-page");
            }

        } catch (error) {
            console.log(error);
            toast.error('Something went wrong.');
        }
    }

    return (
        <div className="hidden lg:flex gap-2">
            {!isMounted ?
                <div className="flex gap-2">
                    <Skeleton className="h-10 w-[190px]" />
                    <Skeleton className="h-10 w-[40px]" />
                </div>
                :
                <>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button className="text-xs font-semibold" variant={"outline"}>
                                <Avatar className="h-8 w-8 mr-1">
                                    <AvatarImage src="https://github.com/shadcn.png" />
                                    <AvatarFallback>CN</AvatarFallback>
                                </Avatar>
                                {email}
                                <ChevronDown className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuItem className="font-medium"><SquareUserRound className="h-4 w-4 mr-2" />Account</DropdownMenuItem>
                            <DropdownMenuItem className="font-medium"><Settings className="h-4 w-4 mr-2" />Settings</DropdownMenuItem>
                            <DropdownMenuItem className="font-medium"><CircleHelp className="h-4 w-4 mr-2" />Suppport and Help</DropdownMenuItem>
                            <DropdownMenuItem onClick={signOut} className="font-medium">
                                <Button className="w-full">
                                    <LogOut className="h-4 w-4 mr-2" />Sign out
                                </Button>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <ModeToggle />
                </>
            }
        </div>
    )
}

export default DropdownSettings;