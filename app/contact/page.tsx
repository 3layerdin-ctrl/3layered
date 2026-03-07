'use client';

import { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { SlideProvider } from '@/contexts/SlideContext';
import { Phone, Mail, MapPin, Clock, Send, CheckCircle2, Instagram } from 'lucide-react';

export default function ContactPage() {
    const [submitted, setSubmitted] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            // Submit form data to backend API
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (!response.ok) {
                // Check if it's a duplicate email error from the response
                const errorMsg = data.error || '';
                if (errorMsg.toLowerCase().includes('duplicate') ||
                    errorMsg.toLowerCase().includes('unique') ||
                    errorMsg.toLowerCase().includes('already exists')) {
                    alert('We have received your message already. We will respond to you in 24 hours.');
                    return;
                }
                throw new Error(data.error || 'Failed to submit contact form');
            }

            console.log('Contact submission successful:', data);

            setSubmitted(true);

            // Success page will stay until user manually navigates away
        } catch (error) {
            console.error('Error submitting contact form:', error);
            alert('There was an error submitting your message. Please try again or call us directly.');
        }
    };

    if (submitted) {
        return (
            <SlideProvider>
                <Navbar />
                <main className="min-h-screen bg-[#FAF7F2] pt-24 pb-16">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                        <div className="bg-[#FDFBF7] border border-[#E8E1D5] p-12 text-center">
                            <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
                                <CheckCircle2 className="w-10 h-10 text-green-600" />
                            </div>
                            <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4">Message Sent!</h1>
                            <p className="text-xl text-[#2A2320]/80 mb-8">
                                Thank you for reaching out. We've received your message and will get back to you within 24 hours.
                            </p>
                            <div className="flex items-center justify-center gap-3 text-[#2A2320]/80 mb-8">
                                <Mail className="w-5 h-5" />
                                <span>Confirmation sent to {formData.email}</span>
                            </div>
                            <a
                                href="/"
                                className="inline-block bg-[#1A110B] text-[#DFB374] px-8 py-4 hover:bg-gray-900 transition-colors"
                            >
                                Back to Home
                            </a>
                        </div>
                    </div>
                </main>
            </SlideProvider>
        );
    }

    return (
        <SlideProvider>
            <Navbar />
            <main className="min-h-screen bg-[#FAF7F2] pt-24 pb-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {/* Hero Section */}
                    <div className="text-center mb-16">
                        <h1 className="font-serif text-3xl sm:text-4xl md:text-6xl font-bold mb-6">
                            Get In Touch
                        </h1>
                        <p className="text-xl text-[#2A2320]/80 max-w-3xl mx-auto">
                            Have a question or ready to start your project? We'd love to hear from you.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-16">
                        {/* Contact Information Cards */}
                        <div className="lg:col-span-1 space-y-6">
                            {/* Phone */}
                            <div className="bg-[#FDFBF7] border border-[#E8E1D5] p-6 hover:border-[#DFB374] transition-colors duration-300">
                                <div className="flex items-start gap-4">
                                    <div className="flex-shrink-0 w-12 h-12 bg-[#1A110B] text-[#DFB374] rounded-full flex items-center justify-center">
                                        <Phone className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h3 className="font-serif text-xl font-bold mb-2">Phone</h3>
                                        <p className="text-[#2A2320]/80 mb-3">Give us a call</p>
                                        <a
                                            href="tel:+919982781000"
                                            className="text-lg font-medium hover:underline"
                                        >
                                            +91 99827 81000
                                        </a>
                                    </div>
                                </div>
                            </div>

                            {/* Email */}
                            <div className="bg-[#FDFBF7] border border-[#E8E1D5] p-6 hover:border-[#DFB374] transition-colors duration-300">
                                <div className="flex items-start gap-4">
                                    <div className="flex-shrink-0 w-12 h-12 bg-[#1A110B] text-[#DFB374] rounded-full flex items-center justify-center">
                                        <Mail className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h3 className="font-serif text-xl font-bold mb-2">Email</h3>
                                        <p className="text-[#2A2320]/80 mb-3">Send us a message</p>
                                        <a
                                            href="mailto:info@3layered.com"
                                            className="text-lg font-medium hover:underline break-all"
                                        >
                                            info@3layered.com
                                        </a>
                                    </div>
                                </div>
                            </div>

                            {/* Address */}
                            <div className="bg-[#FDFBF7] border border-[#E8E1D5] p-6 hover:border-[#DFB374] transition-colors duration-300">
                                <div className="flex items-start gap-4">
                                    <div className="flex-shrink-0 w-12 h-12 bg-[#1A110B] text-[#DFB374] rounded-full flex items-center justify-center">
                                        <MapPin className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h3 className="font-serif text-xl font-bold mb-2">Office</h3>
                                        <p className="text-[#2A2320]/80 mb-3">Visit our workshop</p>
                                        <address className="not-italic text-[#2A2320]/90 leading-relaxed">
                                            Pune<br />
                                            Maharashtra, India
                                        </address>
                                    </div>
                                </div>
                            </div>

                            {/* Business Hours */}
                            <div className="bg-[#FDFBF7] border border-[#E8E1D5] p-6 hover:border-[#DFB374] transition-colors duration-300">
                                <div className="flex items-start gap-4">
                                    <div className="flex-shrink-0 w-12 h-12 bg-[#1A110B] text-[#DFB374] rounded-full flex items-center justify-center">
                                        <Clock className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h3 className="font-serif text-xl font-bold mb-2">Hours</h3>
                                        <p className="text-[#2A2320]/80 mb-3">We're here for you</p>
                                        <div className="text-[#2A2320]/90 space-y-1">
                                            <p>Mon - Fri: 9:00 AM - 6:00 PM</p>
                                            <p>Saturday: 10:00 AM - 4:00 PM</p>
                                            <p>Sunday: Closed</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Instagram */}
                            <div className="bg-[#FDFBF7] border border-[#E8E1D5] p-6 hover:border-[#DFB374] transition-colors duration-300">
                                <div className="flex items-start gap-4">
                                    <div className="flex-shrink-0 w-12 h-12 bg-[#1A110B] text-[#DFB374] rounded-full flex items-center justify-center">
                                        <Instagram className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h3 className="font-serif text-xl font-bold mb-2">Instagram</h3>
                                        <p className="text-[#2A2320]/80 mb-3">Follow our journey</p>
                                        <a
                                            href="https://www.instagram.com/3layered.global?igsh=MTZ5bjR0MXBidXNyZQ=="
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-lg font-medium hover:underline"
                                        >
                                            @3layered.global
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Contact Form */}
                        <div className="lg:col-span-2">
                            <div className="bg-[#FDFBF7] border border-[#E8E1D5] p-8 md:p-12">
                                <h2 className="font-serif text-3xl font-bold mb-6">Send Us a Message</h2>
                                <p className="text-[#2A2320]/80 mb-8">
                                    Fill out the form below and we'll get back to you as soon as possible.
                                </p>

                                <form onSubmit={handleSubmit} className="space-y-6">
                                    {/* Name */}
                                    <div>
                                        <label htmlFor="name" className="block text-sm font-medium mb-2">
                                            Your Name *
                                        </label>
                                        <input
                                            type="text"
                                            id="name"
                                            name="name"
                                            required
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            className="w-full border-2 border-[#E8E1D5] px-4 py-3 focus:border-[#DFB374] focus:outline-none transition-colors"
                                            placeholder="John Doe"
                                        />
                                    </div>

                                    {/* Email & Phone */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                                                className="w-full border-2 border-[#E8E1D5] px-4 py-3 focus:border-[#DFB374] focus:outline-none transition-colors"
                                                placeholder="john@example.com"
                                            />
                                        </div>

                                        <div>
                                            <label htmlFor="phone" className="block text-sm font-medium mb-2">
                                                Phone Number
                                            </label>
                                            <input
                                                type="tel"
                                                id="phone"
                                                name="phone"
                                                value={formData.phone}
                                                onChange={handleInputChange}
                                                className="w-full border-2 border-[#E8E1D5] px-4 py-3 focus:border-[#DFB374] focus:outline-none transition-colors"
                                                placeholder="+91 1234567890"
                                            />
                                        </div>
                                    </div>

                                    {/* Subject */}
                                    <div>
                                        <label htmlFor="subject" className="block text-sm font-medium mb-2">
                                            Subject *
                                        </label>
                                        <select
                                            id="subject"
                                            name="subject"
                                            required
                                            value={formData.subject}
                                            onChange={handleInputChange}
                                            className="w-full border-2 border-[#E8E1D5] px-4 py-3 focus:border-[#DFB374] focus:outline-none transition-colors"
                                        >
                                            <option value="">Select a subject</option>
                                            <option value="general">General Inquiry</option>
                                            <option value="custom-print">Custom Print Request</option>
                                            <option value="quote">Request a Quote</option>
                                            <option value="support">Technical Support</option>
                                            <option value="partnership">Partnership Opportunity</option>
                                            <option value="other">Other</option>
                                        </select>
                                    </div>

                                    {/* Message */}
                                    <div>
                                        <label htmlFor="message" className="block text-sm font-medium mb-2">
                                            Message *
                                        </label>
                                        <textarea
                                            id="message"
                                            name="message"
                                            required
                                            value={formData.message}
                                            onChange={handleInputChange}
                                            rows={6}
                                            className="w-full border-2 border-[#E8E1D5] px-4 py-3 focus:border-[#DFB374] focus:outline-none transition-colors resize-none"
                                            placeholder="Tell us how we can help you..."
                                        />
                                    </div>

                                    {/* Submit Button */}
                                    <button
                                        type="submit"
                                        className="w-full bg-gradient-to-r from-[#DFB374] to-[#C99144] hover:from-[#C99144] hover:to-[#B88033] text-[#1A110B] py-4 px-6 text-lg font-bold rounded-full shadow-[0_0_20px_rgba(223,179,116,0.3)] transition-all duration-300 flex items-center justify-center gap-3 group"
                                    >
                                        <span>Send Message</span>
                                        <Send className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                    </button>

                                    <p className="text-xs text-center text-[#2A2320]/60">
                                        We'll respond within 24 hours on business days
                                    </p>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </SlideProvider>
    );
}
