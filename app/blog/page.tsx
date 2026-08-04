import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import BlogList from './BlogList';

export const metadata = {
  title: 'Blog | ASWIN S',
  description: 'Articles and insights on web development, MERN stack, and software engineering.',
};

export default function BlogPage() {
  return (
    <>
      <Navbar />
      <BlogList />
      <Footer />
    </>
  );
}
