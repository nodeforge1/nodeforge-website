import Hero from '../components/sections/Hero';
import Features from '../components/sections/Features';
import Benefits from '../components/sections/Benefits';
import EcosystemPartners from '../components/sections/EcosystemPartners';
import Stats from '../components/sections/Stats';
// import Testimonials from '../components/sections/Testimonials';

export default function Home() {
  return (
    <main className="bg-gray-50">
      <Hero />
      <Features />
      <Benefits />
      <EcosystemPartners />
      <Stats />
      {/* <Testimonials /> */}
    </main>
  );
}