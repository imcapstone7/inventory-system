import { Separator } from "@/components/ui/separator";
import Lower from "./components/lower";
import Upper from "./components/upper";
import { getSession } from "@/lib/action";

const Settings = async () => {

    const session = await getSession();

    return (
        <div className="h-full">
            <div className="mx-8 my-4 space-y-4">
                <Upper />
                <Separator />
                <Lower session={session} />
            </div>
        </div>
    )
}

export default Settings;
