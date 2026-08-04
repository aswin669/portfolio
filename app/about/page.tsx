import Navbar from '@/components/Navbar';
import About from '@/components/About';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'About Me | ASWIN_S',
  description: 'About ASWIN S - MERN Stack Developer',
};

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <About />
      <Footer />
    </>
  );
}