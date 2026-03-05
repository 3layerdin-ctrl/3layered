'use client';

import { useState, useRef, useCallback } from 'react';
import { Navbar } from '@/components/Navbar';
import { SlideProvider } from '@/contexts/SlideContext';
import { Upload, X, FileImage, Box, CheckCircle2, Phone, Mail, MapPin, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

interface UploadedFile {
    file: File;
    preview?: string;
}

export default function CustomPrintPage() {
    const [referenceImages, setReferenceImages] = useState<UploadedFile[]>([]);
    const [modelFiles, setModelFiles] = useState<UploadedFile[]>([]);
    const [isDraggingImages, setIsDraggingImages] = useState(false);
    const [isDraggingModels, setIsDraggingModels] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [showBookCallModal, setShowBookCallModal] = useState(false);
    const [bookCallSubmitted, setBookCallSubmitted] = useState(false);

    const imageInputRef = useRef<HTMLInputElement>(null);
    const modelInputRef = useRef<HTMLInputElement>(null);

    const [formData, setFormData] = useState({
        description: '',
        name: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        state: '',
        pincode: '',
        country: 'India',
    });

    const [bookCallData, setBookCallData] = useState({
        name: '',
        email: '',
        phone: ''
    });

    // Handle file selection
    const handleImageSelect = (files: FileList | null) => {
        if (!files) return;
        const newFiles = Array.from(files).map(file => ({
            file,
            preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined,
        }));
        setReferenceImages(prev => [...prev, ...newFiles]);
    };

    const handleModelSelect = (files: FileList | null) => {
        if (!files) return;
        const newFiles = Array.from(files).map(file => ({ file }));
        setModelFiles(prev => [...prev, ...newFiles]);
    };

    // Drag and drop handlers
    const handleDrag = useCallback((e: React.DragEvent, type: 'images' | 'models') => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            type === 'images' ? setIsDraggingImages(true) : setIsDraggingModels(true);
        } else if (e.type === 'dragleave') {
            type === 'images' ? setIsDraggingImages(false) : setIsDraggingModels(false);
        }
    }, []);

    const handleDrop = useCallback((e: React.DragEvent, type: 'images' | 'models') => {
        e.preventDefault();
        e.stopPropagation();
        type === 'images' ? setIsDraggingImages(false) : setIsDraggingModels(false);

        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            type === 'images' ? handleImageSelect(e.dataTransfer.files) : handleModelSelect(e.dataTransfer.files);
        }
    }, []);

    // Remove file
    const removeFile = (index: number, type: 'images' | 'models') => {
        if (type === 'images') {
            setReferenceImages(prev => {
                const newFiles = [...prev];
                if (newFiles[index].preview) {
                    URL.revokeObjectURL(newFiles[index].preview!);
                }
                newFiles.splice(index, 1);
                return newFiles;
            });
        } else {
            setModelFiles(prev => {
                const newFiles = [...prev];
                newFiles.splice(index, 1);
                return newFiles;
            });
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            // Submit custom print request to backend API
            // Note: File uploads would need additional multipart/form-data handling
            // For now, we'll submit the text data
            const response = await fetch('/api/custom-requests', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    phone: formData.phone,
                    projectDescription: formData.description,
                    address: formData.address,
                    city: formData.city,
                    state: formData.state,
                    pincode: formData.pincode,
                    country: formData.country,
                    // Note: File handling would require file upload logic
                    // For now, admin will contact customer for files
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to submit custom print request');
            }

            const data = await response.json();
            console.log('Custom print request successful:', data);

            setSubmitted(true);

            // Success page will stay until user manually navigates away
        } catch (error) {
            console.error('Error submitting custom print request:', error);
            alert('There was an error submitting your request. Please try again or call us at +91 99827 81000.');
        }
    };

    const handleBookCall = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const response = await fetch('/api/booked-calls', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(bookCallData),
            });

            const data = await response.json();

            if (!response.ok) {
                // Check if it's a duplicate email error from the response
                const errorMsg = data.error || '';
                if (errorMsg.toLowerCase().includes('duplicate') ||
                    errorMsg.toLowerCase().includes('unique') ||
                    errorMsg.toLowerCase().includes('already exists')) {
                    alert('We have received your request already. We will contact you in 24 hours.');
                    return;
                }
                throw new Error(data.error || 'Failed to book call');
            }

            console.log('Book call successful:', data);

            setBookCallSubmitted(true);

            // Reset form
            setTimeout(() => {
                setBookCallSubmitted(false);
                setShowBookCallModal(false);
                setBookCallData({
                    name: '',
                    email: '',
                    phone: ''
                });
            }, 3000);
        } catch (error) {
            console.error('Error booking call:', error);
            alert('There was an error booking your call. Please try again or call us directly at +91 99827 81000.');
        }
    };

    const formatFileSize = (bytes: number) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
    };

    if (submitted) {
        return (
            <SlideProvider>
                <Navbar />
                <main className="min-h-screen bg-gray-50 pt-24 pb-16">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                        <div className="bg-white border border-gray-200 p-12 text-center">
                            <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
                                <CheckCircle2 className="w-10 h-10 text-green-600" />
                            </div>
                            <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4">Request Received!</h1>
                            <p className="text-xl text-gray-600 mb-8">
                                Thank you for your custom print request. Our team will review your specifications and contact you within 24 hours to discuss your project details and provide a quote.
                            </p>
                            <div className="space-y-4 mb-8">
                                <div className="flex items-center justify-center gap-3 text-gray-600">
                                    <Phone className="w-5 h-5" />
                                    <span>We'll call you at {formData.phone}</span>
                                </div>
                                <div className="flex items-center justify-center gap-3 text-gray-600">
                                    <Mail className="w-5 h-5" />
                                    <span>Confirmation sent to {formData.email}</span>
                                </div>
                            </div>
                            <Link
                                href="/"
                                className="inline-block bg-black text-white px-8 py-4 hover:bg-gray-900 transition-colors"
                            >
                                Back to Home
                            </Link>
                        </div>
                    </div>
                </main>
            </SlideProvider>
        );
    }

    return (
        <SlideProvider>
            <Navbar />
            <main className="min-h-screen bg-gray-50 pt-24 pb-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {/* Hero Section */}
                    <div className="text-center mb-8 md:mb-16">
                        <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl font-bold mb-4 md:mb-6">
                            Custom Print Request
                        </h1>
                        <p className="text-base md:text-xl text-gray-600 max-w-3xl mx-auto">
                            Share your vision with us. Upload your designs, specifications, and details — our team will bring your ideas to life with precision 3D printing.
                        </p>
                    </div>

                    {/* Book a Call CTA */}
                    <div className="max-w-5xl mx-auto mb-8 md:mb-16">
                        <div className="bg-gradient-to-br from-gray-900 to-black text-white p-8 md:p-10 border border-gray-800">
                            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                                <div className="text-center md:text-left">
                                    <h2 className="font-serif text-3xl md:text-4xl font-bold mb-3">
                                        Prefer to Discuss Your Project?
                                    </h2>
                                    <p className="text-gray-300 text-lg">
                                        Book a call with our expert team to discuss your custom 3D printing requirements in detail.
                                    </p>
                                </div>
                                <div className="flex-shrink-0">
                                    <button
                                        onClick={() => setShowBookCallModal(true)}
                                        className="inline-flex items-center gap-3 bg-white text-black px-8 py-4 text-lg font-medium hover:bg-gray-100 transition-colors duration-200 whitespace-nowrap group"
                                    >
                                        <Phone className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                                        <span>Book a Call</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Divider with OR */}
                    <div className="max-w-5xl mx-auto mb-12">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t-2 border-gray-300"></div>
                            </div>
                            <div className="relative flex justify-center">
                                <span className="bg-gray-50 px-6 text-lg font-medium text-gray-600">
                                    Or Submit Your Request Online
                                </span>
                            </div>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="max-w-5xl mx-auto space-y-8">
                        {/* File Upload Sections */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {/* Reference Images */}
                            <div className="bg-white border border-gray-200 p-4 md:p-8">
                                <div className="flex items-center gap-3 mb-6">
                                    <FileImage className="w-6 h-6" />
                                    <h2 className="font-serif text-2xl font-bold">Reference Images</h2>
                                </div>
                                <p className="text-sm text-gray-600 mb-6">
                                    Upload images of your desired design, sketches, or reference photos
                                </p>

                                {/* Drop Zone */}
                                <div
                                    className={`border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200 cursor-pointer ${isDraggingImages
                                        ? 'border-black bg-gray-100 scale-105'
                                        : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
                                        }`}
                                    onDragEnter={(e) => handleDrag(e, 'images')}
                                    onDragLeave={(e) => handleDrag(e, 'images')}
                                    onDragOver={(e) => handleDrag(e, 'images')}
                                    onDrop={(e) => handleDrop(e, 'images')}
                                    onClick={() => imageInputRef.current?.click()}
                                >
                                    <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                    <p className="font-medium mb-2">Drag & drop images here</p>
                                    <p className="text-sm text-gray-500">or click to browse</p>
                                    <p className="text-xs text-gray-400 mt-2">PNG, JPG, WEBP up to 10MB each</p>
                                </div>

                                <input
                                    ref={imageInputRef}
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    onChange={(e) => handleImageSelect(e.target.files)}
                                    className="hidden"
                                />

                                {/* Image Previews */}
                                {referenceImages.length > 0 && (
                                    <div className="grid grid-cols-3 gap-3 mt-6">
                                        {referenceImages.map((uploadedFile, index) => (
                                            <div key={index} className="relative group">
                                                {uploadedFile.preview ? (
                                                    <div className="relative w-full h-24 bg-gray-100 rounded overflow-hidden">
                                                        <Image
                                                            src={uploadedFile.preview}
                                                            alt={`Preview ${index + 1}`}
                                                            fill
                                                            className="object-cover"
                                                        />
                                                    </div>
                                                ) : (
                                                    <div className="w-full h-24 bg-gray-100 rounded flex items-center justify-center">
                                                        <FileImage className="w-8 h-8 text-gray-400" />
                                                    </div>
                                                )}
                                                <button
                                                    type="button"
                                                    onClick={() => removeFile(index, 'images')}
                                                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                                >
                                                    <X className="w-4 h-4" />
                                                </button>
                                                <p className="text-xs text-gray-500 mt-1 truncate">{uploadedFile.file.name}</p>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* 3D Model Files */}
                            <div className="bg-white border border-gray-200 p-4 md:p-8">
                                <div className="flex items-center gap-3 mb-4 md:mb-6">
                                    <Box className="w-6 h-6" />
                                    <h2 className="font-serif text-xl md:text-2xl font-bold">3D Model Files</h2>
                                </div>
                                <p className="text-sm text-gray-600 mb-4 md:mb-6">
                                    Upload your 3D model files if you have them ready
                                </p>

                                {/* Drop Zone */}
                                <div
                                    className={`border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200 cursor-pointer ${isDraggingModels
                                        ? 'border-black bg-gray-100 scale-105'
                                        : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
                                        }`}
                                    onDragEnter={(e) => handleDrag(e, 'models')}
                                    onDragLeave={(e) => handleDrag(e, 'models')}
                                    onDragOver={(e) => handleDrag(e, 'models')}
                                    onDrop={(e) => handleDrop(e, 'models')}
                                    onClick={() => modelInputRef.current?.click()}
                                >
                                    <Box className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                    <p className="font-medium mb-2">Drag & drop 3D files here</p>
                                    <p className="text-sm text-gray-500">or click to browse</p>
                                    <p className="text-xs text-gray-400 mt-2">STL, OBJ, STEP, IGES files</p>
                                </div>

                                <input
                                    ref={modelInputRef}
                                    type="file"
                                    accept=".stl,.obj,.step,.stp,.iges,.igs"
                                    multiple
                                    onChange={(e) => handleModelSelect(e.target.files)}
                                    className="hidden"
                                />

                                {/* File List */}
                                {modelFiles.length > 0 && (
                                    <div className="space-y-2 mt-6">
                                        {modelFiles.map((uploadedFile, index) => (
                                            <div
                                                key={index}
                                                className="flex items-center gap-3 p-3 bg-gray-50 rounded group hover:bg-gray-100 transition-colors"
                                            >
                                                <Box className="w-5 h-5 text-gray-400 flex-shrink-0" />
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-medium truncate">{uploadedFile.file.name}</p>
                                                    <p className="text-xs text-gray-500">{formatFileSize(uploadedFile.file.size)}</p>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => removeFile(index, 'models')}
                                                    className="text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                                >
                                                    <X className="w-5 h-5" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Project Description */}
                        <div className="bg-white border border-gray-200 p-4 md:p-8">
                            <h2 className="font-serif text-xl md:text-2xl font-bold mb-4 md:mb-6">Project Description</h2>
                            <p className="text-sm text-gray-600 mb-4">
                                Tell us about your project, including dimensions, material preferences, color requirements, and any special instructions
                            </p>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                required
                                rows={8}
                                className="w-full border-2 border-gray-200 px-4 py-3 focus:border-black focus:outline-none transition-colors resize-none"
                                placeholder="Example: I need a miniature temple model, approximately 15cm tall, printed in white material with fine details. The design should include intricate carvings as shown in the reference images..."
                            />
                        </div>

                        {/* Contact Information */}
                        <div className="bg-white border border-gray-200 p-4 md:p-8">
                            <div className="flex items-center gap-2 md:gap-3 mb-4 md:mb-6">
                                <div className="w-7 h-7 md:w-8 md:h-8 bg-black text-white rounded-full flex items-center justify-center text-xs md:text-sm font-bold">
                                    1
                                </div>
                                <h2 className="font-serif text-xl md:text-2xl font-bold">Contact Information</h2>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium mb-2">
                                        Full Name *
                                    </label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        required
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        className="w-full border-2 border-gray-200 px-4 py-3 focus:border-black focus:outline-none transition-colors"
                                        placeholder="John Doe"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium mb-2">
                                        Email Address *
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        required
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        className="w-full border-2 border-gray-200 px-4 py-3 focus:border-black focus:outline-none transition-colors"
                                        placeholder="john@example.com"
                                    />
                                </div>

                                <div className="md:col-span-2">
                                    <label htmlFor="phone" className="block text-sm font-medium mb-2">
                                        Phone Number *
                                    </label>
                                    <input
                                        type="tel"
                                        id="phone"
                                        name="phone"
                                        required
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        className="w-full border-2 border-gray-200 px-4 py-3 focus:border-black focus:outline-none transition-colors"
                                        placeholder="+91 1234567890"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Shipping Address */}
                        <div className="bg-white border border-gray-200 p-8">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center text-sm font-bold">
                                    2
                                </div>
                                <h2 className="font-serif text-2xl font-bold">Shipping Address</h2>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label htmlFor="address" className="block text-sm font-medium mb-2">
                                        Street Address *
                                    </label>
                                    <input
                                        type="text"
                                        id="address"
                                        name="address"
                                        required
                                        value={formData.address}
                                        onChange={handleInputChange}
                                        className="w-full border-2 border-gray-200 px-4 py-3 focus:border-black focus:outline-none transition-colors"
                                        placeholder="123 Main Street, Apartment 4B"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label htmlFor="city" className="block text-sm font-medium mb-2">
                                            City *
                                        </label>
                                        <input
                                            type="text"
                                            id="city"
                                            name="city"
                                            required
                                            value={formData.city}
                                            onChange={handleInputChange}
                                            className="w-full border-2 border-gray-200 px-4 py-3 focus:border-black focus:outline-none transition-colors"
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="state" className="block text-sm font-medium mb-2">
                                            State *
                                        </label>
                                        <input
                                            type="text"
                                            id="state"
                                            name="state"
                                            required
                                            value={formData.state}
                                            onChange={handleInputChange}
                                            className="w-full border-2 border-gray-200 px-4 py-3 focus:border-black focus:outline-none transition-colors"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label htmlFor="pincode" className="block text-sm font-medium mb-2">
                                            PIN Code *
                                        </label>
                                        <input
                                            type="text"
                                            id="pincode"
                                            name="pincode"
                                            required
                                            value={formData.pincode}
                                            onChange={handleInputChange}
                                            className="w-full border-2 border-gray-200 px-4 py-3 focus:border-black focus:outline-none transition-colors"
                                            placeholder="110001"
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="country" className="block text-sm font-medium mb-2">
                                            Country *
                                        </label>
                                        <select
                                            id="country"
                                            name="country"
                                            required
                                            value={formData.country}
                                            onChange={handleInputChange}
                                            className="w-full border-2 border-gray-200 px-4 py-3 focus:border-black focus:outline-none transition-colors"
                                        >
                                            <option value="India">India</option>
                                            <option value="USA">United States</option>
                                            <option value="UK">United Kingdom</option>
                                            <option value="Canada">Canada</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Confirmation Notice */}
                        <div className="bg-gradient-to-br from-black to-gray-900 text-white p-8 md:p-12 border border-gray-800">
                            <div className="flex flex-col md:flex-row items-center gap-6">
                                <div className="flex-shrink-0">
                                    <div className="w-16 h-16 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/20">
                                        <Phone className="w-8 h-8" />
                                    </div>
                                </div>
                                <div className="text-center md:text-left flex-1">
                                    <h3 className="font-serif text-2xl md:text-3xl font-bold mb-3">We'll Call You Within 24 Hours</h3>
                                    <p className="text-gray-300 text-lg leading-relaxed">
                                        Our team will review your request and contact you to discuss project details, provide a detailed quote, and confirm the timeline for your custom 3D print.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            className="w-full bg-black text-white py-5 px-6 text-lg font-medium hover:bg-gray-900 transition-all duration-200 flex items-center justify-center gap-3 group"
                        >
                            <span>Submit Custom Print Request</span>
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </button>

                        <p className="text-xs text-center text-gray-500">
                            By submitting this request, you agree to our{' '}
                            <Link href="/terms" className="underline hover:no-underline">
                                Terms & Conditions
                            </Link>
                            {' '}and{' '}
                            <Link href="/privacy" className="underline hover:no-underline">
                                Privacy Policy
                            </Link>
                        </p>
                    </form>
                </div>
            </main>

            {/* Book a Call Modal */}
            {showBookCallModal && (
                <div className="fixed inset-0 bg-white/30 backdrop-blur-md z-50 flex items-center justify-center p-4">
                    <div className="bg-white max-w-md w-full p-8 relative">
                        <button
                            onClick={() => setShowBookCallModal(false)}
                            className="absolute top-4 right-4 text-gray-400 hover:text-black transition-colors"
                        >
                            <X className="w-6 h-6" />
                        </button>

                        {bookCallSubmitted ? (
                            <div className="text-center py-8">
                                <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                                    <CheckCircle2 className="w-8 h-8 text-green-600" />
                                </div>
                                <h2 className="font-serif text-3xl font-bold mb-3">Request Received!</h2>
                                <p className="text-gray-600 mb-4">
                                    Thank you for booking a call. Our team will contact you shortly to schedule a convenient time.
                                </p>
                            </div>
                        ) : (
                            <>
                                <h2 className="font-serif text-3xl font-bold mb-2">Book a Call</h2>
                                <p className="text-gray-600 mb-6">
                                    Fill in your details and our team will reach out to discuss your project.
                                </p>

                                <form onSubmit={handleBookCall} className="space-y-4">
                                    <div>
                                        <label htmlFor="bookCallName" className="block text-sm font-medium mb-2">
                                            Your Name *
                                        </label>
                                        <input
                                            type="text"
                                            id="bookCallName"
                                            required
                                            value={bookCallData.name}
                                            onChange={(e) => setBookCallData({ ...bookCallData, name: e.target.value })}
                                            className="w-full border-2 border-gray-200 px-4 py-3 focus:border-black focus:outline-none transition-colors"
                                            placeholder="John Doe"
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="bookCallEmail" className="block text-sm font-medium mb-2">
                                            Email Address *
                                        </label>
                                        <input
                                            type="email"
                                            id="bookCallEmail"
                                            required
                                            value={bookCallData.email}
                                            onChange={(e) => setBookCallData({ ...bookCallData, email: e.target.value })}
                                            className="w-full border-2 border-gray-200 px-4 py-3 focus:border-black focus:outline-none transition-colors"
                                            placeholder="john@example.com"
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="bookCallPhone" className="block text-sm font-medium mb-2">
                                            Phone Number *
                                        </label>
                                        <input
                                            type="tel"
                                            id="bookCallPhone"
                                            required
                                            value={bookCallData.phone}
                                            onChange={(e) => setBookCallData({ ...bookCallData, phone: e.target.value })}
                                            className="w-full border-2 border-gray-200 px-4 py-3 focus:border-black focus:outline-none transition-colors"
                                            placeholder="+91 1234567890"
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        className="w-full bg-black text-white py-4 px-6 text-lg font-medium hover:bg-gray-900 transition-colors duration-200 flex items-center justify-center gap-3 group"
                                    >
                                        <span>Submit Request</span>
                                        <Phone className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                                    </button>
                                </form>
                            </>
                        )}
                    </div>
                </div>
            )}
        </SlideProvider>
    );
}
