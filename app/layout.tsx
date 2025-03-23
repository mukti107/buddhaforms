import './globals.css';
import { Lexend } from 'next/font/google';
import { UserProvider } from '@auth0/nextjs-auth0/client';

const lexend = Lexend({ 
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700']
});

export const metadata = {
  title: 'ParrotForms - Simple Form Management',
  description: 'Create, manage, and collect form submissions easily with ParrotForms',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={lexend.className}>
      <body className={lexend.className} suppressHydrationWarning={true}>
        <UserProvider>
          {children}
        </UserProvider>
      </body>
    </html>
  );
}
