import { Outlet, useNavigate } from "react-router-dom";
import MenuBar from "@/components/MenuBar";


const Layout = () =>{
    const navigate = useNavigate() ;

    return (
        <div className="flex overflow-visible">
            <MenuBar />
            <Outlet />
        </div>
    )
}

export default Layout ;