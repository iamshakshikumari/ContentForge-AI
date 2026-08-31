import { authState } from "@/state/authState";
import { Navigate } from "react-router-dom";
import { useRecoilValue } from "recoil";

export default function ProtectedRoute({children}){
    const {isLoggedIn, loading} = useRecoilValue(authState) ;

    if(loading) return <p>loading...</p> ;

    if(!isLoggedIn)
    {
        return <Navigate to="/login" replace/>
    }

    return children ;
}