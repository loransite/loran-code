// app/page.tsx
import Hero from "@/components/Hero";
import HowItWorks from "@/components/sections/HowItWorks";
import FeaturedDesigners from "@/components/sections/FeaturedDesigners";
import Testimonials from "@/components/sections/Testimonials";
import Footer from "@/components/Layouts/Footer";

export default function HomePage() {
  return (
    <>
      <Hero />
      <HowItWorks />
      <FeaturedDesigners />
      <Testimonials />
      <Footer/>

    </>
  );
}