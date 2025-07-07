import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: 'OKU.KG - Китеп дүкөнү',
  description: 'Кыргызстандын электрондук китепканасы',
  
}

export default function RootLayout({ children }) {
  return (
    <html lang="ky">
      <body className={inter.className}>
          <Header/>
        <main className="min-h-screen bg-white">
          {children}
        </main>
        
      </body>
    </html>
  )
}
