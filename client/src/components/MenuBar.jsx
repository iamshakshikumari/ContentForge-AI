import React from "react";
import { Eraser, FileText, Hash, House, Image, LogOut, Scissors, SquarePen, Users } from "lucide-react";
import { FaUserCircle } from "react-icons/fa";
import { NavLink, useNavigate } from "react-router-dom";
import axios from "axios";
import { useRecoilValue } from "recoil";
import { authState } from "@/state/authState";

const navItems = [
    { to: "/ai", label: "Dashboard", Icon: House },
    { to: "/ai/write-article", label: "Write Article", Icon: SquarePen },
    { to: "/ai/blog-titles", label: "Blog Titles", Icon: Hash },
    { to: "/ai/generate-images", label: "Generate Images", Icon: Image },
    { to: "/ai/remove-background", label: "Remove Background", Icon: Eraser },
    { to: "/ai/remove-object", label: "Remove Object", Icon: Scissors },
    { to: "/ai/review-resume", label: "Review-Resume", Icon: FileText },
]


const MenuBar = () => {
    const {username} = useRecoilValue(authState) ; 
    return (
        <div className="mt-20 flex flex-col items-center border-gray-700 
                shadow-[3px_0_5px_rgba(255,255,255,0.09)] 
                pt-10 flex-1 max-w-65 min-h-[calc(100vh-5rem)] 
                bg-[#1b1b1bff] relative z-10">

            <div className="flex flex-col items-center justify-center gap-1 w-full">
                <FaUserCircle className="w-12 h-12 rounded-full" />
                <h1 className="font-semibold text-gray-100 w-full text-center">
                    {username}
                </h1>
            </div>
            <div className="pt-4 flex flex-col items-center justify-center w-full">
                {navItems.map((item, index) => (
                    <NavLink
                        key={index}
                        to={item.to}
                        end={item.to === "/ai"}
                        className={({ isActive }) =>
                            `rounded-lg w-[87%] p-3 flex items-center gap-2 h-10 cursor-pointer 
                            ${isActive ? "bg-gradient-to-r from-purple-500 to-purple-900 text-white" : "text-gray-200 "}`
                        }
                    >
                        <item.Icon className="w-4 h-4" />
                        <span className="font-semibold">{item.label}</span>
                    </NavLink>
                ))}
            </div>



        </div>
    )
};

export default MenuBar;
