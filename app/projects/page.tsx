import Navbar from '@/components/Navbar';
import ProjectsPage from '@/components/ProjectsPage';

export const metadata = {
  title: 'Projects | ASWIN_S',
  description: 'Featured Projects - ASWIN_S',
};

export default function ProjectsRoute() {
  return (
    <>
      <Navbar />
      <ProjectsPage />
    </>
  );
}