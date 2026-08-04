import Navbar from '@/components/Navbar';
import ContactPage from '@/components/ContactPage';

export const metadata = {
  title: 'Contact | ASWIN_S',
  description: 'Contact - ASWIN_S',
};

export default function ContactRoute() {
  return (
    <>
      <Navbar />
      <ContactPage />
    </>
  );
}