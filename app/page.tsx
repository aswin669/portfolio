import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import FeaturedProjects from '@/components/FeaturedProjects';
import Philosophy from '@/components/Philosophy';
import TechStack from '@/components/TechStack';
import Services from '@/components/Services';
import Testimonial from '@/components/Testimonial';
import CTASection from '@/components/CTASection';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <main className="pt-16">
      <Navbar />
      <Hero />
      <FeaturedProjects />
      <Philosophy />
      <TechStack />
      <Services />
      <Testimonial />
      <CTASection />
      <Footer />
    </main>
  );
}