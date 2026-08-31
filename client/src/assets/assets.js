import mylogo from "./ContentForgeLogo.png";
import profile_img_1 from "./profile_img_1.jpg";
import profile_img_2 from "./profile_img_2.jpg";
import profile_img_3 from "./profile_img_3.jpg";
import arrow_icon from "./arrow_icon.svg";
import { SquarePen, Hash, Image, Eraser, Scissors, FileText } from 'lucide-react'

export const assets = {
    mylogo,
    profile_img_1,
    profile_img_2,
    profile_img_3,
    arrow_icon,
};

export const AiToolsData = [
    {
        title: 'AI Article Writer',
        description: 'Generate high-quality, engaging articles on any topic with our AI writing technology.',
        Icon: SquarePen,
        bg: { from: '#3588F2', to: '#0BB0D7' },
        path: '/ai/write-article'
    },
    {
        title: 'Blog Title Generator',
        description: 'Find the perfect, catchy title for your blog posts with our AI-powered generator.',
        Icon: Hash,
        bg: { from: '#B153EA', to: '#E549A3' },
        path: '/ai/blog-titles'
    },
    {
        title: 'AI Image Generation',
        description: 'Create stunning visuals with our AI image generation tool, Experience the power of AI ',
        Icon: Image,
        bg: { from: '#20C363', to: '#11B97E' },
        path: '/ai/generate-images'
    },
    {
        title: 'Background Removal',
        description: 'Effortlessly remove backgrounds from your images with our AI-driven tool.',
        Icon: Eraser,
        bg: { from: '#F76C1C', to: '#F04A3C' },
        path: '/ai/remove-background'
    },
    {
        title: 'Object Removal',
        description: 'Remove unwanted objects from your images seamlessly with our AI object removal tool.',
        Icon: Scissors,
        bg: { from: '#5C6AF1', to: '#427DF5' },
        path: '/ai/remove-object'
    },
    {
        title: 'Resume Reviewer',
        description: 'Get your resume reviewed by AI to improve your chances of landing your dream job.',
        Icon: FileText,
        bg: { from: '#12B7AC', to: '#08B6CE' },
        path: '/ai/review-resume'
    }
]

export const dummyTestimonialData = [
    {
        image: assets.profile_img_1,
        name: 'Dennis Evans',
        title: 'Content Strategist, BrightWave Media',
        content:
            '"ContentForge-AI helps our team turn ideas into polished articles within minutes. It’s intuitive, reliable, and the content quality always exceeds expectations."',
        rating: 5,
    },
    {
        image: assets.profile_img_2,
        name: 'Emily Carter',
        title: 'Marketing Lead, Growthify',
        content:
            '"We’ve streamlined our entire content pipeline using ContentForge-AI. From blogs to ad copies, it delivers engaging text that fits perfectly with our campaigns."',
        rating: 5,
    },
    {
        image: assets.profile_img_3,
        name: 'Chris Jones',
        title: 'Freelance Copywriter',
        content:
            '"This tool has become my daily writing companion. ContentForge-AI makes drafting faster, more creative, and surprisingly personal — I can’t imagine working without it."',
        rating: 4,
    },
];
