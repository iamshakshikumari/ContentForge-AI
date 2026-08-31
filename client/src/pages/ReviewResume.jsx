import { FileText } from "lucide-react";
import { useState } from "react";
import { IoSparklesSharp } from "react-icons/io5";
import axios from "axios";
import { useRecoilValue } from "recoil";
import { authState } from "@/state/authState";
import toast from "react-hot-toast";
import Markdown from "react-markdown";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const ReviewResume = () => {
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [content, setContent] = useState('');
    const { userId } = useRecoilValue(authState);

    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);

            const formData = new FormData();
            formData.append("resume", input);
            formData.append("userId", userId);

            const { data } = await axios.post("/api/ai/resume-review", formData, { withCredentials: true });

            if (data.success) {
                setContent(data.content);
            } else {
                toast.error(data.error || "Something went wrong");
            }

            setLoading(false);

        } catch (error) {
            toast.error(error.response?.data?.message || error.message || "Something went wrong");
        }
        setLoading(false) ;
    }

    return (
        <div className="mt-20 border-2 flex items-start flex-wrap gap-4 overflow-y-scroll flex-1 bg-[#393838ff]">
            {/* left col */}
            <form onSubmit={submitHandler} className=" mt-10 ml-10 w-full max-w-lg p-4 text-black rounded-lg bg-gradient-to-br from-[#331d2c] via-[#3f2e3e] to-[#a78295] border border-gray-500 max-h-[600px]">
                <div className="flex text-white items-center gap-3">
                    <IoSparklesSharp className="h-12 w-12 p-2 text-yellow-300" />
                    <h1 className="font-semibold text-xl">Resume Review</h1>
                </div>

                <p className="font-semibold text-white mt-6">Upload Resume</p>
                <input type="file" accept="application/pdf" onChange={(e) => setInput(e.target.files[0])} placeholder="Type your blog title here…" className="text-white w-full py-2 px-3 mt-2 text-sm outline-none rounded-md border border-gray-100" required />
                <p className="text-white text-xs mt-2">Supports PDF resume only.</p>


                <button className="border-1 flex items-center justify-center gap-3 mt-6 w-full text-white py-2 px-3 bg-gradient-to-r from-[#29323c]  to-[#485563] rounded-lg cursor-pointer font-medium border border-gray-300">
                    {
                        loading ? <span className="w-5 h-5 rounded-full border-2 border-t-transparent animate-spin"></span>
                            : <FileText className="w-5" />
                    }
                    Review resume
                </button>
            </form>

            {/* right col */}
            <div className="min-h-[450px] max-h-[580px] overflow-y-scroll mt-10 ml-10 w-full max-w-lg p-4 text-black rounded-lg bg-white border border-gray-400 p-10">
                <div className="flex items-center gap-3">
                    <FileText className="h-10 w-10 p-2 text-blue-400" />
                    <h1 className="font-semibold text-xl text-gray-700">Analysis Results</h1>
                </div>

                <div className="flex-1 flex justify-center items-center">
                    {!content ? (
                        <div className="mt-30 text-md flex flex-col items-center gap-5 text-gray-400">
                            <FileText className="h-12 w-12 p-2 text-gray-400" />
                            <p className="font-semibold">Upload a resume and click "Review Resume" to get started</p>
                        </div>
                    ) : (
                        <div className="mt-3 w-full text-sm h-full text-slate-600">
                            <div className='reset-tw font-medium '>
                                <Markdown>{content}</Markdown>
                            </div>
                        </div>
                    )}
                </div>
            </div>

        </div>
    )
}

export default ReviewResume;