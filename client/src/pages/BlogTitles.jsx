import { authState } from "@/state/authState";
import axios from "axios";
import { Hash } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { IoSparklesSharp } from "react-icons/io5";
import Markdown from "react-markdown";
import { useRecoilValue } from "recoil";

const blogCategory = ["General", "Technology", "Business", "Health", "Lifestyle", "Education", "Travel", "Food"];

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const BlogTitles = () => {
    const [selectedCategory, setselectedCategory] = useState(blogCategory[0]);
    const [input, setInput] = useState("");

    const [loading, setLoading] = useState(false);
    const [content, setContent] = useState('');

    const { userId } = useRecoilValue(authState);

    const submitHandler = async (e) => {
        e.preventDefault();

        try {
            setLoading(true);

            const prompt = `Generate blog titles for the keyword ${input} in the category ${selectedCategory}`;

            const {data} = await axios.post("/api/ai/generate-blog-title", {
                prompt,
                userId
            }, { withCredentials: true }
            )

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
            <form onSubmit={submitHandler} className=" mt-10 ml-10 w-full max-w-lg p-4 text-black rounded-lg bg-gradient-to-r from-[#050505] via-[#222831] to-[#6f4a8e] border border-gray-500 max-h-[600px] min-h-96">
                <div className="flex text-white items-center gap-3">
                    <IoSparklesSharp className="h-12 w-12 p-2 text-yellow-300" />
                    <h1 className="font-semibold text-xl">AI Title Generator</h1>
                </div>

                <p className="font-semibold text-white mt-6">Keyword</p>
                <input type="text" onChange={(e) => setInput(e.target.value)} value={input} placeholder="Type your blog title here…" className="text-white w-full py-2 px-3 mt-2 text-sm outline-none rounded-md border border-gray-100" required />

                <p className="font-semibold text-white mt-6">Category</p>
                <div className="flex flex-wrap gap-4 mt-2 text-white text-sm w-full max-wd-lg">
                    {blogCategory.map((item, index) => {
                        return (
                            <span onClick={() => setselectedCategory(item)} key={index} className={`border rounded-full font-semibold py-1 px-4 cursor-pointer ${selectedCategory === item ? 'bg-gradient-to-r from-[#29323c]  to-[#485563] text-white border' : 'text-white bg-transparent border-gray-100'}`}>{item}</span>
                        )
                    })}
                </div>

                <button disabled={loading} className="border-1 flex items-center justify-center gap-3 mt-6 w-full text-white py-2 px-3 bg-gradient-to-r from-[#29323c]  to-[#485563] rounded-lg cursor-pointer font-medium border border-gray-300">
                    {loading ? <span className="w-5 h-5 border-2 border-t-transparent rounded-full animate-spin"></span>
                        : <Hash className="w-5" />
                    }
                    Generate title
                </button>
            </form>

            {/* right col */}
            <div className="h-[385px] overflow-y-scroll mt-10 ml-10 w-full max-w-lg p-4 text-black rounded-lg bg-white border border-gray-400 p-10">
                <div className="flex items-center gap-3">
                    <Hash className="h-10 w-10 p-2 text-[#7C4585]" />
                    <h1 className="font-semibold text-xl text-gray-700">Generated Title</h1>
                </div>

                {!content ? (
                    <div className="flex-1 flex justify-center items-center">
                        <div className="mt-15 text-md flex flex-col items-center gap-5 text-gray-400">
                            <Hash className="h-14 w-14 p-2 text-gray-400" />
                            <p className="font-medium">Enter a topic and click “Generated title” to get started</p>
                        </div>
                    </div>)
                    : (
                        <div className="mt-3 text-sm h-full text-slate-600">
                            <div className='reset-tw font-medium '>
                                <Markdown>{content}</Markdown>
                            </div>
                        </div>
                    )
                }



            </div>
        </div>
    )
}

export default BlogTitles;