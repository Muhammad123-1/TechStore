import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { Eye, EyeOff } from 'lucide-react';

export default function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState(1);
    const [animationComplete, setAnimationComplete] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const { forgotPassword, resetPassword } = useAuthStore();
    const navigate = useNavigate();
    const { t } = useTranslation();

    useEffect(() => {
        // Trigger animation on mount
        setTimeout(() => setAnimationComplete(true), 100);
    }, []);

    const handleSubmitEmail = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrorMessage('');

        try {
            await forgotPassword(email);
            toast.success(t('auth.resetPasswordSuccess', 'OTP sent successfully!'));
            setStep(2);
        } catch (error) {
            const msg = error.response?.data?.message || t('auth.passwordResetFailed');
            setErrorMessage(msg);
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();

        if (newPassword !== confirmPassword) {
            toast.error(t('auth.passwordMismatch'));
            return;
        }

        setLoading(true);

        try {
            await resetPassword(email, otp, newPassword);
            toast.success(t('auth.passwordChanged'));
            navigate('/signin');
        } catch (error) {
            toast.error(error.response?.data?.message || t('auth.passwordResetFailed'));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
            {/* Animated Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-dark-base via-dark-card to-dark-secondary">
                {/* Floating Shapes */}
                {/* Rotating orb */}
                <div className={`absolute inset-0 flex items-center justify-center pointer-events-none`}>
                    <div className={`w-64 h-64 relative transition-opacity duration-700 ${animationComplete ? 'opacity-100' : 'opacity-0'}`}>
                        <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-primary/30 to-cyan-300/20 blur-2xl" />
                        <div className="absolute inset-0 animate-spin-slow">
                            <svg viewBox="0 0 100 100" className="w-full h-full">
                                <defs>
                                    <linearGradient id="g1" x1="0%" x2="100%">
                                        <stop offset="0%" stopColor="#00B8D9" stopOpacity="0.45" />
                                        <stop offset="100%" stopColor="#7C3AED" stopOpacity="0.25" />
                                    </linearGradient>
                                </defs>
                                <circle cx="50" cy="50" r="30" stroke="url(#g1)" strokeWidth="6" fill="none" strokeLinecap="round" strokeDasharray="47 47" />
                            </svg>
                        </div>
                        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 shadow-lg animate-bounce-slow" />
                    </div>
                </div>

                {/* Grid Pattern */}
                <div className="absolute inset-0 opacity-5" style={{
                    backgroundImage: `linear-gradient(rgba(0, 184, 217, 0.1) 1px, transparent 1px),
                                     linear-gradient(90deg, rgba(0, 184, 217, 0.1) 1px, transparent 1px)`,
                    backgroundSize: '50px 50px'
                }}></div>
            </div>

            {/* Content */}
            <div className={`relative z-10 w-full max-w-md px-4 py-16 transition-all duration-700 transform ${animationComplete ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                <div className="card p-8 backdrop-blur-lg bg-dark-card/80 border border-primary/30 shadow-2xl">
                    {/* Icon */}
                    <div className={`flex justify-center mb-6 transition-all duration-500 delay-200 ${animationComplete ? 'scale-100 opacity-100' : 'scale-50 opacity-0'}`}>
                        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-cyan-400 flex items-center justify-center shadow-lg shadow-primary/30">
                            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                            </svg>
                        </div>
                    </div>

                    {/* Title */}
                    <h1 className={`text-3xl font-bold text-center mb-2 bg-gradient-to-r from-primary to-cyan-300 bg-clip-text text-transparent transition-all duration-500 delay-300 ${animationComplete ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
                        {step === 2 ? t('auth.resetPasswordTitle') : t('auth.forgotPasswordTitle')}
                    </h1>

                    {/* Description */}
                    <p className={`text-text-secondary text-center mb-8 transition-all duration-500 delay-400 ${animationComplete ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
                        {step === 2 ? t('auth.resetPasswordDesc', 'Enter the OTP sent to your email and your new password.') : t('auth.forgotPasswordDesc')}
                    </p>

                    {/* Form */}
                    {step === 2 ? (
                        <form onSubmit={handleResetPassword} className="space-y-6">
                            <div className={`transition-all duration-500 delay-500 ${animationComplete ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
                                <label className="block mb-2 font-semibold text-text-primary">OTP Code</label>
                                <input
                                    type="text"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                    className="input-field focus:border-cyan-400 focus:shadow-glow text-center tracking-[0.5em] font-mono text-xl"
                                    required
                                    maxLength={6}
                                />
                            </div>

                            <div className={`transition-all duration-500 delay-500 ${animationComplete ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
                                <label className="block mb-2 font-semibold text-text-primary">{t('auth.newPassword')}</label>
                                <div className="relative">
                                    <input
                                        type={showNewPassword ? "text" : "password"}
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        className="input-field focus:border-cyan-400 focus:shadow-glow pr-12"
                                        required
                                        minLength={6}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowNewPassword(!showNewPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-text-secondary hover:text-primary transition-colors focus:outline-none"
                                    >
                                        {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                    </button>
                                </div>
                            </div>

                            <div className={`transition-all duration-500 delay-600 ${animationComplete ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
                                <label className="block mb-2 font-semibold text-text-primary">{t('auth.confirmNewPassword')}</label>
                                <div className="relative">
                                    <input
                                        type={showConfirmPassword ? "text" : "password"}
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        className="input-field focus:border-cyan-400 focus:shadow-glow pr-12"
                                        required
                                        minLength={6}
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
                                className={`btn-primary w-full transition-all duration-500 delay-700 ${animationComplete ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}
                            >
                                {loading ? (
                                    <span className="flex items-center justify-center">
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        {t('auth.resettingPassword')}
                                    </span>
                                ) : t('auth.resetPassword')}
                            </button>
                        </form>
                    ) : (
                        <form onSubmit={handleSubmitEmail} className="space-y-6">
                            <div className={`transition-all duration-500 delay-500 ${animationComplete ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
                                <label className="block mb-2 font-semibold text-text-primary">{t('auth.email')}</label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="input-field focus:border-cyan-400 focus:shadow-glow"
                                    required
                                />
                            </div>

                            {errorMessage && (
                                <div className="p-3 bg-red-600/10 border border-red-600/20 text-red-600 rounded-md text-sm">
                                    {errorMessage}
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={loading}
                                className={`btn-primary w-full transition-all duration-500 delay-700 ${animationComplete ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}
                            >
                                {loading ? (
                                    <span className="flex items-center justify-center">
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        {t('auth.sendingResetLink')}
                                    </span>
                                ) : t('auth.sendResetLink')}
                            </button>
                        </form>
                    )}

                    {/* Back to Sign In */}
                    <div className={`mt-8 text-center transition-all duration-500 delay-800 ${animationComplete ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
                        <Link to="/signin" className="text-primary hover:text-cyan-300 transition-colors flex items-center justify-center gap-2">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            {t('auth.backToSignIn')}
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
