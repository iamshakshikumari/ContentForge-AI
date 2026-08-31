import AiTools from "@/components/AiTools";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import Navbar from "@/components/Navbar";
// import PremiumPlan from "@/components/PremiumPlan";
import Testimonial from "@/components/Testimonial";

const Home = () => {
    return (
        <>
            <Hero />
            <AiTools />
            <Testimonial />
            {/* <PremiumPlan /> */}
            <Footer />
        </>
    )
}

export default Home ;