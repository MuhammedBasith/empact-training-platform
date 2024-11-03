export const metadata = {
    title: "Home - Empact",
    description: "Page description",
  };
  
  import Hero from "./LandingPage/hero-home";
  import BusinessCategories from "./LandingPage/business-categories";
  import FeaturesPlanet from "./LandingPage/features-planet";
  import LargeTestimonial from "./LandingPage/large-testimonial";
  import Cta from "./LandingPage/cta";
  
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
  