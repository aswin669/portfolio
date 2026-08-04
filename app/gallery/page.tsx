import Navbar from '@/components/Navbar';
import GalleryPage from '@/components/GalleryPage';

export const metadata = {
  title: 'Gallery | ASWIN S',
  description: 'Media gallery showcasing projects and visual work.',
};

export default function GalleryRoute() {
  return (
    <>
      <Navbar />
      <GalleryPage />
    </>
  );
}
