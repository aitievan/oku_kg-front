'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Facebook, Instagram, Twitter } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="flex items-center mb-2">
              <Link href="/" className="inline-block mr-3">
                <Image 
                  src="/logo.svg" 
                  alt="Китеп дүкөнү" 
                  width={120} 
                  height={30} 
                  className="h-8 w-auto"
                />
              </Link>
              <p className="text-xs hidden md:block">
                Кыргызстандагы китеп дүкөнү
              </p>
            </div>
          </div>
          
          <div>
            <h3 className="text-white font-medium text-base mb-2">Контакты</h3>
            <ul className="space-y-1 text-sm">
              <li className="flex items-center gap-1">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <a href="tel:+996221148272">+996 (221) 14-82-72</a>
              </li>
              <li className="flex items-center gap-1">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span>@oku.kg</span>
              </li>
            </ul>
            
            <div className="flex gap-3 mt-3">
              <a href="https://facebook.com" target='_blank' className="hover:text-white transition-colors">
                <Facebook size={16} />
              </a>
              <a href="https://www.instagram.com/oku.kg/" target='_blank' className="hover:text-white transition-colors">
                <Instagram size={16} />
              </a>
              <a href="https://twitter.com" target='_blank' className="hover:text-white transition-colors">
                <Twitter size={16} />
              </a>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-4 pt-3">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-xs">© {currentYear} Китеп дүкөнү</p>
            
          </div>
        </div>
      </div>
    </footer>
  );
}