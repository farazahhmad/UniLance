import { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import API from '../../api/axios';
import { Briefcase, Users, CheckCircle, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

const ClientDashboard = () => {
    const { user } = useContext(AuthContext);
    const [myJobs, setMyJobs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMyJobs = async () => {
            try {
                
                const res = await API.get('/jobs/my-jobs');
                setMyJobs(res.data.jobs);
            } catch (err) {
                console.error("Error fetching your jobs");
            } finally {
                setLoading(false);
            }
        };
        fetchMyJobs();
    }, []);

    if (loading) return <div className="p-20 text-center">Loading your dashboard...</div>;

    return (
        <div className="min-h-screen bg-gray-50 p-6 md:p-12">
            <div className="max-w-6xl mx-auto">
                <header className="mb-10">
                    <h1 className="text-4xl font-black text-gray-900">Client Dashboard</h1>
                    <p className="text-gray-500">Manage your postings and review student proposals</p>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-4">
                        <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl"><Briefcase size={24}/></div>
                        <div><p className="text-2xl font-bold">{myJobs.length}</p><p className="text-xs text-gray-500 uppercase font-bold">Total Gigs</p></div>
                    </div>
                </div>

                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                    Active Postings <span className="text-sm bg-gray-200 px-2 py-0.5 rounded-full">{myJobs.length}</span>
                </h2>

                <div className="space-y-4">
                    {myJobs.map(job => (
                        <div key={job._id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
                            <div>
                                <h3 className="text-lg font-bold text-gray-900">{job.title}</h3>
                                <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                                    <Clock size={14}/> Posted on {new Date(job.createdAt).toLocaleDateString()}
                                </p>
                            </div>
                            
                            <div className="flex items-center gap-8">
                                <div className="text-center">
                                    <p className="text-xl font-bold text-blue-600 flex items-center gap-1">
                                        <Users size={18}/> {job.proposalsCount || 0}
                                    </p>
                                    <p className="text-[10px] uppercase font-black text-gray-400">Proposals</p>
                                </div>
                                <Link 
                                    to={`/dashboard/proposals/${job._id}`}
                                    className="px-6 py-2 bg-gray-900 text-white text-sm font-bold rounded-xl hover:bg-black transition"
                                >
                                    Review Applicants
                                </Link>
                            </div>
                        </div>
                    ))}
                    {myJobs.length === 0 && (
                        <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-gray-200">
                            <p className="text-gray-400 mb-4">You haven't posted any jobs yet.</p>
                            <Link to="/create-job" className="text-blue-600 font-bold underline">Post your first gig</Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ClientDashboard;