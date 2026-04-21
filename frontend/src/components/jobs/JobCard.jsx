import { MapPin, Clock, IndianRupee, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

const JobCard = ({ job }) => {
    return (
        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <span className="px-3 py-1 bg-blue-50 text-blue-600 text-xs font-bold rounded-full uppercase tracking-wider">
                        {job.category || 'General'}
                    </span>
                    <h3 className="text-xl font-bold text-gray-900 mt-2">{job.title}</h3>
                </div>
                <div className="text-right">
                    <p className="flex items-center text-green-600 font-bold text-lg">
                        <IndianRupee size={16} /> {job.budget}
                    </p>
                    <p className="text-xs text-gray-400">Fixed Price</p>
                </div>
            </div>

            <p className="text-gray-600 text-sm line-clamp-2 mb-4">
                {job.description}
            </p>

            <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-6">
                <div className="flex items-center gap-1">
                    <MapPin size={16} className="text-gray-400" />
                    {job.college || 'NIT Jamshedpur'}
                </div>
                <div className="flex items-center gap-1">
                    <Clock size={16} className="text-gray-400" />
                    {new Date(job.createdAt).toLocaleDateString()}
                </div>
            </div>

            <Link 
                to={`/jobs/${job._id}`} // MUST have the leading slash
                className="w-full flex items-center justify-center gap-2 bg-gray-900 text-white py-2.5 rounded-xl font-medium hover:bg-black transition cursor-pointer"
            >
                View Details <ExternalLink size={16} />
            </Link>
        </div>
    );
};

export default JobCard;