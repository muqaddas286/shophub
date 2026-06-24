'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Search,
  ShoppingCart,
  Heart,
  User,
  Menu,
  X,
  ChevronDown,
  Moon,
  Sun,
  LogOut,
  Package,
  MapPin,
  Settings,
  Shield,
} from 'lucide-react';
import { useTheme } from 'next-themes';
import { supabase } from '@/lib/db/supabase';
import { useStore } from '@/lib/store/useStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const cartCountVal = useStore((s) => s.cartCount());

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user || null);
      if (data.session?.user) {
        supabase
          .from('profiles')
          .select('*')
          .eq('id', data.session.user.id)
          .single()
          .then(({ data }) => setProfile(data));
      }
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
      if (session?.user) {
        supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single()
          .then(({ data }) => setProfile(data));
      } else {
        setProfile(null);
      }
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/shop/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  const categories = [
    { name: 'Electronics', slug: 'electronics' },
    { name: 'Fashion', slug: 'fashion' },
    { name: 'Home & Living', slug: 'home-living' },
    { name: 'Sports', slug: 'sports' },
    { name: 'Books', slug: 'books' },
    { name: 'Beauty', slug: 'beauty' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      {/* Top Bar */}
      <div className="bg-primary text-primary-foreground py-1.5 text-center text-xs">
        <span className="font-medium">Free shipping on orders over $50</span>
        <span className="mx-2">|</span>
        <span>New arrivals now available</span>
      </div>

      {/* Main Navbar */}
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">S</span>
            </div>
            <span className="text-xl font-bold hidden sm:block">ShopHub</span>
          </Link>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-xl relative">
            <Input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pr-10 h-10"
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <Search className="w-4 h-4" />
            </button>
          </form>

          {/* Right Actions */}
          <div className="flex items-center gap-1 sm:gap-2">
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2 rounded-lg hover:bg-accent transition-colors hidden sm:flex"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            <Link
              href="/shop/wishlist"
              className="p-2 rounded-lg hover:bg-accent transition-colors relative"
            >
              <Heart className="w-5 h-5" />
            </Link>

            <Link
              href="/shop/cart"
              className="p-2 rounded-lg hover:bg-accent transition-colors relative"
            >
              <ShoppingCart className="w-5 h-5" />
              {cartCountVal > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-blue-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {cartCountVal}
                </span>
              )}
            </Link>

            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-1.5 p-1.5 rounded-lg hover:bg-accent transition-colors">
                    <div className="w-7 h-7 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-xs font-medium">
                      {profile?.full_name?.charAt(0) || user.email?.charAt(0) || 'U'}
                    </div>
                    <ChevronDown className="w-3.5 h-3.5 hidden sm:block" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="px-2 py-1.5 text-sm font-medium">
                    {profile?.full_name || user.email}
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard/profile" className="cursor-pointer flex items-center gap-2">
                      <User className="w-4 h-4" /> Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard/orders" className="cursor-pointer flex items-center gap-2">
                      <Package className="w-4 h-4" /> Orders
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard/addresses" className="cursor-pointer flex items-center gap-2">
                      <MapPin className="w-4 h-4" /> Addresses
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard/wishlist" className="cursor-pointer flex items-center gap-2">
                      <Heart className="w-4 h-4" /> Wishlist
                    </Link>
                  </DropdownMenuItem>
                  {profile?.role === 'admin' && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link href="/admin/dashboard" className="cursor-pointer flex items-center gap-2">
                          <Shield className="w-4 h-4" /> Admin
                        </Link>
                      </DropdownMenuItem>
                    </>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="cursor-pointer flex items-center gap-2 text-red-600">
                    <LogOut className="w-4 h-4" /> Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button asChild size="sm" className="hidden sm:flex">
                <Link href="/auth/login">Sign In</Link>
              </Button>
            )}

            <button
              className="sm:hidden p-2 rounded-lg hover:bg-accent"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Category Nav */}
        <nav className="hidden md:flex items-center gap-1 mt-2 -mx-1">
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/shop/category/${cat.slug}`}
              className="px-3 py-1.5 text-sm font-medium rounded-md hover:bg-accent transition-colors"
            >
              {cat.name}
            </Link>
          ))}
        </nav>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="sm:hidden border-t overflow-hidden"
          >
            <div className="container mx-auto px-4 py-4 space-y-4">
              <form onSubmit={handleSearch} className="relative">
                <Input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pr-10"
                />
                <button
                  type="submit"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                >
                  <Search className="w-4 h-4" />
                </button>
              </form>
              <div className="space-y-1">
                {categories.map((cat) => (
                  <Link
                    key={cat.slug}
                    href={`/shop/category/${cat.slug}`}
                    className="block px-3 py-2 rounded-md hover:bg-accent text-sm font-medium"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {cat.name}
                  </Link>
                ))}
              </div>
              {!user && (
                <div className="flex gap-2 pt-2 border-t">
                  <Button asChild className="flex-1">
                    <Link href="/auth/login">Sign In</Link>
                  </Button>
                  <Button asChild variant="outline" className="flex-1">
                    <Link href="/auth/register">Sign Up</Link>
                  </Button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
