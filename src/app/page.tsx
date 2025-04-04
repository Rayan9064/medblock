import { HeroSection } from "./components/hero-section-dark";
import { Education } from "./components/Education";
import { Features } from "./components/Features";
import { UseCases } from "./components/UseCases";
import { TestimonialSection } from "./components/Testimonials";
import { Faq } from "./components/Faq";
import { Footer } from "./components/Footer";

const Index = () => {

  return (
    <div>
      <HeroSection />
      <Education />
      <Features />
      <UseCases />
      <TestimonialSection />
      <Faq />
      <Footer />
    </div>
  );
};

export default Index;
