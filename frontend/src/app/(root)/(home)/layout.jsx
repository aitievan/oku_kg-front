import Navbar from "@/components/Navbar";
import Chatbot from "@/components/Chatbot";
import Footer from '@/components/Footer';

export default function HomeLayout({ children }) {
  return (
    <div>
      <Navbar />
      <main className="min-h-screen bg-white">{children}</main>
      <Chatbot />
      <Footer/>
    </div>
  );
}
