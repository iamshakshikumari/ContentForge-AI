import CreationItem from "@/components/CreationItem";
import { authState } from "@/state/authState";
import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { IoSparklesSharp } from "react-icons/io5";
import { useRecoilValue } from "recoil";
import { useLocation } from "react-router-dom";

axios.defaults.baseURL = import.meta.env.VITE_BAS_URL;

const Dashboard = () => {
    const [creations, setCreations] = useState([]);
    const [loading, setLoading] = useState(true);
    const { userId } = useRecoilValue(authState);
    const location = useLocation();


    const getCreationData = async () => {
        try {
            const { data } = await axios.post(
                "/api/user/get-user-creations",
                { userId },
                { withCredentials: true }
            );
            if (data.success) {
                setCreations(data.creations);
                // console.log(data.creations)
            }
            else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || error.message || "Something went wrong");
        }
        setLoading(false);
    };

    useEffect(() => {
        if(!userId){
            setLoading(false) ;
            return ;
        }
        getCreationData();
    }, [userId, location.pathname]);

    return (
        <div className="mt-20 border-2 overflow-y-scroll flex-1 bg-[#393838ff] text-gray-600 ">
            <div className="flex flex-row items-center gap-20 w-fit h-auto p-4 m-10 rounded-xl text-white border border-gray-500 bg-gradient-to-r from-[#42275a] to-[#734b6d] ">
                <div className="flex flex-col">
                    <h1 className="font-bold text-xl">Total Creations</h1>
                    <p className="font-semibold text-xl">{creations.length}</p>
                </div>
                <div>
                    <IoSparklesSharp className="rounded-lg h-12 w-12 p-2 text-yellow-300" />
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center items-center h-2/4">
                    <div className="animate-spin rounded-full h-11 w-11 border-3 border-gray-400 border-t-transparent"></div>
                </div>
            ): (
                    <div className = "space-y-3  border-white text-white m-12">
                <p className = "mt-6 mb-4 font-bold text-xl">Recent Creations</p>
                { creations.map((item) => <CreationItem key={item.id} item={item} onDelete={getCreationData}/>) }
            </div >
            )}
            
        </div >
    )
}

export default Dashboard;
