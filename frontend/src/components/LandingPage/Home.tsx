export const metadata = {
    title: "Home - Empact",
    description: "Page description",
  };
  
  import Hero from "./hero-home";
  import BusinessCategories from "./business-categories";
  import FeaturesPlanet from "./features-planet";
  import LargeTestimonial from "./large-testimonial";
  import Cta from "./cta";
  
  export default function Home() {
    return (
      <>
        <Hero />
        <BusinessCategories />
        <FeaturesPlanet />
        <LargeTestimonial />
        <Cta />
      </>
    );
  }
  