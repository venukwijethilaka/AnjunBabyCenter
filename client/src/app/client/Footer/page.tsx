'use client';

import { useRouter } from 'next/navigation';
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin, Heart } from 'lucide-react';

export default function Footer() {
  const router = useRouter();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div>
            <h3 className="text-2xl font-extrabold text-white mb-4 flex items-center gap-2">
              <span className="text-pink-500">Anjun</span>
            </h3>
            <p className="text-gray-400 mb-4">
              Your trusted destination for quality baby products. Making parenting easier, one product at a time.
            </p>
            <div className="flex gap-3">
              <a 
                href="https://facebook.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gray-800 hover:bg-pink-500 rounded-full flex items-center justify-center transition-colors"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gray-800 hover:bg-pink-500 rounded-full flex items-center justify-center transition-colors"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a 
                href="https://twitter.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gray-800 hover:bg-pink-500 rounded-full flex items-center justify-center transition-colors"
              >
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-bold text-white mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <button 
                  onClick={() => router.push('/client/products')}
                  className="hover:text-pink-500 transition-colors"
                >
                  Shop All Products
                </button>
              </li>
              <li>
                <button 
                  onClick={() => router.push('/client/products?filter=featured')}
                  className="hover:text-pink-500 transition-colors"
                >
                  Featured Products
                </button>
              </li>
              <li>
                <button 
                  onClick={() => router.push('/client/products?filter=flash-sale')}
                  className="hover:text-pink-500 transition-colors"
                >
                  Flash Sale
                </button>
              </li>
              <li>
                <button 
                  onClick={() => router.push('/client/my-orders')}
                  className="hover:text-pink-500 transition-colors"
                >
                  My Orders
                </button>
              </li>
              <li>
                <button 
                  onClick={() => router.push('/client/wishlist')}
                  className="hover:text-pink-500 transition-colors"
                >
                  Wishlist
                </button>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="text-lg font-bold text-white mb-4">Customer Service</h4>
            <ul className="space-y-2">
              <li>
                <button className="hover:text-pink-500 transition-colors">
                  About Us
                </button>
              </li>
              <li>
                <button className="hover:text-pink-500 transition-colors">
                  Contact Us
                </button>
              </li>
              <li>
                <button className="hover:text-pink-500 transition-colors">
                  Shipping & Delivery
                </button>
              </li>
              <li>
                <button className="hover:text-pink-500 transition-colors">
                  Returns & Refunds
                </button>
              </li>
              <li>
                <button className="hover:text-pink-500 transition-colors">
                  Terms & Conditions
                </button>
              </li>
              <li>
                <button className="hover:text-pink-500 transition-colors">
                  Privacy Policy
                </button>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-bold text-white mb-4">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-pink-500 flex-shrink-0 mt-1" />
                <span className="text-sm">
                  123 Baby Street, Kids Town<br />
                  Colombo, Sri Lanka
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-pink-500 flex-shrink-0" />
                <a href="tel:+94123456789" className="text-sm hover:text-pink-500 transition-colors">
                  +94 123 456 789
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-pink-500 flex-shrink-0" />
                <a href="mailto:hello@anjun.com" className="text-sm hover:text-pink-500 transition-colors">
                  hello@anjun.com
                </a>
              </li>
            </ul>

            <div className="mt-6">
              <h5 className="text-sm font-semibold text-white mb-2">Business Hours</h5>
              <p className="text-sm text-gray-400">
                Mon - Fri: 9:00 AM - 6:00 PM<br />
                Sat: 10:00 AM - 4:00 PM<br />
                Sun: Closed
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-400 text-center md:text-left">
              © {currentYear} Anjun. All rights reserved. Made with <Heart className="w-4 h-4 inline text-pink-500 fill-pink-500" /> for parents
            </p>
            
            <div className="flex flex-wrap justify-center gap-6 text-sm">
              <button className="hover:text-pink-500 transition-colors">
                Privacy Policy
              </button>
              <button className="hover:text-pink-500 transition-colors">
                Terms of Service
              </button>
              <button className="hover:text-pink-500 transition-colors">
                Cookie Policy
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Methods */}
      <div className="bg-gray-950 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-xs text-gray-500">Secure Payment Methods</p>
            <div className="flex items-center gap-4 flex-wrap justify-center">
              <div className="px-3 py-1 bg-white rounded text-xs font-bold text-gray-800">VISA</div>
              <div className="px-3 py-1 bg-white rounded text-xs font-bold text-gray-800">MASTERCARD</div>
              <div className="px-3 py-1 bg-white rounded text-xs font-bold text-pink-600">CASH ON DELIVERY</div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
