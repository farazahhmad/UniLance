import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../../api/axios';
import { toast } from 'react-hot-toast';
import { User, Mail, Lock, School } from 'lucide-react';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'worker', // Default role
        college: 'NIT Jamshedpur',
    });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await API.post('/auth/register', formData);
            toast.success(res.data.message || "Registration successful! Check your email.");
            // Store email in session storage so we know which email to verify in the next step
            sessionStorage.setItem('verifyEmail', formData.email);
            navigate('/verify-otp');
        } catch (err) {
            toast.error(err.response?.data?.message || "Registration failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg">
                <div className="text-center">
                    <h2 className="text-3xl font-extrabold text-gray-900">Join UniLance</h2>
                    <p className="mt-2 text-sm text-gray-600">The exclusive marketplace for NIT students</p>
                </div>
                
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        {/* Name Input */}
                        <div className="relative">
                            <User className="absolute left-3 top-3 text-gray-400" size={20} />
                            <input
                                type="text"
                                required
                                placeholder="Full Name"
                                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                onChange={(e) => setFormData({...formData, name: e.target.value})}
                            />
                        </div>

                        {/* Email Input */}
                        <div className="relative">
                            <Mail className="absolute left-3 top-3 text-gray-400" size={20} />
                            <input
                                type="email"
                                required
                                placeholder="College Email"
                                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                onChange={(e) => setFormData({...formData, email: e.target.value})}
                            />
                        </div>

                        {/* Password Input */}
                        <div className="relative">
                            <Lock className="absolute left-3 top-3 text-gray-400" size={20} />
                            <input
                                type="password"
                                required
                                placeholder="Password"
                                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                onChange={(e) => setFormData({...formData, password: e.target.value})}
                            />
                        </div>

                        {/* College Input */}
                        <div className="relative">
                            <School className="absolute left-3 top-3 text-gray-400" size={20} />
                            <input
                                type="text"
                                required
                                value={formData.college}
                                placeholder="College Name"
                                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                onChange={(e) => setFormData({...formData, college: e.target.value})}
                            />
                        </div>

                        {/* Role Selection */}
                        <div className="flex gap-4 p-1 bg-gray-100 rounded-lg">
                            <button
                                type="button"
                                onClick={() => setFormData({...formData, role: 'worker'})}
                                className={`flex-1 py-2 rounded-md text-sm font-medium transition ${formData.role === 'worker' ? 'bg-white shadow text-blue-600' : 'text-gray-500'}`}
                            >
                                I want to Work
                            </button>
                            <button
                                type="button"
                                onClick={() => setFormData({...formData, role: 'client'})}
                                className={`flex-1 py-2 rounded-md text-sm font-medium transition ${formData.role === 'client' ? 'bg-white shadow text-blue-600' : 'text-gray-500'}`}
                            >
                                I want to Hire
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition disabled:bg-blue-300"
                    >
                        {loading ? "Creating Account..." : "Create Account"}
                    </button>
                </form>

                <p className="text-center text-sm text-gray-600">
                    Already have an account? <Link to="/login" className="text-blue-600 font-bold">Sign In</Link>
                </p>
            </div>
        </div>
    );
};

export default Register;