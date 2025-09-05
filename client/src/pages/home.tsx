
import HeroPro from "../components/HeroPro";
import FeatureShowcase from "../components/FeatureShowcase";
import PlatformTabs from "../components/PlatformTabs";
import TestimonialsSlider from "../components/TestimonialsSlider";
import PricingPro from "../components/PricingPro";
import FooterPro from "../components/FooterPro";
import Navigation from "../components/navigation";

export default function HomePage(){
  return (
    <div className="min-h-screen">
      <Navigation />
      <main>
        <HeroPro />
        <FeatureShowcase />
        <PlatformTabs />
        <TestimonialsSlider />
        <PricingPro />
      </main>
      <FooterPro />
    </div>
  );
}
