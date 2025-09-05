
import HeroPro from "../components/HeroPro";
import FeatureShowcase from "../components/FeatureShowcase";
import PlatformTabs from "../components/PlatformTabs";
import TestimonialsSlider from "../components/TestimonialsSlider";
import PricingPro from "../components/PricingPro";

export default function HomePage(){
  return (
    <>
      <HeroPro />
      <FeatureShowcase />
      <PlatformTabs />
      <TestimonialsSlider />
      <PricingPro />
    </>
  );
}
