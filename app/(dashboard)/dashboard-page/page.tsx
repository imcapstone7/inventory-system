import Lower from "./components/lower";
import Upper from "./components/upper";

const Dashboard = () => {

    return (
        <div className="h-full">
            <div className="mx-8 my-4 space-y-4">
                <Upper />
                <Lower />
            </div>
        </div>
    )
}

export default Dashboard;