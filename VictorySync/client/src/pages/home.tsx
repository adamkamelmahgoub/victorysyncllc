import Layout from './_Layout'
import Hero from '../components/Hero'
import ServicesBand from '../components/ServicesBand'
import FeatureRows from '../components/FeatureRows'
import Testimonial from '../components/Testimonial'

export default function Home() {
  return (
    <Layout>
      <Hero />
      <ServicesBand />
      <FeatureRows />
      <Testimonial />
    </Layout>
  )
}