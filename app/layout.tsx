import './globals.css';
import { Lexend } from 'next/font/google';

const lexend = Lexend({ 
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700']
});

export const metadata = {
  title: 'BuddhaForms - Simple Form Management',
  description: 'Create, manage, and collect form submissions easily with BuddhaForms',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={lexend.className}>
      <body className={lexend.className} suppressHydrationWarning={true}>
        {children}
      </body>
    </html>
  );
}
