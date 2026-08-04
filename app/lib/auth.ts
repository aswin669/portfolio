import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { createLog } from '@/lib/logs';
import { getSetting } from '@/lib/db';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const storedPassword = await getSetting('admin_password');
        const adminEmail = await getSetting('admin_email');
        const inputEmail = credentials?.email?.trim().toLowerCase() || '';
        const targetEmail = (adminEmail || process.env.ADMIN_EMAIL || 'Aswinsreedharan669@gmail.com').trim().toLowerCase();
        const inputPassword = credentials?.password?.trim() || '';
        const targetPassword = (storedPassword || process.env.ADMIN_PASSWORD || 'admin123').trim();

        const validEmail = inputEmail === targetEmail;
        const validPassword = inputPassword === targetPassword;

        if (validEmail && validPassword) {
          return { id: '1', name: 'Admin', email: targetEmail };
        }
        return null;
      },
    }),
  ],
  pages: {
    signIn: '/admin/login',
  },
  session: {
    strategy: 'jwt',
  },
  events: {
    async signIn({ user }) {
      createLog({ type: 'auth', action: 'login', severity: 'success', message: 'Admin logged in', email: user.email || '', userInfo: user.name || '' }).catch(() => {});
    },
    async signOut({ session }) {
      createLog({ type: 'auth', action: 'logout', severity: 'info', message: 'Admin logged out', email: (session as any)?.user?.email || '' }).catch(() => {});
    },
  },
};
