import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import API from '../../api/axios';
import { toast } from 'react-hot-toast';
import { User, IndianRupee, Clock, CheckCircle, XCircle } from 'lucide-react';

const JobProposals = () => {
    const { id } = useParams(); // This is the Job ID
    const [proposals, setProposals] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProposals = async () => {
            try {
                const res = await API.get(`/proposals/job/${id}`);
                setProposals(res.data.proposals);
            } catch (err) {
                toast.error("Error loading proposals");
            } finally {
                setLoading(false);
            }
        };
        fetchProposals();
    }, [id]);

    const handleAction = async (proposalId, action) => {
        try {
            if (action === 'accept') {
                await API.patch(`/proposals/${proposalId}/accept`);
                toast.success("Proposal accepted!");
            } else if (action === 'reject') {
                await API.patch(`/proposals/${proposalId}/reject`);
                toast.success("Proposal rejected!");
            }
            // Update UI locally
            setProposals(proposals.map(p => p._id === proposalId ? { ...p, status: action === 'accept' ? 'ACCEPTED' : 'REJECTED' } : p));
        } catch (err) {
            toast.error("Action failed");
        }
    };

    if (loading) return <div className="p-20 text-center">Loading applications...</div>;

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-black text-gray-900 mb-8">Review Applicants</h1>

                <div className="space-y-4">
                    {proposals.map(p => (
                        <div key={p._id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">
                                        {p.workerId.name.charAt(0)}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg text-gray-900">{p.workerId.name}</h3>
                                        <p className="text-sm text-gray-500">{p.workerId.college}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-xl font-black text-green-600">₹{p.proposedPrice}</p>
                                    <p className="text-xs text-gray-400 flex items-center gap-1 justify-end">
                                        <Clock size={12}/> {p.estimatedDays} Days
                                    </p>
                                </div>
                            </div>

                            <p className="text-gray-600 text-sm bg-gray-50 p-4 rounded-xl mb-6 italic">
                                "{p.proposalText}"
                            </p>

                            <div className="flex gap-3">
                                {p.status === 'PENDING' ? (
                                    <>
                                        <button 
                                            onClick={() => handleAction(p._id, 'accept')}
                                            className="flex-1 bg-blue-600 text-white py-2.5 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-blue-700 transition"
                                        >
                                            <CheckCircle size={18}/> Hire Student
                                        </button>
                                        <button 
                                            onClick={() => handleAction(p._id, 'reject')}
                                            className="px-6 py-2.5 bg-gray-100 text-gray-500 rounded-xl font-bold hover:bg-red-50 hover:text-red-500 transition"
                                        >
                                            <XCircle size={18}/>
                                        </button>
                                    </>
                                ) : (
                                    <div className={`w-full text-center py-2 rounded-xl font-bold uppercase tracking-widest text-xs ${p.status === 'ACCEPTED' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                        {p.status}
                                    </div>
                                )}
                                {p.status === 'ACCEPTED' && (
                                    <Link
                                        to={`/chat/${p.jobId}`}
                                        className="flex-1 bg-gray-900 text-white py-2 rounded-xl text-center font-bold"
                                    >
                                        Message Worker
                                    </Link>
                                )}
                            </div>
                        </div>
                    ))}
                    {proposals.length === 0 && (
                        <div className="text-center py-20 text-gray-400">No proposals yet. Check back soon!</div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default JobProposals;