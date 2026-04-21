import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { IndianRupee, Calendar, MapPin, Briefcase, Send, ChevronLeft, ChevronRight } from 'lucide-react';
import API from '../../api/axios';
import { toast } from 'react-hot-toast';
import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';

const JobDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);
    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    
    // Application Form State
    const [showApply, setShowApply] = useState(false);
    const [proposal, setProposal] = useState({
        proposalText: '',
        proposedPrice: '',
        estimatedDays: ''
    });
    const [submitting, setSubmitting] = useState(false);
    const [hasApplied, setHasApplied] = useState(false);

    useEffect(() => {
        const fetchJob = async () => {
            try {
                const res = await API.get(`/jobs/${id}`);
                setJob(res.data.job);
            } catch (err) {
                toast.error("Could not find this job.");
                navigate('/jobs');
            } finally {
                setLoading(false);
            }
        };
        
        const checkApplied = async () => {
            if (user?.role === 'worker') {
                try {
                    const res = await API.get(`/proposals/check-applied/${id}`);
                    setHasApplied(res.data.applied);
                } catch (err) {
                    console.error("Error checking application status");
                }
            }
        };
        
        fetchJob();
        checkApplied();
    }, [id, user]);

    const handleApply = async (e) => {
        e.preventDefault();
        
        // Validation
        if (proposal.proposalText.length < 20) {
            toast.error("Proposal text must be at least 20 characters.");
            return;
        }
        if (!proposal.proposedPrice || isNaN(proposal.proposedPrice) || proposal.proposedPrice <= 0) {
            toast.error("Please enter a valid bid amount.");
            return;
        }
        if (!proposal.estimatedDays || isNaN(proposal.estimatedDays) || proposal.estimatedDays <= 0) {
            toast.error("Please enter a valid number of days.");
            return;
        }
        
        setSubmitting(true);
        try {
            await API.post(`/proposals/apply/${id}`, proposal);
            toast.success("Application submitted successfully!");
            setHasApplied(true);
            setShowApply(false);
            setProposal({ proposalText: '', proposedPrice: '', estimatedDays: '' }); // Reset form
            navigate('/dashboard'); // Redirect to dashboard
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to apply.");
        } finally {
            setSubmitting(false);
        }
    };

    const nextImage = () => {
        if (job?.images?.length) {
            setCurrentImageIndex((prev) => (prev + 1) % job.images.length);
        }
    };

    const prevImage = () => {
        if (job?.images?.length) {
            setCurrentImageIndex((prev) => (prev - 1 + job.images.length) % job.images.length);
        }
    };

    if (loading) return <div className="p-20 text-center">Loading details...</div>;

    return (
        <div className="min-h-screen bg-gray-50 py-10 px-4">
            <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
                
                {/* Left Column: Job Info */}
                <div className="md:col-span-2 space-y-6">
                    <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                        <h1 className="text-3xl font-black text-gray-900 mb-4">{job.title}</h1>
                        <div className="flex flex-wrap gap-4 text-gray-500 mb-8">
                            <span className="flex items-center gap-1"><MapPin size={16}/> {job.college}</span>
                            <span className="flex items-center gap-1"><Briefcase size={16}/> {job.category}</span>
                            <span className="flex items-center gap-1"><Calendar size={16}/> {new Date(job.createdAt).toLocaleDateString()}</span>
                        </div>

                        {/* Image Gallery */}
                        {job.images && job.images.length > 0 && (
                            <div className="mb-8">
                                <div className="relative bg-gray-100 rounded-2xl overflow-hidden mb-4">
                                    <img 
                                        src={job.images[currentImageIndex]} 
                                        alt={`Job reference ${currentImageIndex + 1}`}
                                        className="w-full h-64 object-cover"
                                    />
                                    {job.images.length > 1 && (
                                        <>
                                            <button
                                                onClick={prevImage}
                                                className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition"
                                            >
                                                <ChevronLeft size={20} />
                                            </button>
                                            <button
                                                onClick={nextImage}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition"
                                            >
                                                <ChevronRight size={20} />
                                            </button>
                                            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-black/60 text-white px-3 py-1 rounded-full text-xs font-semibold">
                                                {currentImageIndex + 1} / {job.images.length}
                                            </div>
                                        </>
                                    )}
                                </div>

                                {/* Thumbnails */}
                                {job.images.length > 1 && (
                                    <div className="flex gap-2 overflow-x-auto">
                                        {job.images.map((img, index) => (
                                            <button
                                                key={index}
                                                onClick={() => setCurrentImageIndex(index)}
                                                className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition ${
                                                    currentImageIndex === index ? 'border-blue-600' : 'border-gray-300'
                                                }`}
                                            >
                                                <img src={img} alt={`Thumbnail ${index}`} className="w-full h-full object-cover" />
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                        
                        <h3 className="text-lg font-bold mb-3">Description</h3>
                        <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                            {job.description}
                        </p>
                    </div>
                </div>

                {/* Right Column: Action Card */}
                <div className="space-y-6">
                    <div className="bg-white p-6 rounded-3xl shadow-lg border border-blue-50">
                        <p className="text-sm text-gray-500 mb-1">Budget Range</p>
                        <h2 className="text-3xl font-black text-blue-600 flex items-center gap-1 mb-6">
                            <IndianRupee size={24} /> {job.budget}
                        </h2>

                        {!showApply ? (
                            hasApplied ? (
                                <button 
                                    disabled
                                    className="w-full bg-gray-400 text-white font-bold py-4 rounded-2xl cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    Applied <Send size={18}/>
                                </button>
                            ) : (
                                <button 
                                    onClick={() => setShowApply(true)}
                                    className="w-full bg-blue-600 text-white font-bold py-4 rounded-2xl hover:bg-blue-700 transition flex items-center justify-center gap-2"
                                >
                                    Apply for this gig <Send size={18}/>
                                </button>
                            )
                        ) : (
                            <form onSubmit={handleApply} className="space-y-4 animate-in fade-in duration-300">
                                <textarea 
                                    placeholder="Why are you the best fit?"
                                    required
                                    className="w-full p-3 bg-gray-50 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none h-32"
                                    onChange={(e) => setProposal({...proposal, proposalText: e.target.value})}
                                />
                                <input 
                                    type="number"
                                    placeholder="Your Bid (₹)"
                                    required
                                    className="w-full p-3 bg-gray-50 border rounded-xl outline-none"
                                    onChange={(e) => setProposal({...proposal, proposedPrice: e.target.value})}
                                />
                                <input 
                                    type="number"
                                    placeholder="Days to Complete"
                                    required
                                    className="w-full p-3 bg-gray-50 border rounded-xl outline-none"
                                    onChange={(e) => setProposal({...proposal, estimatedDays: e.target.value})}
                                />
                                <div className="flex gap-2">
                                    <button type="submit" disabled={submitting} className="flex-1 bg-green-600 text-white font-bold py-3 rounded-xl disabled:opacity-50">
                                        {submitting ? "Submitting..." : "Submit"}
                                    </button>
                                    <button type="button" onClick={() => setShowApply(false)} className="px-4 py-3 bg-gray-100 text-gray-500 rounded-xl">X</button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default JobDetails;