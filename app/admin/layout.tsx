import Providers from '../providers';

export const metadata = {
  title: 'Admin | ASWIN S',
  description: 'Portfolio Administration - ASWIN S',
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <Providers>{children}</Providers>;
}
