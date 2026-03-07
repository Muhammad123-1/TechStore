import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { Eye, EyeOff } from 'lucide-react';

export default function SignIn() {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [loading, setLoading] = useState(false);
    const [animationComplete, setAnimationComplete] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const login = useAuthStore(state => state.login);
    const navigate = useNavigate();
    const { t } = useTranslation();

    useEffect(() => {
        const id = setTimeout(() => setAnimationComplete(true), 120);
        return () => clearTimeout(id);
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            await login(formData.email, formData.password);
            toast.success(t('auth.welcomeBack'));
            navigate('/');
        } catch (error) {
            toast.error(error.response?.data?.message || t('auth.loginFailed'));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
            {/* Animated Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-dark-base via-dark-card to-dark-secondary">
                <div className={`absolute -left-10 top-24 w-40 h-40 bg-primary/20 rounded-full blur-3xl transform transition-all duration-1000 ${animationComplete ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'}`} />
                <div className={`absolute right-10 bottom-24 w-56 h-56 bg-cyan-400/20 rounded-full blur-3xl transform transition-all duration-1000 delay-200 ${animationComplete ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`} />
                <div className={`absolute inset-0 opacity-5`} style={{
                    backgroundImage: `linear-gradient(rgba(0, 184, 217, 0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 184, 217, 0.06) 1px, transparent 1px)`,
                    backgroundSize: '60px 60px'
                }} />
            </div>

            <div className={`relative z-10 w-full max-w-md px-4 py-16 transition-all duration-700 transform ${animationComplete ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
                <div className="max-w-md mx-auto card p-8 backdrop-blur bg-dark-card/80 border border-primary/20 shadow-2xl">
                    <h1 className="text-3xl font-bold mb-6 text-center">{t('nav.signIn')}</h1>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block mb-2 font-semibold">{t('auth.email')}</label>
                            <input
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                className="input-field"
                                required
                            />
                        </div>

                        <div>
                            <label className="block mb-2 font-semibold">{t('auth.password')}</label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    className="input-field pr-12"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-text-secondary hover:text-primary transition-colors focus:outline-none"
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                        </div>

                        <div className="flex justify-between items-center">
                            <Link to="/forgot-password" className="text-sm text-text-secondary hover:text-primary">{t('auth.forgotPassword')}</Link>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="btn-primary w-full"
                        >
                            {loading ? t('auth.signingIn') : t('nav.signIn')}
                        </button>
                    </form>

                    <p className="text-center mt-6 text-text-secondary">
                        {t('auth.noAccount')}{' '}
                        <Link to="/signup" className="text-primary hover:underline">
                            {t('auth.signUp')}
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
