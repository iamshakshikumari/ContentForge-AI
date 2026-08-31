import { useRouteError } from "react-router-dom"

export const ErrorPage = () =>{
    const error = useRouteError() ;
    return <>
        <h3>{error.data}</h3>
    </>
}