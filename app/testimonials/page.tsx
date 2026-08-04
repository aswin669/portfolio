import Navbar from '@/components/Navbar';
import TestimonialsPage from '@/components/TestimonialsPage';

export const metadata = {
  title: 'Client Testimonials | ASWIN_S',
  description: 'Client Testimonials - ASWIN_S',
};

export default function TestimonialsRoute() {
  return (
    <>
      <Navbar />
      <TestimonialsPage />
    </>
  );
}