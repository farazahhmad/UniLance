import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../../api/axios';
import { toast } from 'react-hot-toast';

const VerifyOTP = () => {
    const [otp, setOtp] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const email = sessionStorage.getItem('verifyEmail');

    const handleVerify = async (e) => {
        e.preventDefault();
        if (!email) return toast.error('Email missing. Please register again.');

        setLoading(true);
        try {
            await API.post('/auth/verify-otp', { email, otp });
            toast.success('Account verified successfully!');
            sessionStorage.removeItem('verifyEmail');
            navigate('/login');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Invalid OTP');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-lg text-center">
                <h2 className="text-2xl font-bold text-gray-900">Verify Your Email</h2>
                <p className="text-sm text-gray-600 mt-2">
                    We sent a code to <span className="font-semibold text-blue-600">{email}</span>
                </p>

                <form className="mt-8 space-y-6" onSubmit={handleVerify}>
                    <input
                        type="text"
                        maxLength="6"
                        required
                        placeholder="000000"
                        className="w-full text-center text-3xl tracking-[1rem] font-bold py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 outline-none"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                    />

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition disabled:bg-blue-300"
                    >
                        {loading ? 'Verifying...' : 'Verify OTP'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default VerifyOTP;
