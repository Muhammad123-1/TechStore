import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { Eye, EyeOff } from 'lucide-react';

export default function SignUp() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: ''
    });
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const register = useAuthStore(state => state.register);
    const navigate = useNavigate();
    const { t, i18n } = useTranslation();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            toast.error(t('auth.passwordsMismatch'));
            return;
        }

        setLoading(true);

        try {
            const { confirmPassword, ...userData } = formData;
            // include selected language so backend can localize OTP/SMS
            userData.language = i18n.language || 'en';
            await register(userData);
            // Save pending email so OTP verification can be completed without authentication
            localStorage.setItem('pendingEmail', userData.email);
            toast.success(t('auth.accountCreated'));
            navigate('/verify-otp');
        } catch (error) {
            toast.error(error.response?.data?.message || t('auth.registrationFailed'));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-16">
            <div className="max-w-md mx-auto card p-8">
                <h1 className="text-3xl font-bold mb-6 text-center">{t('auth.signUp')}</h1>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block mb-2 font-semibold">{t('auth.fullName')}</label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="input-field"
                            required
                        />
                    </div>

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
                        <label className="block mb-2 font-semibold">{t('auth.phone')}</label>
                        <input
                            type="tel"
                            placeholder="+998901234567"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            className="input-field"
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
                                minLength={6}
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

                    <div>
                        <label className="block mb-2 font-semibold">{t('auth.confirmPassword')}</label>
                        <div className="relative">
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                value={formData.confirmPassword}
                                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                className="input-field pr-12"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-text-secondary hover:text-primary transition-colors focus:outline-none"
                            >
                                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="btn-primary w-full"
                    >
                        {loading ? t('auth.creatingAccount') : t('auth.signUp')}
                    </button>
                </form>

                <p className="text-center mt-6 text-text-secondary">
                    {t('auth.alreadyHaveAccount')}{' '}
                    <Link to="/signin" className="text-primary hover:underline">
                        {t('nav.signIn')}
                    </Link>
                </p>
            </div>
        </div>
    );
}
