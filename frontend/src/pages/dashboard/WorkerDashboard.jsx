import { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import API from '../../api/axios';
import { Briefcase, Users, CheckCircle, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

const WorkerDashboard = () => {
    const { user } = useContext(AuthContext);
    const [myProposals, setMyProposals] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMyProposals = async () => {
            try {
                const res = await API.get('/proposals/my-proposals');
                setMyProposals(res.data.proposals);
            } catch (err) {
                console.error("Error fetching your proposals");
            } finally {
                setLoading(false);
            }
        };
        fetchMyProposals();
    }, []);

    if (loading) return <div className="p-20 text-center">Loading your dashboard...</div>;

    return (
        <div className="min-h-screen bg-gray-50 p-6 md:p-12">
            <div className="max-w-7xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Welcome back, {user?.name}!</h1>
                    <p className="text-gray-600 mt-2">Manage your proposals and find new opportunities.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white p-6 rounded-xl shadow-sm border">
                        <div className="flex items-center gap-3">
                            <Briefcase className="text-blue-600" size={24} />
                            <div>
                                <p className="text-2xl font-bold text-gray-900">{myProposals.length}</p>
                                <p className="text-sm text-gray-600">Total Proposals</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-sm border">
                        <div className="flex items-center gap-3">
                            <CheckCircle className="text-green-600" size={24} />
                            <div>
                                <p className="text-2xl font-bold text-gray-900">{myProposals.filter(p => p.status === 'accepted').length}</p>
                                <p className="text-sm text-gray-600">Accepted</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-sm border">
                        <div className="flex items-center gap-3">
                            <Clock className="text-yellow-600" size={24} />
                            <div>
                                <p className="text-2xl font-bold text-gray-900">{myProposals.filter(p => p.status === 'pending').length}</p>
                                <p className="text-sm text-gray-600">Pending</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-sm border">
                        <div className="flex items-center gap-3">
                            <Users className="text-purple-600" size={24} />
                            <div>
                                <p className="text-2xl font-bold text-gray-900">{myProposals.filter(p => p.status === 'rejected').length}</p>
                                <p className="text-sm text-gray-600">Rejected</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border p-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">Your Proposals</h2>
                    {myProposals.length === 0 ? (
                        <p className="text-gray-600">You haven't submitted any proposals yet. <Link to="/jobs" className="text-blue-600 hover:underline">Browse jobs</Link></p>
                    ) : (
                        <div className="space-y-4">
                            {myProposals.map(proposal => (
                                <div key={proposal._id} className="border rounded-lg p-4 hover:shadow-md transition">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="font-semibold text-gray-900">{proposal.jobId ? proposal.jobId.title : 'Job not found'}</h3>
                                            <p className="text-sm text-gray-600 mt-1">{proposal.jobId ? proposal.jobId.description.substring(0, 100) + '...' : 'Job details unavailable'}</p>
                                            <p className="text-sm text-gray-500 mt-2">Proposed: ${proposal.proposedPrice}</p>
                                        </div>
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                            proposal.status === 'ACCEPTED' ? 'bg-green-100 text-green-800' :
                                            proposal.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                                            'bg-red-100 text-red-800'
                                        }`}>
                                            {proposal.status}
                                        </span>
                                    </div>
                                    {proposal.status === 'ACCEPTED' && proposal.jobId && (
                                        <div className="mt-4 flex justify-end">
                                            <Link
                                                to={`/chat/${proposal.jobId._id}`}
                                                className="px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 transition"
                                            >
                                                Message Client
                                            </Link>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default WorkerDashboard;