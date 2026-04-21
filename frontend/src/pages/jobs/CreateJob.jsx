import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../../api/axios';
import { toast } from 'react-hot-toast';
import { PlusCircle, IndianRupee, AlignLeft, Tag, Calendar, Upload, X } from 'lucide-react';

const CreateJob = () => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        budget: '',
        deadline: '',
        category: 'Web Dev'
    });
    const [files, setFiles] = useState([]);
    const [filePreviews, setFilePreviews] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleFileSelect = (e) => {
        const selectedFiles = Array.from(e.target.files);
        setFiles(selectedFiles);
        
        // Create previews
        const previews = selectedFiles.map(file => URL.createObjectURL(file));
        setFilePreviews(previews);
    };

    const removeFile = (index) => {
        const newFiles = files.filter((_, i) => i !== index);
        const newPreviews = filePreviews.filter((_, i) => i !== index);
        setFiles(newFiles);
        setFilePreviews(newPreviews);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            // Create FormData for multipart upload
            const form = new FormData();
            form.append('title', formData.title);
            form.append('description', formData.description);
            form.append('budget', formData.budget);
            form.append('deadline', formData.deadline);
            form.append('category', formData.category);
            
            // Append files
            files.forEach(file => {
                form.append('images', file);
            });

            await API.post('/jobs', form, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            toast.success("Job posted successfully!");
            navigate('/jobs');
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to post job");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
            <div className="max-w-2xl w-full bg-white rounded-3xl shadow-xl p-8 md:p-12">
                <div className="flex items-center gap-3 mb-8">
                    <PlusCircle className="text-blue-600" size={32} />
                    <h1 className="text-3xl font-black text-gray-900">Post a New Gig</h1>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Title */}
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Job Title</label>
                        <input 
                            type="text"
                            required
                            placeholder="e.g. Design a Logo for my Startup"
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                            onChange={(e) => setFormData({...formData, title: e.target.value})}
                        />
                    </div>

                    {/* Category & Budget */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Category</label>
                            <div className="relative">
                                <Tag className="absolute left-3 top-3.5 text-gray-400" size={18} />
                                <select 
                                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl appearance-none outline-none"
                                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                                >
                                    <option value="Web Dev">Web Dev</option>
                                    <option value="Graphic Design">Graphic Design</option>
                                    <option value="Video Editing">Video Editing</option>
                                    <option value="Tutoring">Tutoring</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Budget (₹)</label>
                            <div className="relative">
                                <IndianRupee className="absolute left-3 top-3.5 text-gray-400" size={18} />
                                <input 
                                    type="number"
                                    required
                                    placeholder="500"
                                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none"
                                    onChange={(e) => setFormData({...formData, budget: e.target.value})}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Deadline */}
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Deadline</label>
                        <div className="relative">
                            <Calendar className="absolute left-3 top-3.5 text-gray-400" size={18} />
                            <input 
                                type="datetime-local"
                                required
                                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none"
                                onChange={(e) => setFormData({...formData, deadline: e.target.value})}
                            />
                        </div>
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Description</label>
                        <div className="relative">
                            <AlignLeft className="absolute left-3 top-3 text-gray-400" size={18} />
                            <textarea 
                                required
                                placeholder="Explain the requirements, deadline, and deliverables..."
                                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none h-40"
                                onChange={(e) => setFormData({...formData, description: e.target.value})}
                            />
                        </div>
                    </div>

                    {/* Photo Upload (Optional) */}
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Reference Photos (Optional)</label>
                        <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition">
                            <input 
                                type="file"
                                multiple
                                accept="image/*"
                                onChange={handleFileSelect}
                                className="hidden"
                                id="photo-upload"
                            />
                            <label htmlFor="photo-upload" className="cursor-pointer flex flex-col items-center gap-2">
                                <Upload className="text-gray-400" size={32} />
                                <p className="text-sm font-semibold text-gray-600">Click to upload or drag and drop</p>
                                <p className="text-xs text-gray-400">PNG, JPG, GIF up to 10MB</p>
                            </label>
                        </div>

                        {/* File Preview */}
                        {files.length > 0 && (
                            <div className="mt-4">
                                <p className="text-sm font-semibold text-gray-700 mb-3">{files.length} file(s) selected</p>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                    {filePreviews.map((preview, index) => (
                                        <div key={index} className="relative">
                                            <img 
                                                src={preview} 
                                                alt={`Preview ${index}`}
                                                className="w-full h-24 object-cover rounded-lg border border-gray-200"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => removeFile(index)}
                                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                                            >
                                                <X size={16} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 text-white font-black py-4 rounded-2xl hover:bg-blue-700 transition shadow-lg shadow-blue-100 disabled:bg-blue-300"
                    >
                        {loading ? "Publishing..." : "Post Job Now"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CreateJob;