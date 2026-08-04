import Navbar from '@/components/Navbar';
import ResumePage from '@/components/ResumePage';

export const metadata = {
  title: 'Resume & Career | ASWIN_S',
  description: 'Resume and Career - ASWIN_S',
};

export default function ResumeRoute() {
  return (
    <>
      <Navbar />
      <ResumePage />
    </>
  );
}