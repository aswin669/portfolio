import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import FeaturedProjects from '@/components/FeaturedProjects';
import Philosophy from '@/components/Philosophy';
import AnimatedShowcase from '@/components/AnimatedShowcase';
import TechStack from '@/components/TechStack';
import Services from '@/components/Services';
import Testimonial from '@/components/Testimonial';
import CTASection from '@/components/CTASection';
import Footer from '@/components/Footer';
import FloatingContactButton from '@/components/FloatingContactButton';
import ASWINIntro from '@/components/ASWINIntro';

export default function Home() {
  return (
    <main className="pt-16">
      <ASWINIntro />
      <Navbar />
      <Hero />
      <FeaturedProjects />
      <Philosophy />
      <AnimatedShowcase />
      <TechStack />
      <Services />
      <Testimonial />
      <CTASection />
      <Footer />
      <FloatingContactButton />
    </main>
  );
}