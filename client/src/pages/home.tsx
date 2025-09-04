import Hero from "../components/Hero";
import OutcomeCards from "../components/OutcomeCards";
import SolutionsGrid from "../components/SolutionsGrid";
import PlatformStrip from "../components/PlatformStrip";
import IntegrationStrip from "../components/IntegrationStrip";
import RoiCta from "../components/RoiCta";
import ResourceList from "../components/ResourceList";

export default function Home() {
  return (
    <>
      <Hero />
      <OutcomeCards />
      <SolutionsGrid />
      <PlatformStrip />
      <IntegrationStrip />
      <RoiCta />
      <ResourceList limit={6} />
    </>
  );
}