'use client';

import Link from 'next/link';
import { Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-muted/50 border-t">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">S</span>
              </div>
              <span className="text-xl font-bold">ShopHub</span>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Your one-stop destination for premium products. Quality, convenience, and style delivered to your door.
            </p>
            <div className="flex gap-3">
              <a href="#" className="w-8 h-8 rounded-full bg-accent flex items-center justify-center hover:bg-blue-600 hover:text-white transition-colors">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-accent flex items-center justify-center hover:bg-blue-600 hover:text-white transition-colors">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-accent flex items-center justify-center hover:bg-blue-600 hover:text-white transition-colors">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-accent flex items-center justify-center hover:bg-blue-600 hover:text-white transition-colors">
                <Youtube className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2.5 text-sm">
              <li><Link href="/shop" className="text-muted-foreground hover:text-foreground transition-colors">Shop All</Link></li>
              <li><Link href="/shop/category/electronics" className="text-muted-foreground hover:text-foreground transition-colors">Electronics</Link></li>
              <li><Link href="/shop/category/fashion" className="text-muted-foreground hover:text-foreground transition-colors">Fashion</Link></li>
              <li><Link href="/shop/category/home-living" className="text-muted-foreground hover:text-foreground transition-colors">Home & Living</Link></li>
              <li><Link href="/shop/category/sports" className="text-muted-foreground hover:text-foreground transition-colors">Sports</Link></li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="font-semibold mb-4">Customer Service</h3>
            <ul className="space-y-2.5 text-sm">
              <li><Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">Contact Us</Link></li>
              <li><Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">Shipping Info</Link></li>
              <li><Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">Returns & Exchanges</Link></li>
              <li><Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">FAQ</Link></li>
              <li><Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">Privacy Policy</Link></li>
              <li><Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">Terms & Conditions</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="w-4 h-4 shrink-0" />
                Pakistan
              </li>
              <li className="flex items-center gap-2 text-muted-foreground">
                <Phone className="w-4 h-4 shrink-0" />
                03709008913
              </li>
              <li className="flex items-center gap-2 text-muted-foreground">
                <Mail className="w-4 h-4 shrink-0" />
                muqaddaswaheed@gmail.com
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <p>2026 ShopHub. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="#" className="hover:text-foreground transition-colors">Privacy</Link>
            <Link href="#" className="hover:text-foreground transition-colors">Terms</Link>
            <Link href="#" className="hover:text-foreground transition-colors">Sitemap</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
