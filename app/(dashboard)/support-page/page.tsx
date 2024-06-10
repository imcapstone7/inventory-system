import { getSession } from "@/lib/action";
import Upper from "./components/upper";
import Lower from "./components/lower";

const Support = async () => {

    const session = await getSession();

    return (
        <div className="h-full">
            <div className="mx-8 my-4 space-y-4">
                <Upper />
                <Lower />
            </div>
        </div>
    )
}

export default Support;
