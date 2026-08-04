import Navbar from '@/components/Navbar';
import TechStackPage from '@/components/TechStackPage';

export const metadata = {
  title: 'Tech Stack | ASWIN_S',
  description: 'Tech Stack and Infrastructure - ASWIN_S',
};

export default function TechStackRoute() {
  return (
    <>
      <Navbar />
      <TechStackPage />
    </>
  );
}