import { Link, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { LayoutGrid, PlusCircle, LogOut, User } from 'lucide-react';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="bg-white border-b border-gray-100 py-4 px-6 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto flex justify-between items-center">
                <Link to="/" className="text-2xl font-black text-blue-600 tracking-tighter">
                    UniLance
                </Link>

                <div className="flex items-center gap-6">
                    <Link to="/jobs" className="flex items-center gap-1 text-gray-600 font-medium hover:text-blue-600">
                        <LayoutGrid size={18} /> Feed
                    </Link>

                    {user ? (
                        <>
                            {user.role === 'client' && (
                                <Link to="/create-job" className="flex items-center gap-1 text-gray-600 font-medium hover:text-blue-600">
                                    <PlusCircle size={18} /> Post Job
                                </Link>
                            )}
                            <div className="h-6 w-px bg-gray-200"></div>
                            <Link to="/dashboard" className="flex items-center gap-2 text-sm font-bold text-gray-900 bg-gray-50 px-3 py-1.5 rounded-full hover:bg-gray-100 transition">
                                <User size={14} /> {user.name.split(' ')[0]}
                            </Link>
                            <button onClick={handleLogout} className="text-red-500 hover:text-red-700">
                                <LogOut size={20} />
                            </button>
                        </>
                    ) : (
                        <Link to="/login" className="bg-blue-600 text-white px-5 py-2 rounded-xl font-bold hover:bg-blue-700 transition">
                            Sign In
                        </Link>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;