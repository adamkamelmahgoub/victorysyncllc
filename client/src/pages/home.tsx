
import Hero from "../components/sections/Hero";
import OutcomesGrid from "../components/sections/OutcomesGrid";
import PlatformStrip from "../components/sections/PlatformStrip";
import LogoProof from "../components/sections/LogoProof";
import Testimonial from "../components/sections/Testimonial";
import CTABand from "../components/sections/CTABand";

export default function Home() {
  return (
    <>
      <Hero />
      <OutcomesGrid />
      <PlatformStrip />
      <LogoProof />
      <Testimonial />
      <CTABand />
    </>
  );
}
