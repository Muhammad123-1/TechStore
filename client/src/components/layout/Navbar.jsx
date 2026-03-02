import { useNavigate, Link, useLocation } from 'react-router-dom';
import { ShoppingCart, User, Menu, X, Search, LogOut, Settings, Heart } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '../../store/authStore';
import { useCartStore } from '../../store/cartStore';
import GlobalSearch from '../search/GlobalSearch';
import StickySearch from '../search/StickySearch';
import CartDrawer from '../cart/CartDrawer';
import LanguageSwitcher from '../common/LanguageSwitcher';
import CurrencySwitcher from '../common/CurrencySwitcher';

export default function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { isAuthenticated, user, logout } = useAuthStore();
    const itemCount = useCartStore(state => state.getItemCount());
    const menuCloseTimer = useRef(null);
    const mobileMenuRef = useRef(null);
    const location = useLocation();

    // Keyboard shortcut for search (Ctrl+K or Cmd+K)
    const handleLogout = async () => {
        await logout();
        navigate('/');
    };

    useEffect(() => {
        const handleKeyDown = (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                setIsSearchOpen(true);
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, []);

    // Close mobile menu when route changes
    useEffect(() => {
        setIsMenuOpen(false);
    }, [location.pathname]);

    // Close mobile menu when clicking outside
    useEffect(() => {
        if (!isMenuOpen) return;

        const handleClickOutside = (e) => {
            if (mobileMenuRef.current && !mobileMenuRef.current.contains(e.target)) {
                setIsMenuOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isMenuOpen]);

    return (
        <nav className="bg-dark-secondary/80 backdrop-blur-lg border-b border-gray-800 sticky top-0 z-50">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-20">
                    {/* Logo */}
                    <Link to="/" className="flex items-center space-x-2">
                        <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                            <span className="text-2xl font-bold">T</span>
                        </div>
                        <span className="text-xl font-bold text-glow">TechStore</span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden lg:flex items-center space-x-8">
                        <Link to="/" className="hover:text-primary transition font-medium">{t('nav.home')}</Link>
                        <Link to="/products" className="hover:text-primary transition font-medium">{t('nav.products')}</Link>
                        <Link to="/about" className="hover:text-primary transition font-medium">{t('nav.about')}</Link>
                    </div>

                    {/* Search Bar - Desktop */}
                    <div className="hidden md:block flex-1 max-w-md mx-8">
                        <StickySearch globalOpen={isSearchOpen} />
                    </div>

                    {/* Right Section */}
                    <div className="flex items-center space-x-2 md:space-x-4">
                        <div className="hidden sm:block">
                            <LanguageSwitcher />
                        </div>
                        <div className="hidden sm:block">
                            <CurrencySwitcher />
                        </div>

                        <button
                            onClick={() => setIsSearchOpen(true)}
                            className="md:hidden p-1.5 hover:text-primary transition relative group"
                        >
                            <Search size={18} />
                        </button>

                        {isAuthenticated && (
                            <Link to="/profile" className="p-1.5 hover:text-primary transition hidden sm:block">
                                <Heart size={18} />
                            </Link>
                        )}

                        <button
                            id="nav-cart-button"
                            onClick={() => setIsCartOpen(true)}
                            className="relative p-1.5 hover:text-primary transition"
                        >
                            <ShoppingCart size={18} />
                            {itemCount > 0 && (
                                <span className="absolute -top-1 -right-1 bg-primary text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
                                    {itemCount}
                                </span>
                            )}
                        </button>

                        {isAuthenticated ? (
                            <div
                                className="relative"
                                onMouseEnter={() => {
                                    clearTimeout(menuCloseTimer.current);
                                    setIsUserMenuOpen(true);
                                }}
                                onMouseLeave={() => {
                                    // auto-hide after 3s with a fade
                                    menuCloseTimer.current = setTimeout(() => setIsUserMenuOpen(false), 3000);
                                }}
                            >
                                <button className="flex items-center space-x-2 p-1.5 hover:text-primary transition" onClick={() => setIsUserMenuOpen(v => !v)}>
                                    <User size={18} />
                                    <span className="hidden md:block">{user?.name}</span>
                                </button>
                                <div className={`absolute right-0 mt-2 w-48 bg-dark-card border border-gray-800 rounded-lg shadow-lg transition-opacity duration-500 ${isUserMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
                                    <Link to="/profile" onClick={() => setIsUserMenuOpen(false)} className="block px-4 py-2 hover:bg-dark-secondary">Profile</Link>
                                    {['admin', 'assistant'].includes(user?.role) && (
                                        <Link to="/admin" onClick={() => setIsUserMenuOpen(false)} className="block px-4 py-2 hover:bg-dark-secondary text-primary">{t('nav.admin', 'Admin Panel')}</Link>
                                    )}
                                    {['admin', 'delivery'].includes(user?.role) && (
                                        <Link to="/delivery" onClick={() => setIsUserMenuOpen(false)} className="block px-4 py-2 hover:bg-dark-secondary text-green-500">{t('nav.delivery', 'Delivery Panel')}</Link>
                                    )}
                                    <button
                                        onClick={async () => { setIsUserMenuOpen(false); await handleLogout(); }}
                                        className="block w-full text-left px-4 py-2 hover:bg-dark-secondary"
                                    >
                                        {t('nav.logout')}
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <Link to="/signin" className="btn-primary px-4 py-2 text-sm">
                                {t('nav.signIn')}
                            </Link>
                        )}

                        <button className="md:hidden p-1.5" onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label="Toggle menu">
                            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {isMenuOpen && (
                    <div className="md:hidden py-4 space-y-2 absolute left-0 right-0 top-full z-40 px-4">
                        <div ref={mobileMenuRef} className="bg-dark-card/90 backdrop-blur-sm rounded-lg p-4">
                            <div className="flex items-center justify-between mb-3 border-b border-gray-800 pb-3">
                                <div className="text-lg font-bold">TechStore</div>
                                <button aria-label="Close menu" className="p-2" onClick={() => setIsMenuOpen(false)}>
                                    <X size={20} />
                                </button>
                            </div>
                            <div className="flex gap-4 mb-4 border-b border-gray-800 pb-4">
                                <LanguageSwitcher />
                                <CurrencySwitcher />
                            </div>
                            <Link to="/" onClick={() => setIsMenuOpen(false)} className="block py-2 hover:text-primary">{t('nav.home')}</Link>
                            <Link to="/products" onClick={() => setIsMenuOpen(false)} className="block py-2 hover:text-primary">{t('nav.products')}</Link>
                            <Link to="/about" onClick={() => setIsMenuOpen(false)} className="block py-2 hover:text-primary">{t('nav.about')}</Link>
                            <Link to="/contact" onClick={() => setIsMenuOpen(false)} className="block py-2 hover:text-primary">{t('nav.contact')}</Link>
                            <Link to="/faq" onClick={() => setIsMenuOpen(false)} className="block py-2 hover:text-primary">{t('nav.faq')}</Link>
                        </div>
                    </div>
                )}
            </div>
            {/* Search and Cart Modals */}
            <GlobalSearch isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
            <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
        </nav>
    );
}
