import { Eraser } from "lucide-react";
import { useState } from "react";
import { IoSparklesSharp } from "react-icons/io5";
import axios from "axios";
import { useRecoilValue } from "recoil";
import { authState } from "@/state/authState";
import toast from "react-hot-toast";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const RemoveBackground = () => {
    const [input, setInput] = useState("");

    const [loading, setLoading] = useState(false);
    const [content, setContent] = useState('');

    const { userId } = useRecoilValue(authState);

    const submitHandler = async (e) => {
        e.preventDefault();

        try {
            setLoading(true);

            const formData = new FormData;
            formData.append("image", input);
            formData.append("userId", userId);

            const { data } = await axios.post("/api/ai/remove-image-background", formData, { withCredentials: true });

            if (data.success) {
                setContent(data.content);
            }
            else {
                toast.error(data.message);
            }

        } catch (error) {
            toast.error(error.response?.data?.message || error.message || "Something went wrong");
        }
        setLoading(false);
    }

    return (
        <div className="mt-20 border-2 flex items-start flex-wrap gap-4 overflow-y-scroll flex-1 bg-[#393838ff]">
            {/* left col */}
            <form onSubmit={submitHandler} className=" mt-10 ml-10 w-full max-w-lg p-4 text-black rounded-lg bg-gradient-to-tl from-[#e96443] via-[#424750ff] to-[#904e95] border border-gray-500 max-h-[600px]">
                <div className="flex text-white items-center gap-3">
                    <IoSparklesSharp className="h-12 w-12 p-2 text-yellow-300" />
                    <h1 className="font-semibold text-xl">Background Removal</h1>
                </div>

                <p className="font-semibold text-white mt-6">Upload image</p>
                <input type="file" accept="image/*" onChange={(e) => setInput(e.target.files[0])} placeholder="Type your blog title here…" className="text-white w-full py-2 px-3 mt-2 text-sm outline-none rounded-md border border-gray-100" required />
                <p className="text-white text-xs mt-2">Supports JPG, PNG, and other image formats</p>

                <button disabled={loading} className="border-1 flex items-center justify-center gap-3 mt-6 w-full text-white py-2 px-3 bg-gradient-to-r from-[#29323c]  to-[#485563] rounded-lg cursor-pointer font-medium border border-gray-300">
                    {loading ? <span className="w-5 h-5 border-2 border-t-transparent rounded-full animate-spin"></span>
                        : <Eraser className="w-5" />
                    }
                    Remove Background
                </button>
            </form>

            {/* right col */}
            <div className="min-h-[450px] max-h-[580px] overflow-y-scroll mt-10 ml-10 w-full max-w-lg p-4 text-black rounded-lg bg-white border border-gray-400 p-10">
                <div className="flex items-center gap-3">
                    <Eraser className="h-10 w-10 p-2 text-[#7C4585]" />
                    <h1 className="font-semibold text-xl text-gray-700">Processed Image</h1>
                </div>

                {!content ? (
                    <div className="flex-1 flex justify-center items-center">
                        <div className="mt-15 text-md flex flex-col items-center gap-5 text-gray-400">
                            <Eraser className="h-14 w-14 p-2 text-gray-400" />
                            <p className="font-medium">Upload an image and click "Remove Background" to get started</p>
                        </div>
                    </div>
                ) : (
                    <div className="mt-3 h-full">
                        <img src={content} alt="image" className="w-full h-auto max-w-full object-contain rounded-lg" />
                    </div>
                )}
            </div>
        </div>
    )
}

export default RemoveBackground;