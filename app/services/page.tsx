import Navbar from '@/components/Navbar';
import ServicesPage from '@/components/ServicesPage';

export const metadata = {
  title: 'Services — ASWIN_S',
  description: 'Services and Capabilities - ASWIN_S',
};

export default function ServicesRoute() {
  return (
    <>
      <Navbar />
      <ServicesPage />
    </>
  );
}