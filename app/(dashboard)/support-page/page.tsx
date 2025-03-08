import Upper from "./components/upper";
import Lower from "./components/lower";

const Support = async () => {

    return (
            <div className="h-[82%] flex flex-col gap-4 lg:gap-8 p-4 xl:p-8">
                <Upper />
                <Lower />
            </div>
    )
}

export default Support;
