import Header from './Header';
import Footer from './Footer';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50 relative h-screen">
      <Header />
      <div className="">
        {children}
      </div>
      <Footer />
    </div>
  );
}