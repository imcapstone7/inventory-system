import { Separator } from "@/components/ui/separator";
import Lower from "./components/lower";
import Upper from "./components/upper";
import { getSession } from "@/lib/action";

const Settings = async () => {

    const session = await getSession();

    return (
            <div className="h-[82%] flex flex-col gap-4 lg:gap-8 p-4 xl:p-8">
                <Upper />
                <Separator />
                <Lower session={session} />
            </div>
    )
}

export default Settings;
