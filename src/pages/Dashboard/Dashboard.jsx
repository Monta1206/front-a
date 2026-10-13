import DashboardLayout from "../../layouts/DashboardLayout";
import LiveTableBoard from "../../components/LiveTableBoard/LiveTableBoard";
import KitchenFlow from "../../components/KitchenFlow/KitchenFlow";

function Dashboard(){


    return (

        <DashboardLayout>


            <h1>
                Live Restaurant
            </h1>


            <p>
                Real-time restaurant overview
            </p>



            <LiveTableBoard />
            <KitchenFlow />

        </DashboardLayout>

    );


}


export default Dashboard;