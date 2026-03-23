import React, { useState, useEffect } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import toast from 'react-hot-toast';
import api from '../services/api';
import { ArrowLeft, Package, CheckCircle2, AlertCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function PosScanner() {
    const { user, isAuthenticated } = useAuthStore();
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [scanResult, setScanResult] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [loading, setLoading] = useState(false);
    const [successData, setSuccessData] = useState(null);

    useEffect(() => {
        if (!isAuthenticated || !['admin', 'assistant', 'delivery'].includes(user?.role)) {
            toast.error(t('admin.unauthorized', 'Unauthorized access'));
            navigate('/');
            return;
        }

        // Initialize Scanner
        const scanner = new Html5QrcodeScanner("reader", {
            qrbox: { width: 250, height: 250 },
            fps: 5,
            rememberLastUsedCamera: true
        });

        scanner.render(onScanSuccess, onScanError);

        function onScanSuccess(decodedText) {
            setScanResult(decodedText);
            scanner.clear();
        }

        function onScanError(err) {
            // Ignore ongoing scan errors (it fires constantly when looking for QR)
        }

        return () => {
            scanner.clear().catch(error => {
                console.error("Failed to clear html5QrcodeScanner. ", error);
            });
        };
    }, []);

    const handleSell = async () => {
        if (!scanResult) return;
        setLoading(true);
        setSuccessData(null);
        try {
            const res = await api.post('/orders/pos/sell', {
                qr_code_id: scanResult,
                quantity: quantity
            });
            setSuccessData(res.data.data);
            toast.success(t('admin.saleSuccess', 'Sale successful!'));
            setScanResult(null);
            setQuantity(1);
        } catch (error) {
            toast.error(error.response?.data?.message || t('admin.saleFailed', 'Sale failed'));
        } finally {
            setLoading(false);
        }
    };

    const handleReset = () => {
        setScanResult(null);
        setSuccessData(null);
        setQuantity(1);
        // Page reload is the easiest way to re-init scanner without complex state management for html5-qrcode
        window.location.reload();
    };

    return (
        <div className="container mx-auto px-4 py-8 min-h-screen">
            <button
                onClick={() => navigate('/admin')}
                className="flex items-center gap-2 mb-8 text-text-secondary hover:text-white transition"
            >
                <ArrowLeft size={20} />
                {t('admin.goBack', 'Ortga qaytish')}
            </button>

            <div className="max-w-md mx-auto">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold mb-2">{t('admin.posScannerTitle', 'POS Scanner')}</h1>
                    <p className="text-text-secondary">{t('admin.posScannerDesc', 'Scan product QR code to sell')}</p>
                </div>

                {!scanResult && !successData && (
                    <div className="card p-6 border-2 border-dashed border-gray-700 bg-dark-secondary">
                        <div id="reader" className="w-full text-black bg-white rounded-xl overflow-hidden"></div>
                        <p className="mt-4 text-center text-sm text-text-secondary">
                            {t('admin.placeQrCode', 'Place the QR code inside the frame to scan')}
                        </p>
                    </div>
                )}

                {scanResult && !successData && (
                    <div className="card p-6 text-center animate-fade-in">
                        <div className="w-16 h-16 bg-blue-500/20 text-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Package size={32} />
                        </div>
                        <h2 className="text-xl font-bold mb-2">{t('admin.productScanned', 'Product Scanned!')}</h2>
                        <p className="text-text-secondary mb-6 break-all bg-dark-card p-3 rounded font-mono text-sm">
                            {t('admin.id', 'ID')}: {scanResult}
                        </p>

                        <div className="mb-6">
                            <label className="block text-left text-sm font-medium mb-2">{t('admin.quantity', 'Quantity')}</label>
                            <input
                                type="number"
                                min="1"
                                value={quantity}
                                onChange={(e) => setQuantity(Number(e.target.value))}
                                className="w-full bg-dark-card border border-gray-700 rounded px-4 py-3 focus:outline-none focus:border-primary"
                            />
                        </div>

                        <div className="flex gap-4">
                            <button
                                onClick={handleSell}
                                disabled={loading}
                                className="btn-primary flex-1 py-3"
                            >
                                {loading ? t('admin.processing', 'Processing...') : t('admin.completeSale', 'Complete Sale')}
                            </button>
                            <button
                                onClick={handleReset}
                                disabled={loading}
                                className="px-6 py-3 border border-gray-700 rounded hover:bg-gray-800 transition"
                            >
                                {t('admin.cancel', 'Cancel')}
                            </button>
                        </div>
                    </div>
                )}

                {successData && (
                    <div className="card p-8 text-center bg-green-500/10 border border-green-500/20 animate-fade-in">
                        <div className="w-20 h-20 bg-green-500 text-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-green-500/40">
                            <CheckCircle2 size={40} />
                        </div>
                        <h2 className="text-2xl font-bold text-green-500 mb-2">{t('admin.saleSuccess')}</h2>
                        <p className="text-white mb-6">
                            {t('admin.orderNumber', 'Order #')}{successData.order[0].orderNumber}
                        </p>

                        <div className="bg-dark-card rounded-xl p-4 mb-8 text-left border border-gray-800">
                            <p className="text-sm text-text-secondary mb-1">{t('admin.newStockLevel', 'New Stock Level:')}</p>
                            <p className="text-xl font-bold">{successData.updatedStock} {t('admin.unitsLeft', 'units left')}</p>
                        </div>

                        <button
                            onClick={handleReset}
                            className="btn-primary w-full py-3"
                        >
                            {t('admin.scanNextProduct', 'Scan Next Product')}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
