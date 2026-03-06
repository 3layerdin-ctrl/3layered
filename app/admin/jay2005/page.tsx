'use client';

import { useState, useEffect } from 'react';
import { flushSync } from 'react-dom';
import { motion } from "framer-motion";
const ADMIN_PASS = 'jaygehlot20053layeredadmin//200590()';

interface Order {
    id: string;
    order_number: string;
    customer_name: string;
    customer_email: string;
    customer_phone: string | null;
    customer_address?: any;
    items: any[];
    subtotal?: number;
    discount?: number;
    coupon_code?: string | null;
    total: number;
    status: string;
    payment_method?: string;
    payment_status?: string;
    razorpay_order_id?: string | null;
    razorpay_payment_id?: string | null;
    tracking_number?: string | null;
    admin_notes?: string | null;
    created_at: string;
}

interface CustomRequest {
    id: string;
    name: string;
    email: string;
    phone: string | null;
    project_description: string;
    budget_range: string | null;
    timeline: string | null;
    address: string | null;
    city: string | null;
    state: string | null;
    pincode: string | null;
    country: string | null;
    status: string;
    created_at: string;
}

interface ContactSubmission {
    id: string;
    name: string;
    email: string;
    phone: string | null;
    subject: string | null;
    message: string;
    status: string;
    created_at: string;
}

interface BookedCall {
    id: string;
    name: string;
    email: string;
    phone: string;
    status: string;
    admin_notes: string | null;
    created_at: string;
}

interface PrebookRequest {
    id: string;
    product_slug: string;
    product_id: string | null;
    first_name: string;
    last_name: string;
    name: string | null;
    email: string;
    phone: string;
    status: string;
    created_at: string;
}

type Tab = 'dashboard' | 'orders' | 'custom' | 'contact' | 'calls' | 'prebooks' | 'subscription';

const STATUS_CONFIG: Record<string, { label: string; bg: string; text: string; border: string }> = {
    pending:    { label: 'Pending',    bg: 'bg-amber-100',  text: 'text-amber-800',  border: 'border-l-amber-400' },
    processing: { label: 'Processing', bg: 'bg-blue-100',   text: 'text-blue-800',   border: 'border-l-blue-400' },
    shipped:    { label: 'Shipped',    bg: 'bg-purple-100', text: 'text-purple-800', border: 'border-l-purple-400' },
    delivered:  { label: 'Delivered',  bg: 'bg-green-100',  text: 'text-green-800',  border: 'border-l-green-400' },
    cancelled:  { label: 'Cancelled',  bg: 'bg-red-100',    text: 'text-red-800',    border: 'border-l-red-400' },
    new:        { label: 'New',        bg: 'bg-red-100',    text: 'text-red-800',    border: 'border-l-red-400' },
    reviewing:  { label: 'Reviewing',  bg: 'bg-yellow-100', text: 'text-yellow-800', border: 'border-l-yellow-400' },
    quoted:     { label: 'Quoted',     bg: 'bg-blue-100',   text: 'text-blue-800',   border: 'border-l-blue-400' },
    accepted:   { label: 'Accepted',   bg: 'bg-green-100',  text: 'text-green-800',  border: 'border-l-green-400' },
    rejected:   { label: 'Rejected',   bg: 'bg-red-100',    text: 'text-red-800',    border: 'border-l-red-400' },
    completed:  { label: 'Completed',  bg: 'bg-green-100',  text: 'text-green-800',  border: 'border-l-green-400' },
    unread:     { label: 'Unread',     bg: 'bg-red-100',    text: 'text-red-800',    border: 'border-l-red-400' },
    read:       { label: 'Read',       bg: 'bg-gray-100',   text: 'text-gray-800',   border: 'border-l-gray-400' },
    replied:    { label: 'Replied',    bg: 'bg-blue-100',   text: 'text-blue-800',   border: 'border-l-blue-400' },
    resolved:   { label: 'Resolved',   bg: 'bg-green-100',  text: 'text-green-800',  border: 'border-l-green-400' },
    contacted:  { label: 'Contacted',  bg: 'bg-yellow-100', text: 'text-yellow-800', border: 'border-l-yellow-400' },
    scheduled:  { label: 'Scheduled',  bg: 'bg-blue-100',   text: 'text-blue-800',   border: 'border-l-blue-400' },
    confirmed:  { label: 'Confirmed',  bg: 'bg-green-100',  text: 'text-green-800',  border: 'border-l-green-400' },
};

const ACTIVE_ORDER_STATUSES = ['pending', 'processing', 'shipped'];

const formatDate = (d: string) =>
    new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });

function StatusBadge({ status }: { status: string }) {
    const cfg = STATUS_CONFIG[status] || { label: status, bg: 'bg-gray-100', text: 'text-gray-800' };
    return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${cfg.bg} ${cfg.text} keep-color`}>
            {cfg.label}
        </span>
    );
}

export default function AdminPanel() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [password, setPassword] = useState('');
    const [loginError, setLoginError] = useState('');
    const [activeTab, setActiveTab] = useState<Tab>('dashboard');
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [theme, setTheme] = useState<'dark' | 'light'>('dark');

    const [orders, setOrders] = useState<Order[]>([]);
    const [customRequests, setCustomRequests] = useState<CustomRequest[]>([]);
    const [contactSubmissions, setContactSubmissions] = useState<ContactSubmission[]>([]);
    const [bookedCalls, setBookedCalls] = useState<BookedCall[]>([]);
    const [prebookRequests, setPrebookRequests] = useState<PrebookRequest[]>([]);
    const [loading, setLoading] = useState(false);

    const [showPastOrders, setShowPastOrders] = useState(false);
    const [orderSearch, setOrderSearch] = useState('');
    const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'amount'>('newest');
    const [trackingInputs, setTrackingInputs] = useState<Record<string, string>>({});
    const [notesInputs, setNotesInputs] = useState<Record<string, string>>({});
    const [savingTracking, setSavingTracking] = useState<Record<string, boolean>>({});
    const [savingNotes, setSavingNotes] = useState<Record<string, boolean>>({});

    const [customSearch, setCustomSearch] = useState('');
    const [contactSearch, setContactSearch] = useState('');
    const [callSearch, setCallSearch] = useState('');
    const [prebookSearch, setPrebookSearch] = useState('');

    const [showAccountModal, setShowAccountModal] = useState(false);
    const [subBillingDate, setSubBillingDate] = useState('');
    const [subAmount, setSubAmount] = useState('3000');
    const [subClientName, setSubClientName] = useState('Jay Gehlot');
    const [subWebsiteName, setSubWebsiteName] = useState('3 Layered');
    const [subWebsiteUrl, setSubWebsiteUrl] = useState('https://3layered.com');
    const [subPlanName, setSubPlanName] = useState('Starter Plan');
    const [subPaymentLink, setSubPaymentLink] = useState('');
    const [subQrCodeUrl, setSubQrCodeUrl] = useState('');
    const [subPaymentPending, setSubPaymentPending] = useState(false);
    const [payNotifSending, setPayNotifSending] = useState(false);
    const [payNotifSent, setPayNotifSent] = useState(false);

    useEffect(() => {
        if (sessionStorage.getItem('admin_authenticated') === 'true') {
            setIsAuthenticated(true);
            fetchAllData();
        }
        if (typeof window !== 'undefined') {
            const savedTheme = localStorage.getItem('admin_theme') as 'dark' | 'light';
            if (savedTheme) {
                setTheme(savedTheme);
            } else {
                setTheme('dark');
            }
        }
    }, []);

    useEffect(() => {
        const t: Record<string, string> = {};
        const n: Record<string, string> = {};
        orders.forEach(o => {
            t[o.id] = o.tracking_number || '';
            n[o.id] = o.admin_notes || '';
        });
        setTrackingInputs(t);
        setNotesInputs(n);
    }, [orders]);

    const handleLogin = () => {
        if (password === ADMIN_PASS) {
            setIsAuthenticated(true);
            setLoginError('');
            sessionStorage.setItem('admin_authenticated', 'true');
            document.cookie = 'admin_authenticated=true; path=/; SameSite=Strict; Secure';
            fetchAllData();
        } else {
            setLoginError('Invalid password');
        }
    };

    const toggleTheme = (e: React.MouseEvent) => {
        const newTheme = theme === 'dark' ? 'light' : 'dark';
        
        const applyThemeChange = () => {
            setTheme(newTheme);
            if (typeof window !== 'undefined') {
                localStorage.setItem('admin_theme', newTheme);
            }
        };

        const doc = document as any;
        if (!doc.startViewTransition) {
            applyThemeChange();
            return;
        }

        const x = e.clientX;
        const y = e.clientY;
        const right = window.innerWidth - x;
        const bottom = window.innerHeight - y;
        const maxRadius = Math.hypot(Math.max(x, right), Math.max(y, bottom));

        document.documentElement.style.setProperty('--click-x', `${x}px`);
        document.documentElement.style.setProperty('--click-y', `${y}px`);
        document.documentElement.style.setProperty('--click-r', `${maxRadius}px`);
        
        if (newTheme === 'dark') {
            document.documentElement.classList.add('dark-transition');
            document.documentElement.classList.remove('light-transition');
        } else {
            document.documentElement.classList.add('light-transition');
            document.documentElement.classList.remove('dark-transition');
        }

        doc.startViewTransition(() => {
            flushSync(() => {
                applyThemeChange();
            });
        });
    };

    const handleLogout = () => {
        setIsAuthenticated(false);
        sessionStorage.removeItem('admin_authenticated');
        document.cookie = 'admin_authenticated=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    };

    const fetchAllData = async () => {
        setLoading(true);
        try {
            await Promise.all([fetchOrders(), fetchCustomRequests(), fetchContactSubmissions(), fetchBookedCalls(), fetchPrebookRequests(), fetchSubscription()]);
        } finally {
            setLoading(false);
        }
    };

    const fetchSubscription = async () => {
        try {
            const res = await fetch('/api/subscription');
            const data = await res.json();
            if (data.client_name) setSubClientName(data.client_name);
            if (data.website_name) setSubWebsiteName(data.website_name);
            if (data.website_url) setSubWebsiteUrl(data.website_url);
            if (data.plan_name) setSubPlanName(data.plan_name);
            if (data.plan_amount) setSubAmount(String(data.plan_amount));
            if (data.next_billing_date) setSubBillingDate(data.next_billing_date);
            if (data.payment_link) setSubPaymentLink(data.payment_link);
            if (data.qr_code_url) setSubQrCodeUrl(data.qr_code_url);
            setSubPaymentPending(!!data.payment_pending);
        } catch {}
    };

    const sendPaymentNotification = async () => {
        setPayNotifSending(true);
        try {
            const res = await fetch('/api/subscription/pay-notify', {
                method: 'POST',
                headers: { 'x-admin-password': ADMIN_PASS },
            });
            if (res.ok) {
                setPayNotifSent(true);
                setSubPaymentPending(true);
            }
        } catch {}
        setPayNotifSending(false);
    };

    const fetchOrders = async () => {
        try {
            const res = await fetch(`/api/orders?password=${encodeURIComponent(ADMIN_PASS)}`);
            const data = await res.json();
            if (data.orders) setOrders(data.orders);
        } catch {}
    };

    const fetchCustomRequests = async () => {
        try {
            const res = await fetch(`/api/custom-requests?password=${encodeURIComponent(ADMIN_PASS)}`);
            const data = await res.json();
            if (data.requests) setCustomRequests(data.requests);
        } catch {}
    };

    const fetchContactSubmissions = async () => {
        try {
            const res = await fetch(`/api/contact?password=${encodeURIComponent(ADMIN_PASS)}`);
            const data = await res.json();
            if (data.submissions) setContactSubmissions(data.submissions);
        } catch {}
    };

    const fetchBookedCalls = async () => {
        try {
            const res = await fetch(`/api/booked-calls?password=${encodeURIComponent(ADMIN_PASS)}`);
            const data = await res.json();
            if (data.bookings) setBookedCalls(data.bookings);
        } catch {}
    };

    const fetchPrebookRequests = async () => {
        try {
            const res = await fetch(`/api/prebook-requests?password=${encodeURIComponent(ADMIN_PASS)}`);
            const data = await res.json();
            if (data.requests) setPrebookRequests(data.requests);
        } catch {}
    };

    const patchOrder = async (orderId: string, payload: object) => {
        try {
            const res = await fetch('/api/orders', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ orderId, adminPassword: ADMIN_PASS, ...payload }),
            });
            if (!res.ok) throw new Error('Failed to update order');
            await fetchOrders();
        } catch (error) {
            console.error(error);
            alert('Failed to update order. Please try again.');
        }
    };

    const saveTrackingNumber = async (orderId: string) => {
        setSavingTracking(p => ({ ...p, [orderId]: true }));
        await patchOrder(orderId, { tracking_number: trackingInputs[orderId] || null });
        setSavingTracking(p => ({ ...p, [orderId]: false }));
    };

    const saveAdminNotes = async (orderId: string) => {
        setSavingNotes(p => ({ ...p, [orderId]: true }));
        await patchOrder(orderId, { admin_notes: notesInputs[orderId] || null });
        setSavingNotes(p => ({ ...p, [orderId]: false }));
    };

    const deleteOrder = async (orderId: string) => {
        if (!confirm('Delete this order?')) return;
        try {
            const res = await fetch(`/api/orders?orderId=${orderId}&password=${encodeURIComponent(ADMIN_PASS)}`, { method: 'DELETE' });
            if (!res.ok) throw new Error('Failed to delete order');
            await fetchOrders();
        } catch (error) {
            console.error(error);
            alert('Failed to delete order.');
        }
    };

    const updateCustomRequestStatus = async (id: string, status: string) => {
        try {
            const res = await fetch('/api/custom-requests', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ requestId: id, status, adminPassword: ADMIN_PASS }),
            });
            if (!res.ok) throw new Error('Failed to update request');
            await fetchCustomRequests();
        } catch (error) {
            console.error(error);
            alert('Failed to update request status.');
        }
    };

    const deleteCustomRequest = async (id: string) => {
        if (!confirm('Delete this request?')) return;
        try {
            const res = await fetch(`/api/custom-requests?requestId=${id}&password=${encodeURIComponent(ADMIN_PASS)}`, { method: 'DELETE' });
            if (!res.ok) throw new Error('Failed to delete request');
            await fetchCustomRequests();
        } catch (error) {
            console.error(error);
            alert('Failed to delete custom request.');
        }
    };

    const updateContactStatus = async (id: string, status: string) => {
        try {
            const res = await fetch('/api/contact', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ submissionId: id, status, adminPassword: ADMIN_PASS }),
            });
            if (!res.ok) throw new Error('Failed to update message');
            await fetchContactSubmissions();
        } catch (error) {
            console.error(error);
            alert('Failed to update message status.');
        }
    };

    const deleteContactSubmission = async (id: string) => {
        if (!confirm('Delete this message?')) return;
        try {
            const res = await fetch(`/api/contact?submissionId=${id}&password=${encodeURIComponent(ADMIN_PASS)}`, { method: 'DELETE' });
            if (!res.ok) throw new Error('Failed to delete message');
            await fetchContactSubmissions();
        } catch (error) {
            console.error(error);
            alert('Failed to delete message.');
        }
    };

    const updateCallStatus = async (id: string, status: string) => {
        try {
            const res = await fetch('/api/booked-calls', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ bookingId: id, status, adminPassword: ADMIN_PASS }),
            });
            if (!res.ok) throw new Error('Failed to update call');
            await fetchBookedCalls();
        } catch (error) {
            console.error(error);
            alert('Failed to update booked call status.');
        }
    };

    const deleteBookedCall = async (id: string) => {
        if (!confirm('Delete this call?')) return;
        try {
            const res = await fetch(`/api/booked-calls?bookingId=${id}&password=${encodeURIComponent(ADMIN_PASS)}`, { method: 'DELETE' });
            if (!res.ok) throw new Error('Failed to delete call');
            await fetchBookedCalls();
        } catch (error) {
            console.error(error);
            alert('Failed to delete booked call.');
        }
    };

    const updatePrebookStatus = async (id: string, status: string) => {
        try {
            const res = await fetch('/api/prebook-requests', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ requestId: id, status, adminPassword: ADMIN_PASS }),
            });
            if (!res.ok) throw new Error('Failed to update prebook request');
            await fetchPrebookRequests();
        } catch (error) {
            console.error(error);
            alert('Failed to update prebook request status.');
        }
    };

    const deletePrebookRequest = async (id: string) => {
        if (!confirm('Delete this prebook request?')) return;
        try {
            const res = await fetch(`/api/prebook-requests?requestId=${id}&password=${encodeURIComponent(ADMIN_PASS)}`, { method: 'DELETE' });
            if (!res.ok) throw new Error('Failed to delete prebook request');
            await fetchPrebookRequests();
        } catch (error) {
            console.error(error);
            alert('Failed to delete prebook request.');
        }
    };

    const copy = (text: string) => navigator.clipboard.writeText(text);

    const getWhatsAppLink = (phone: string) => {
        const cleaned = phone.replace(/\D/g, '');
        const num = cleaned.startsWith('91') && cleaned.length === 12 ? cleaned : `91${cleaned}`;
        return `https://wa.me/${num}`;
    };

    const exportOrdersCSV = () => {
        const headers = ['Order Number', 'Customer', 'Email', 'Phone', 'Items', 'Total (INR)', 'Status', 'Payment Method', 'Payment Status', 'Tracking Number', 'Date'];
        const rows = orders.map(o => [
            o.order_number,
            o.customer_name,
            o.customer_email,
            o.customer_phone || '',
            o.items.map((i: any) => `${i.productName} x${i.quantity}`).join('; '),
            o.total,
            o.status,
            o.payment_method || '',
            o.payment_status || '',
            o.tracking_number || '',
            new Date(o.created_at).toLocaleDateString('en-IN'),
        ]);
        const csv = [headers, ...rows].map(r => r.map(v => '"' + String(v).replace(/"/g, '""') + '"').join(',')).join('\n');
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `3layered-orders-${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const sortedOrders = [...orders].sort((a, b) => {
        if (sortBy === 'newest') return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        if (sortBy === 'oldest') return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        return b.total - a.total;
    });

    const searchedOrders = sortedOrders.filter(o =>
        !orderSearch ||
        o.customer_name?.toLowerCase().includes(orderSearch.toLowerCase()) ||
        o.customer_email?.toLowerCase().includes(orderSearch.toLowerCase()) ||
        o.order_number?.toLowerCase().includes(orderSearch.toLowerCase())
    );

    const activeOrders = searchedOrders.filter(o => ACTIVE_ORDER_STATUSES.includes(o.status));
    const pastOrders = searchedOrders.filter(o => !ACTIVE_ORDER_STATUSES.includes(o.status));

    const filteredCustom = customRequests.filter(r =>
        !customSearch ||
        r.name?.toLowerCase().includes(customSearch.toLowerCase()) ||
        r.email?.toLowerCase().includes(customSearch.toLowerCase())
    );

    const filteredContact = contactSubmissions.filter(s =>
        !contactSearch ||
        s.name?.toLowerCase().includes(contactSearch.toLowerCase()) ||
        s.email?.toLowerCase().includes(contactSearch.toLowerCase()) ||
        s.message?.toLowerCase().includes(contactSearch.toLowerCase())
    );

    const filteredCalls = bookedCalls.filter(c =>
        !callSearch ||
        c.name?.toLowerCase().includes(callSearch.toLowerCase()) ||
        c.email?.toLowerCase().includes(callSearch.toLowerCase()) ||
        c.phone?.includes(callSearch)
    );

    const filteredPrebooks = prebookRequests.filter(r =>
        !prebookSearch ||
        r.first_name?.toLowerCase().includes(prebookSearch.toLowerCase()) ||
        r.last_name?.toLowerCase().includes(prebookSearch.toLowerCase()) ||
        r.email?.toLowerCase().includes(prebookSearch.toLowerCase()) ||
        r.product_slug?.toLowerCase().includes(prebookSearch.toLowerCase())
    );

    const stats = {
        activeOrders: activeOrders.length,
        pendingOrders: orders.filter(o => o.status === 'pending').length,
        totalRevenue: orders.filter(o => o.status === 'delivered').reduce((s, o) => s + o.total, 0),
        todayOrders: orders.filter(o => new Date(o.created_at).toDateString() === new Date().toDateString()),
        newCustom: customRequests.filter(r => r.status === 'new').length,
        unreadContacts: contactSubmissions.filter(c => c.status === 'unread').length,
        newCalls: bookedCalls.filter(c => c.status === 'new').length,
        newPrebooks: prebookRequests.filter(p => p.status === 'new').length,
    };

    const totalAlerts = stats.pendingOrders + stats.newCustom + stats.unreadContacts + stats.newCalls + stats.newPrebooks;

    const navItems: { id: Tab; label: string; icon: string; badge: number }[] = [
        { id: 'dashboard', label: 'Dashboard', icon: '◧', badge: 0 },
        { id: 'orders', label: 'Orders', icon: '📦', badge: stats.pendingOrders },
        { id: 'custom', label: 'Custom Requests', icon: '✏️', badge: stats.newCustom },
        { id: 'contact', label: 'Contact', icon: '✉️', badge: stats.unreadContacts },
        { id: 'calls', label: 'Booked Calls', icon: '📞', badge: stats.newCalls },
        { id: 'prebooks', label: 'Prebooks', icon: '🏛️', badge: stats.newPrebooks },
    ];

    if (!isAuthenticated) {
        return (
            <div className={theme === 'light' ? 'theme-light' : ''}>
                <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4 font-sans antialiased text-zinc-100 selection:bg-zinc-800 relative overflow-hidden transition-all duration-700">
                {/* Background Static Gradients */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute -top-[40%] -right-[20%] w-[70%] h-[70%] bg-blue-600/20 rounded-full blur-[140px] opacity-80" />
                    <div className="absolute -bottom-[40%] -left-[20%] w-[70%] h-[70%] bg-emerald-600/20 rounded-full blur-[140px] opacity-80" />
                </div>

                {/* Login Card */}
                <div className="relative z-10 w-full max-w-[400px]">
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                        className="bg-zinc-900/40 backdrop-blur-[40px] border-t border-l border-white/20 border-r border-b border-white/5 shadow-[0_8px_32px_0_rgba(0,0,0,0.6)] rounded-[2rem] p-8 overflow-hidden relative group/card"
                    >
                        {/* Liquid highlight shifting on card hover */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-white/10 opacity-0 group-hover/card:opacity-100 transition-opacity duration-700 pointer-events-none" />

                        <div className="flex flex-col items-center text-center space-y-6 relative z-10">
                            
                            {/* Animated Lock Icon */}
                            <div className="relative group/icon cursor-default mt-2 keep-color">
                                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-full blur-xl opacity-50 animate-pulse group-hover/icon:opacity-100 transition-opacity duration-500" />
                                <div className="relative bg-zinc-950/50 backdrop-blur-xl border border-white/20 text-white p-4 rounded-2xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)] transition-transform duration-700 group-hover/icon:scale-110">
                                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                                    </svg>
                                </div>
                            </div>

                            <div className="space-y-2 w-full">
                                <h1 className="text-2xl font-semibold tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-white to-white/70 font-serif">
                                    Admin Portal
                                </h1>
                                <p className="text-sm text-zinc-400 font-light">
                                    Authenticate to access 3 Layered
                                </p>
                            </div>

                            <div className="w-full space-y-5 mt-2">
                                <div className="space-y-4">
                                    <div className="relative group/input">
                                        <div className="absolute inset-0 bg-white/5 rounded-xl blur-md opacity-0 group-focus-within/input:opacity-100 transition-opacity duration-500" />
                                        <input
                                            type="password"
                                            value={password}
                                            onChange={e => setPassword(e.target.value)}
                                            onKeyDown={e => e.key === 'Enter' && handleLogin()}
                                            className="relative w-full bg-zinc-950/50 border border-white/10 text-white rounded-xl px-5 py-3.5 text-sm outline-none transition-all placeholder:text-zinc-500 focus:border-white/30 focus:shadow-[inset_0_0_20px_rgba(255,255,255,0.05)]"
                                            placeholder="Enter access key"
                                            autoFocus
                                        />
                                    </div>
                                    {loginError && (
                                        <motion.p 
                                            initial={{ opacity: 0, y: -5 }} 
                                            animate={{ opacity: 1, y: 0 }} 
                                            className="text-red-400 text-xs font-medium text-left px-1"
                                        >
                                            {loginError}
                                        </motion.p>
                                    )}
                                </div>

                                <button
                                    onClick={handleLogin}
                                    className="relative w-full bg-white text-zinc-950 rounded-xl px-4 py-3.5 text-sm font-semibold hover:bg-zinc-200 transition-all active:scale-[0.98] shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_25px_rgba(255,255,255,0.2)]"
                                >
                                    Login
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
            </div>
        );
    }

    const renderOrderCard = (order: Order) => {
        const cfg = STATUS_CONFIG[order.status] || { label: order.status, bg: 'bg-gray-100', text: 'text-gray-800', border: 'border-l-gray-300' };
        const isActive = ACTIVE_ORDER_STATUSES.includes(order.status);

        return (
            <div key={order.id} className={`bg-zinc-900/40 backdrop-blur-md rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border-l-4 ${cfg.border} border-y border-r border-white/5 p-5 mt-4 group transition-all hover:bg-zinc-900/60 ${!isActive ? 'opacity-70' : ''}`}>
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-4">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <StatusBadge status={order.status} />
                            <span className="font-mono text-sm font-bold text-zinc-400">#{order.order_number || order.id.slice(0,8)}</span>
                        </div>
                    </div>
                    <div className="text-right">
                        {order.discount && order.discount > 0 ? (
                            <>
                                <div className="text-xs text-zinc-500 line-through">₹{(order.total + order.discount).toLocaleString('en-IN')}</div>
                                <div className="text-xl font-bold tracking-tight text-emerald-400 keep-color">₹{order.total.toLocaleString('en-IN')}</div>
                                {order.coupon_code && <div className="text-xs text-emerald-500 font-bold bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-md inline-block mt-1 keep-color">{order.coupon_code} −₹{order.discount}</div>}
                            </>
                        ) : (
                            <div className="text-xl font-bold tracking-tight text-white mb-1">₹{order.total.toLocaleString('en-IN')}</div>
                        )}
                        <div className="text-xs text-zinc-500 font-medium mt-1">
                            {formatDate(order.created_at)}
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-5">
                    <div className="bg-zinc-950/50 border border-white/5 rounded-xl p-4">
                        <div className="text-xs text-zinc-500 mb-1 uppercase tracking-wider font-semibold">Customer</div>
                        <div className="font-bold text-white text-sm">{order.customer_name}</div>
                    </div>
                    <div className="bg-zinc-950/50 border border-white/5 rounded-xl p-4">
                        <div className="text-xs text-zinc-500 mb-1 uppercase tracking-wider font-semibold">Email</div>
                        <div className="flex items-center gap-2">
                            <span className="text-zinc-300 truncate text-sm font-medium">{order.customer_email}</span>
                            <button onClick={() => copy(order.customer_email)} className="text-zinc-600 hover:text-white transition-colors" title="Copy Email">📋</button>
                        </div>
                    </div>
                    {order.customer_phone && (
                        <div className="bg-zinc-950/50 border border-white/5 rounded-xl p-4">
                            <div className="text-xs text-zinc-500 mb-1 uppercase tracking-wider font-semibold">Phone</div>
                            <div className="flex items-center gap-2">
                                <span className="text-zinc-300 text-sm font-medium">{order.customer_phone}</span>
                                <button onClick={() => copy(order.customer_phone || '')} className="text-zinc-600 hover:text-white transition-colors" title="Copy Phone">📋</button>
                                <a href={getWhatsAppLink(order.customer_phone)} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center w-7 h-7 bg-[#25D366]/10 hover:bg-[#25D366]/20 border border-[#25D366]/20 rounded-lg text-[#25D366] transition-colors keep-color shadow-sm" title="Chat on WhatsApp">
                                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                                    </svg>
                                </a>
                            </div>
                        </div>
                    )}
                    <div className="bg-zinc-950/50 border border-white/5 rounded-xl p-4">
                        <div className="text-xs text-zinc-500 mb-1 uppercase tracking-wider font-semibold">Payment</div>
                        <div className="flex items-center gap-2">
                            <span className="text-zinc-300 text-sm font-medium">{order.payment_method === 'cod' ? 'COD' : 'Online'}</span>
                            <span className={`text-xs px-2.5 py-1 rounded-lg font-bold border keep-color ${
                                order.payment_status === 'paid' || order.payment_status === 'completed'
                                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                            }`}>
                                {order.payment_status || 'pending'}
                            </span>
                        </div>
                    </div>
                    {order.razorpay_payment_id && (
                        <div className="bg-zinc-950/50 border border-white/5 rounded-xl p-4 sm:col-span-2 lg:col-span-3">
                            <div className="text-xs text-zinc-500 mb-1 uppercase tracking-wider font-semibold">Razorpay ID</div>
                            <div className="flex items-center gap-2">
                                <span className="font-mono text-sm text-zinc-300">{order.razorpay_payment_id}</span>
                                <button onClick={() => copy(order.razorpay_payment_id || '')} className="text-zinc-600 hover:text-white transition-colors">📋</button>
                            </div>
                        </div>
                    )}
                </div>

                {order.customer_address && (
                    <div className="mb-5 p-4 bg-blue-500/5 border border-blue-500/10 rounded-xl">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-semibold text-blue-400 uppercase tracking-wider">Shipping Address</span>
                            <button onClick={() => {
                                const a = order.customer_address;
                                copy(`${a.address}${a.apartment ? ', ' + a.apartment : ''}, ${a.city}, ${a.state} ${a.pincode}, ${a.country}`);
                            }} className="text-xs text-blue-400 hover:text-blue-300 font-medium transition-colors">📋 Copy Details</button>
                        </div>
                        <div className="text-zinc-300 text-sm leading-relaxed">
                            {order.customer_address.address}{order.customer_address.apartment && `, ${order.customer_address.apartment}`},{' '}
                            {order.customer_address.city}, {order.customer_address.state} {order.customer_address.pincode}, {order.customer_address.country}
                        </div>
                    </div>
                )}

                <div className="mb-5">
                    <div className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">Items Ordered</div>
                    <div className="space-y-2">
                        {order.items.map((item: any, i: number) => (
                            <div key={i} className="flex justify-between text-sm items-center bg-zinc-950/50 p-3 rounded-xl border border-white/5">
                                <span className="text-zinc-300 font-medium">
                                    <span className="bg-zinc-800 text-zinc-400 px-2 py-1 rounded-md text-xs mr-3">{item.quantity}x</span> 
                                    {item.productName}
                                </span>
                                <span className="font-bold text-white shadow-sm">₹{item.totalPrice?.toLocaleString('en-IN')}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
                    <div className="bg-zinc-950/50 border border-white/5 rounded-xl p-4">
                        <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2 block">Tracking Number</label>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={trackingInputs[order.id] ?? ''}
                                onChange={e => setTrackingInputs(p => ({ ...p, [order.id]: e.target.value }))}
                                onKeyDown={e => e.key === 'Enter' && saveTrackingNumber(order.id)}
                                placeholder="e.g. DTDC1234567890"
                                className="flex-1 bg-zinc-900/50 border border-white/10 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-white/30 min-w-0 transition-colors placeholder:text-zinc-600"
                            />
                            <button
                                onClick={() => saveTrackingNumber(order.id)}
                                disabled={savingTracking[order.id]}
                                className="bg-white text-zinc-900 px-4 py-2 rounded-lg text-xs font-bold hover:bg-zinc-200 disabled:opacity-50 whitespace-nowrap transition-colors"
                            >
                                {savingTracking[order.id] ? '...' : 'Save'}
                            </button>
                        </div>
                    </div>
                    <div className="bg-amber-500/5 border border-amber-500/10 rounded-xl p-4">
                        <label className="text-xs font-semibold text-amber-500 uppercase tracking-wider mb-2 block">Admin Notes</label>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={notesInputs[order.id] ?? ''}
                                onChange={e => setNotesInputs(p => ({ ...p, [order.id]: e.target.value }))}
                                onKeyDown={e => e.key === 'Enter' && saveAdminNotes(order.id)}
                                placeholder="Internal notes..."
                                className="flex-1 bg-zinc-900/50 border border-amber-500/20 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-500/50 min-w-0 transition-colors placeholder:text-zinc-600 shadow-[inset_0_0_10px_rgba(245,158,11,0.05)]"
                            />
                            <button
                                onClick={() => saveAdminNotes(order.id)}
                                disabled={savingNotes[order.id]}
                                className="bg-amber-500 text-zinc-950 px-4 py-2 rounded-lg text-xs font-bold hover:bg-amber-400 disabled:opacity-50 whitespace-nowrap transition-colors shadow-[0_0_10px_rgba(245,158,11,0.2)]"
                            >
                                {savingNotes[order.id] ? '...' : 'Save'}
                            </button>
                        </div>
                    </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-white/10 flex-wrap gap-4">
                    <div className="flex flex-wrap gap-2">
                        {(['pending', 'processing', 'shipped', 'delivered', 'cancelled'] as const).map(s => (
                            <button
                                key={s}
                                onClick={() => patchOrder(order.id, { status: s })}
                                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                                    order.status === s
                                        ? `${STATUS_CONFIG[s]?.bg} ${STATUS_CONFIG[s]?.text} ring-2 ring-white/20 ring-offset-1 ring-offset-zinc-900 border border-white/10`
                                        : 'bg-zinc-800/50 text-zinc-400 hover:bg-zinc-800 border border-white/5 hover:text-white'
                                }`}
                            >
                                {STATUS_CONFIG[s]?.label}
                            </button>
                        ))}
                    </div>
                    <button onClick={() => deleteOrder(order.id)} className="text-red-400 hover:text-red-300 text-sm font-semibold px-3 py-1.5 hover:bg-red-500/10 rounded-lg transition-colors">
                        Delete
                    </button>
                </div>
            </div>
        );
    };

    const renderCustomCard = (req: CustomRequest) => {
        const cfg = STATUS_CONFIG[req.status] || { label: req.status, bg: 'bg-gray-100', text: 'text-gray-800', border: 'border-l-gray-300' };
        return (
            <div key={req.id} className={`bg-zinc-900/40 backdrop-blur-md rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border-l-4 ${cfg.border} border-y border-r border-white/5 p-5 group transition-all hover:bg-zinc-900/60`}>
                <div className="flex items-start justify-between mb-4">
                    <div>
                        <StatusBadge status={req.status} />
                        <div className="font-bold text-lg text-white mt-2">{req.name}</div>
                    </div>
                    <div className="text-xs font-medium text-zinc-500">{formatDate(req.created_at)}</div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5 text-sm">
                    <div className="bg-zinc-950/50 border border-white/5 rounded-xl p-4">
                        <div className="text-xs text-zinc-500 mb-1 uppercase tracking-wider font-semibold">Email</div>
                        <div className="flex items-center gap-2">
                            <span className="text-zinc-300 truncate font-medium">{req.email}</span>
                            <button onClick={() => copy(req.email)} className="text-zinc-600 hover:text-white transition-colors" title="Copy Email">📋</button>
                        </div>
                    </div>
                    {req.phone && (
                        <div className="bg-zinc-950/50 border border-white/5 rounded-xl p-4">
                            <div className="text-xs text-zinc-500 mb-1 uppercase tracking-wider font-semibold">Phone</div>
                            <div className="flex items-center gap-2">
                                <span className="text-zinc-300 font-medium">{req.phone}</span>
                                <button onClick={() => copy(req.phone || '')} className="text-zinc-600 hover:text-white transition-colors" title="Copy Phone">📋</button>
                                <a href={getWhatsAppLink(req.phone)} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center w-7 h-7 bg-[#25D366]/10 hover:bg-[#25D366]/20 border border-[#25D366]/20 rounded-lg text-[#25D366] transition-colors keep-color shadow-sm" title="Chat on WhatsApp">
                                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                                    </svg>
                                </a>
                            </div>
                        </div>
                    )}
                    {req.budget_range && (
                        <div className="bg-zinc-950/50 border border-white/5 rounded-xl p-4">
                            <div className="text-xs text-zinc-500 mb-1 uppercase tracking-wider font-semibold">Budget</div>
                            <div className="text-zinc-300 font-medium">{req.budget_range}</div>
                        </div>
                    )}
                    {req.timeline && (
                        <div className="bg-zinc-950/50 border border-white/5 rounded-xl p-4">
                            <div className="text-xs text-zinc-500 mb-1 uppercase tracking-wider font-semibold">Timeline</div>
                            <div className="text-zinc-300 font-medium">{req.timeline}</div>
                        </div>
                    )}
                </div>

                <div className="mb-5 p-4 bg-zinc-950/50 border border-white/5 rounded-xl text-sm">
                    <div className="text-xs text-zinc-500 mb-2 uppercase tracking-wider font-semibold">Project Description</div>
                    <div className="text-zinc-300 leading-relaxed whitespace-pre-wrap">{req.project_description}</div>
                </div>

                {(req.address || req.city) && (
                    <div className="mb-5 p-4 bg-blue-500/5 border border-blue-500/10 rounded-xl text-sm">
                        <div className="text-xs font-semibold text-blue-400 mb-2 uppercase tracking-wider">Address</div>
                        <div className="text-zinc-300 leading-relaxed">
                            {req.address && <>{req.address}, </>}
                            {req.city && <>{req.city}, </>}
                            {req.state && <>{req.state} </>}
                            {req.pincode && <>{req.pincode}, </>}
                            {req.country}
                        </div>
                    </div>
                )}

                <div className="flex items-center justify-between pt-4 border-t border-white/10 flex-wrap gap-4">
                    <div className="flex flex-wrap gap-2">
                        {(['new', 'reviewing', 'quoted', 'accepted', 'rejected', 'completed'] as const).map(s => (
                            <button
                                key={s}
                                onClick={() => updateCustomRequestStatus(req.id, s)}
                                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                                    req.status === s
                                        ? `${STATUS_CONFIG[s]?.bg} ${STATUS_CONFIG[s]?.text} ring-2 ring-white/20 ring-offset-1 ring-offset-zinc-900 border border-white/10`
                                        : 'bg-zinc-800/50 text-zinc-400 hover:bg-zinc-800 border border-white/5 hover:text-white'
                                }`}
                            >
                                {STATUS_CONFIG[s]?.label}
                            </button>
                        ))}
                    </div>
                    <button onClick={() => deleteCustomRequest(req.id)} className="text-red-400 hover:text-red-300 text-sm font-semibold px-3 py-1.5 hover:bg-red-500/10 rounded-lg transition-colors">Delete</button>
                </div>
            </div>
        );
    };

    const renderContactCard = (sub: ContactSubmission) => {
        const cfg = STATUS_CONFIG[sub.status] || { label: sub.status, bg: 'bg-gray-100', text: 'text-gray-800', border: 'border-l-gray-300' };
        return (
            <div key={sub.id} className={`bg-zinc-900/40 backdrop-blur-md rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border-l-4 ${cfg.border} border-y border-r border-white/5 p-5 group transition-all hover:bg-zinc-900/60`}>
                <div className="flex items-start justify-between mb-4">
                    <div>
                        <StatusBadge status={sub.status} />
                        <div className="font-bold text-lg text-white mt-2">{sub.name}</div>
                        {sub.subject && <div className="text-sm text-zinc-400 font-medium mt-0.5">{sub.subject}</div>}
                    </div>
                    <div className="text-xs font-medium text-zinc-500">{formatDate(sub.created_at)}</div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
                    <div className="bg-zinc-950/50 border border-white/5 rounded-xl p-4">
                        <div className="text-xs text-zinc-500 mb-1 uppercase tracking-wider font-semibold">Email</div>
                        <div className="flex items-center gap-2">
                            <span className="text-zinc-300 truncate text-sm font-medium">{sub.email}</span>
                            <button onClick={() => copy(sub.email)} className="text-zinc-600 hover:text-white transition-colors">📋</button>
                        </div>
                    </div>
                    {sub.phone && (
                        <div className="bg-zinc-950/50 border border-white/5 rounded-xl p-4">
                            <div className="text-xs text-zinc-500 mb-1 uppercase tracking-wider font-semibold">Phone</div>
                            <div className="flex items-center gap-2">
                                <span className="text-zinc-300 text-sm font-medium">{sub.phone}</span>
                                <a href={getWhatsAppLink(sub.phone)} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center w-7 h-7 bg-[#25D366]/10 hover:bg-[#25D366]/20 border border-[#25D366]/20 rounded-lg text-[#25D366] transition-colors keep-color shadow-sm" title="Chat on WhatsApp">
                                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                                    </svg>
                                </a>
                            </div>
                        </div>
                    )}
                </div>

                <div className="mb-5 p-4 bg-zinc-950/50 border border-white/5 rounded-xl">
                    <div className="text-xs text-zinc-500 mb-2 uppercase tracking-wider font-semibold">Message</div>
                    <div className="text-zinc-300 text-sm leading-relaxed whitespace-pre-wrap">{sub.message}</div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-white/10 flex-wrap gap-4">
                    <div className="flex flex-wrap gap-2">
                        {(['unread', 'read', 'replied', 'resolved'] as const).map(s => (
                            <button
                                key={s}
                                onClick={() => updateContactStatus(sub.id, s)}
                                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                                    sub.status === s
                                        ? `${STATUS_CONFIG[s]?.bg} ${STATUS_CONFIG[s]?.text} ring-2 ring-white/20 ring-offset-1 ring-offset-zinc-900 border border-white/10`
                                        : 'bg-zinc-800/50 text-zinc-400 hover:bg-zinc-800 border border-white/5 hover:text-white'
                                }`}
                            >
                                {STATUS_CONFIG[s]?.label}
                            </button>
                        ))}
                    </div>
                    <button onClick={() => deleteContactSubmission(sub.id)} className="text-red-400 hover:text-red-300 text-sm font-semibold px-3 py-1.5 hover:bg-red-500/10 rounded-lg transition-colors">Delete</button>
                </div>
            </div>
        );
    };

    const renderCallCard = (call: BookedCall) => {
        const cfg = STATUS_CONFIG[call.status] || { label: call.status, bg: 'bg-gray-100', text: 'text-gray-800', border: 'border-l-gray-300' };
        return (
            <div key={call.id} className={`bg-zinc-900/40 backdrop-blur-md rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border-l-4 ${cfg.border} border-y border-r border-white/5 p-5 group transition-all hover:bg-zinc-900/60`}>
                <div className="flex items-start justify-between mb-4">
                    <div>
                        <StatusBadge status={call.status} />
                        <div className="font-bold text-lg text-white mt-2">{call.name}</div>
                    </div>
                    <div className="text-xs font-medium text-zinc-500">{formatDate(call.created_at)}</div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
                    <div className="bg-zinc-950/50 border border-white/5 rounded-xl p-4">
                        <div className="text-xs text-zinc-500 mb-1 uppercase tracking-wider font-semibold">Email</div>
                        <div className="flex items-center gap-2">
                            <span className="text-zinc-300 truncate text-sm font-medium">{call.email}</span>
                            <button onClick={() => copy(call.email)} className="text-zinc-600 hover:text-white transition-colors" title="Copy Email">📋</button>
                        </div>
                    </div>
                    <div className="bg-zinc-950/50 border border-white/5 rounded-xl p-4">
                        <div className="text-xs text-zinc-500 mb-1 uppercase tracking-wider font-semibold">Phone</div>
                        <div className="flex items-center gap-2">
                            <span className="text-zinc-300 text-sm font-medium">{call.phone}</span>
                            <button onClick={() => copy(call.phone)} className="text-zinc-600 hover:text-white transition-colors" title="Copy Phone">📋</button>
                            <a href={getWhatsAppLink(call.phone)} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center w-7 h-7 bg-[#25D366]/10 hover:bg-[#25D366]/20 border border-[#25D366]/20 rounded-lg text-[#25D366] transition-colors keep-color shadow-sm" title="Chat on WhatsApp">
                                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                                    </svg>
                                </a>
                        </div>
                    </div>
                </div>

                {call.admin_notes && (
                    <div className="mb-5 p-4 bg-amber-500/5 border border-amber-500/10 rounded-xl">
                        <div className="text-xs text-amber-400 mb-2 uppercase tracking-wider font-semibold">Admin Notes</div>
                        <div className="text-zinc-300 text-sm leading-relaxed whitespace-pre-wrap">{call.admin_notes}</div>
                    </div>
                )}

                <div className="flex items-center justify-between pt-4 border-t border-white/10 flex-wrap gap-4">
                    <div className="flex flex-wrap gap-2">
                        {(['new', 'contacted', 'scheduled', 'completed', 'cancelled'] as const).map(s => (
                            <button
                                key={s}
                                onClick={() => updateCallStatus(call.id, s)}
                                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                                    call.status === s
                                        ? `${STATUS_CONFIG[s]?.bg} ${STATUS_CONFIG[s]?.text} ring-2 ring-white/20 ring-offset-1 ring-offset-zinc-900 border border-white/10`
                                        : 'bg-zinc-800/50 text-zinc-400 hover:bg-zinc-800 border border-white/5 hover:text-white'
                                }`}
                            >
                                {STATUS_CONFIG[s]?.label}
                            </button>
                        ))}
                    </div>
                    <button onClick={() => deleteBookedCall(call.id)} className="text-red-400 hover:text-red-300 text-sm font-semibold px-3 py-1.5 hover:bg-red-500/10 rounded-lg transition-colors">Delete</button>
                </div>
            </div>
        );
    };

    const renderPrebookCard = (req: PrebookRequest) => {
        const cfg = STATUS_CONFIG[req.status] || { label: req.status, bg: 'bg-gray-100', text: 'text-gray-800', border: 'border-l-gray-300' };
        return (
            <div key={req.id} className={`bg-zinc-900/40 backdrop-blur-md rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border-l-4 ${cfg.border} border-y border-r border-white/5 p-5 group transition-all hover:bg-zinc-900/60`}>
                <div className="flex items-start justify-between mb-4">
                    <div>
                        <StatusBadge status={req.status} />
                        <div className="font-bold text-lg text-white mt-2">{req.first_name} {req.last_name}</div>
                        <div className="text-sm text-blue-400 font-medium capitalize mt-0.5">{req.product_slug?.replace(/-/g, ' ')}</div>
                    </div>
                    <div className="text-xs font-medium text-zinc-500">{formatDate(req.created_at)}</div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
                    <div className="bg-zinc-950/50 border border-white/5 rounded-xl p-4">
                        <div className="text-xs text-zinc-500 mb-1 uppercase tracking-wider font-semibold">Email</div>
                        <div className="flex items-center gap-2">
                            <span className="text-zinc-300 truncate text-sm font-medium">{req.email}</span>
                            <button onClick={() => copy(req.email)} className="text-zinc-600 hover:text-white transition-colors" title="Copy Email">📋</button>
                        </div>
                    </div>
                    <div className="bg-zinc-950/50 border border-white/5 rounded-xl p-4">
                        <div className="text-xs text-zinc-500 mb-1 uppercase tracking-wider font-semibold">Phone</div>
                        <div className="flex items-center gap-2">
                            <span className="text-zinc-300 text-sm font-medium">{req.phone}</span>
                            <button onClick={() => copy(req.phone)} className="text-zinc-600 hover:text-white transition-colors" title="Copy Phone">📋</button>
                            <a href={getWhatsAppLink(req.phone)} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center w-7 h-7 bg-[#25D366]/10 hover:bg-[#25D366]/20 border border-[#25D366]/20 rounded-lg text-[#25D366] transition-colors keep-color shadow-sm" title="Chat on WhatsApp">
                                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                                    </svg>
                                </a>
                        </div>
                    </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-white/10 flex-wrap gap-4">
                    <div className="flex flex-wrap gap-2">
                        {(['new', 'contacted', 'confirmed', 'completed', 'cancelled'] as const).map(s => (
                            <button
                                key={s}
                                onClick={() => updatePrebookStatus(req.id, s)}
                                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                                    req.status === s
                                        ? `${STATUS_CONFIG[s]?.bg} ${STATUS_CONFIG[s]?.text} ring-2 ring-white/20 ring-offset-1 ring-offset-zinc-900 border border-white/10`
                                        : 'bg-zinc-800/50 text-zinc-400 hover:bg-zinc-800 border border-white/5 hover:text-white'
                                }`}
                            >
                                {STATUS_CONFIG[s]?.label}
                            </button>
                        ))}
                    </div>
                    <button onClick={() => deletePrebookRequest(req.id)} className="text-red-400 hover:text-red-300 text-sm font-semibold px-3 py-1.5 hover:bg-red-500/10 rounded-lg transition-colors">Delete</button>
                </div>
            </div>
        );
    };

    const SearchBar = ({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder: string }) => (
        <div className="bg-zinc-900/40 backdrop-blur-md border border-white/10 rounded-2xl p-4 shadow-[0_8px_30px_rgb(0,0,0,0.12)] mb-6">
            <input
                type="text"
                value={value}
                onChange={e => onChange(e.target.value)}
                placeholder={placeholder}
                className="w-full bg-zinc-950/50 border border-white/5 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-white/30 focus:shadow-[inset_0_0_20px_rgba(255,255,255,0.05)] placeholder:text-zinc-500 transition-all"
            />
        </div>
    );

    const tabLabel: Record<Tab, string> = {
        dashboard: 'Dashboard',
        orders: 'Orders',
        custom: 'Custom Requests',
        contact: 'Contact Messages',
        calls: 'Booked Calls',
        prebooks: 'Prebook Requests',
        subscription: 'Subscription',
    };

    const modalBillingDate = subBillingDate ? new Date(subBillingDate) : null;
    const modalToday = new Date(); modalToday.setHours(0, 0, 0, 0);
    if (modalBillingDate) modalBillingDate.setHours(0, 0, 0, 0);
    const modalDaysUntil = modalBillingDate ? Math.round((modalBillingDate.getTime() - modalToday.getTime()) / 86400000) : null;
    const modalFormattedBilling = modalBillingDate
        ? modalBillingDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })
        : null;

    return (
        <div className={theme === 'light' ? 'theme-light' : ''}>
            <div className="min-h-screen bg-zinc-950 font-sans antialiased text-zinc-100 selection:bg-zinc-800 relative overflow-hidden flex transition-all duration-700">
            {/* Background Static Gradients */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
                <div className="absolute -top-[40%] -right-[20%] w-[70%] h-[70%] bg-blue-600/10 rounded-full blur-[140px] opacity-60" />
                <div className="absolute -bottom-[40%] -left-[20%] w-[70%] h-[70%] bg-emerald-600/10 rounded-full blur-[140px] opacity-60" />
            </div>

            {/* Dark Glass Sidebar */}
            <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-zinc-950/50 backdrop-blur-2xl border-r border-white/10 flex flex-col transform transition-transform duration-300 ease-in-out ${
                sidebarOpen ? 'translate-x-0' : '-translate-x-full'
            } lg:translate-x-0`}>

                <div className="p-6 border-b border-white/10">
                    <div className="text-white font-serif font-bold text-lg tracking-tight">3 Layered</div>
                    <div className="text-zinc-500 text-xs mt-0.5 font-light">Admin Portal</div>
                </div>

                <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
                    {navItems.map(item => (
                        <button
                            key={item.id}
                            onClick={() => { setActiveTab(item.id); setSidebarOpen(false); }}
                            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm transition-all ${
                                activeTab === item.id
                                    ? 'bg-white/10 text-white shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)] font-medium'
                                    : 'text-zinc-400 hover:text-white hover:bg-white/5 font-light'
                            }`}
                        >
                            <span className="flex items-center gap-3">
                                <span className="text-base">{item.icon}</span>
                                <span>{item.label}</span>
                            </span>
                            {item.badge > 0 && (
                                <span className="bg-blue-500/20 text-blue-400 border border-blue-500/30 text-xs font-semibold px-2 py-0.5 rounded-full min-w-[20px] text-center shadow-[0_0_10px_rgba(59,130,246,0.3)] keep-color">
                                    {item.badge}
                                </span>
                            )}
                        </button>
                    ))}
                </nav>

                <div className="p-4 border-t border-white/10">
                    <button
                        onClick={handleLogout}
                        className="w-full text-zinc-500 hover:text-red-400 text-sm py-2.5 transition-colors rounded-xl hover:bg-red-500/10 font-medium"
                    >
                        Sign Out
                    </button>
                </div>
            </aside>

            {sidebarOpen && (
                <div className="fixed inset-0 z-40 bg-zinc-950/80 backdrop-blur-sm lg:hidden" onClick={() => setSidebarOpen(false)} />
            )}

            <div className="flex-1 lg:ml-64 flex flex-col min-h-screen relative z-10 w-full overflow-x-hidden">

                <header className="bg-zinc-950/40 backdrop-blur-xl border-b border-white/10 px-4 sm:px-6 py-4 flex items-center justify-between sticky top-0 z-30">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                            className="lg:hidden p-2 rounded-xl border border-white/10 hover:bg-white/5 text-zinc-300 text-xl leading-none transition-colors"
                        >
                            ☰
                        </button>
                        <h1 className="text-lg font-serif font-semibold text-white tracking-tight">{tabLabel[activeTab]}</h1>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={toggleTheme}
                            className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all text-lg keep-color"
                            title="Toggle Theme"
                        >
                            {theme === 'dark' ? '☀️' : '🌙'}
                        </button>
                        {totalAlerts > 0 && (
                            <span className="bg-blue-500/20 text-blue-400 border border-blue-500/30 text-xs font-semibold px-3 py-1.5 rounded-full shadow-[0_0_15px_rgba(59,130,246,0.2)] keep-color">
                                {totalAlerts} new
                            </span>
                        )}
                        <button
                            onClick={fetchAllData}
                            className="text-sm text-zinc-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 px-4 py-2 rounded-xl transition-all font-medium active:scale-95"
                        >
                            Refresh
                        </button>
                        {/* Account Circle */}
                        <button
                            onClick={() => setShowAccountModal(true)}
                            className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-emerald-500 text-white text-sm font-bold flex items-center justify-center hover:scale-105 transition-all shadow-[0_0_20px_rgba(59,130,246,0.3)] ring-2 ring-white/20 keep-color"
                            title="My Subscription"
                        >
                            JG
                        </button>
                    </div>
                </header>

                {/* Billing reminder strip */}
                {modalDaysUntil !== null && modalDaysUntil <= 2 && (
                    <div className={'px-4 sm:px-6 py-3 flex items-center justify-between text-sm font-medium flex-shrink-0 ' + (
                        subPaymentPending || payNotifSent ? 'bg-indigo-600 text-white' :
                        modalDaysUntil <= 0 ? 'bg-red-600 text-white' :
                        'bg-amber-500 text-white'
                    )}>
                        <span>
                            {subPaymentPending || payNotifSent
                                ? '⏳  Payment confirmation pending — PP DEV Works will verify shortly.'
                                : modalDaysUntil < 0
                                ? '🔴  Payment overdue by ' + Math.abs(modalDaysUntil) + (Math.abs(modalDaysUntil) === 1 ? ' day' : ' days') + '. Site may be suspended.'
                                : modalDaysUntil === 0
                                ? '🔔  Payment is due today.'
                                : '⚠️  Payment due in ' + modalDaysUntil + (modalDaysUntil === 1 ? ' day.' : ' days.')}
                        </span>
                        <button
                            onClick={() => setShowAccountModal(true)}
                            className="ml-4 underline font-bold opacity-90 hover:opacity-100 whitespace-nowrap"
                        >
                            Pay now →
                        </button>
                    </div>
                )}

                <main className="flex-1 p-4 sm:p-6">
                    {loading ? (
                        <div className="flex items-center justify-center h-64">
                            <div className="text-center">
                                <div className="text-4xl mb-3 animate-pulse">🏛️</div>
                                <div className="text-gray-500 font-medium">Loading...</div>
                            </div>
                        </div>
                    ) : (
                        <>
                            {activeTab === 'dashboard' && (
                                <div className="space-y-6">
                                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                                        <div className="bg-zinc-900/40 backdrop-blur-md border border-white/10 rounded-2xl p-5 shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
                                            <div className="text-xs text-zinc-400 mb-1 uppercase tracking-wider font-medium">Active Orders</div>
                                            <div className="text-3xl font-bold text-white">{stats.activeOrders}</div>
                                            <div className="text-xs text-amber-400 font-semibold mt-1 keep-color">{stats.pendingOrders} pending</div>
                                        </div>
                                        <div className="bg-zinc-900/40 backdrop-blur-md border border-white/10 rounded-2xl p-5 shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
                                            <div className="text-xs text-zinc-400 mb-1 uppercase tracking-wider font-medium">Revenue</div>
                                            <div className="text-2xl font-bold text-white">₹{stats.totalRevenue.toLocaleString('en-IN')}</div>
                                            <div className="text-xs text-zinc-500 mt-1">delivered orders</div>
                                        </div>
                                        <div className="bg-zinc-900/40 backdrop-blur-md border border-white/10 rounded-2xl p-5 shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
                                            <div className="text-xs text-zinc-400 mb-1 uppercase tracking-wider font-medium">Today</div>
                                            <div className="text-3xl font-bold text-white">{stats.todayOrders.length}</div>
                                            <div className="text-xs text-emerald-400 font-semibold mt-1 keep-color">₹{stats.todayOrders.reduce((s, o) => s + o.total, 0).toLocaleString('en-IN')}</div>
                                        </div>
                                        <div className="bg-zinc-900/40 backdrop-blur-md border border-white/10 rounded-2xl p-5 shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
                                            <div className="text-xs text-zinc-400 mb-1 uppercase tracking-wider font-medium">Needs Attention</div>
                                            <div className={`text-3xl font-bold keep-color ${totalAlerts > 0 ? 'text-blue-400' : 'text-emerald-400'}`}>{totalAlerts}</div>
                                            <div className="text-xs text-zinc-500 mt-1">{totalAlerts === 0 ? 'all clear!' : 'unread items'}</div>
                                        </div>
                                    </div>

                                    {totalAlerts > 0 && (
                                        <div className="bg-blue-500/10 border border-blue-500/20 backdrop-blur-md rounded-2xl p-5 keep-color">
                                            <h3 className="font-bold text-blue-400 mb-4 text-sm uppercase tracking-wider">Action Required</h3>
                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                                {stats.pendingOrders > 0 && (
                                                    <button onClick={() => setActiveTab('orders')} className="bg-zinc-900/50 rounded-xl p-4 text-center hover:bg-zinc-800/50 transition-all border border-white/5 hover:border-white/10">
                                                        <div className="text-2xl font-bold text-amber-400 keep-color">{stats.pendingOrders}</div>
                                                        <div className="text-xs text-zinc-400 mt-1">Pending Orders</div>
                                                    </button>
                                                )}
                                                {stats.unreadContacts > 0 && (
                                                    <button onClick={() => setActiveTab('contact')} className="bg-zinc-900/50 rounded-xl p-4 text-center hover:bg-zinc-800/50 transition-all border border-white/5 hover:border-white/10">
                                                        <div className="text-2xl font-bold text-red-400 keep-color">{stats.unreadContacts}</div>
                                                        <div className="text-xs text-zinc-400 mt-1">Unread Messages</div>
                                                    </button>
                                                )}
                                                {stats.newCustom > 0 && (
                                                    <button onClick={() => setActiveTab('custom')} className="bg-zinc-900/50 rounded-xl p-4 text-center hover:bg-zinc-800/50 transition-all border border-white/5 hover:border-white/10">
                                                        <div className="text-2xl font-bold text-orange-400 keep-color">{stats.newCustom}</div>
                                                        <div className="text-xs text-zinc-400 mt-1">Custom Requests</div>
                                                    </button>
                                                )}
                                                {stats.newCalls > 0 && (
                                                    <button onClick={() => setActiveTab('calls')} className="bg-zinc-900/50 rounded-xl p-4 text-center hover:bg-zinc-800/50 transition-all border border-white/5 hover:border-white/10">
                                                        <div className="text-2xl font-bold text-blue-400 keep-color">{stats.newCalls}</div>
                                                        <div className="text-xs text-zinc-400 mt-1">Booked Calls</div>
                                                    </button>
                                                )}
                                                {stats.newPrebooks > 0 && (
                                                    <button onClick={() => setActiveTab('prebooks')} className="bg-zinc-900/50 rounded-xl p-4 text-center hover:bg-zinc-800/50 transition-all border border-white/5 hover:border-white/10">
                                                        <div className="text-2xl font-bold text-purple-400 keep-color">{stats.newPrebooks}</div>
                                                        <div className="text-xs text-zinc-400 mt-1">Prebook Requests</div>
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    <div>
                                        <div className="flex items-center justify-between mb-4">
                                            <h3 className="text-base font-bold text-white tracking-wide">Recent Active Orders</h3>
                                            <button onClick={() => setActiveTab('orders')} className="text-sm text-zinc-400 hover:text-white transition-colors font-medium">View all →</button>
                                        </div>
                                        {activeOrders.length === 0 ? (
                                            <div className="bg-zinc-900/30 backdrop-blur-md rounded-2xl p-10 text-center text-zinc-500 border border-white/5">
                                                <div className="text-4xl mb-3 opacity-50">✅</div>
                                                No active orders right now
                                            </div>
                                        ) : (
                                            <div className="space-y-4">{activeOrders.slice(0, 3).map(renderOrderCard)}</div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {activeTab === 'orders' && (
                                <div className="space-y-6">
                                    <div className="bg-zinc-900/40 backdrop-blur-md border border-white/10 rounded-2xl p-4 shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
                                        <div className="flex flex-col sm:flex-row gap-3">
                                            <input
                                                type="text"
                                                placeholder="Search by name, email, or order number..."
                                                value={orderSearch}
                                                onChange={e => setOrderSearch(e.target.value)}
                                                className="flex-1 bg-zinc-950/50 border border-white/5 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-white/30 focus:shadow-[inset_0_0_20px_rgba(255,255,255,0.05)] placeholder:text-zinc-500 transition-all"
                                            />
                                            <select
                                                value={sortBy}
                                                onChange={e => setSortBy(e.target.value as any)}
                                                className="bg-zinc-950/50 border border-white/5 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-white/30 transition-all min-w-[160px]"
                                            >
                                                <option value="newest" className="bg-zinc-900">Newest First</option>
                                                <option value="oldest" className="bg-zinc-900">Oldest First</option>
                                                <option value="amount" className="bg-zinc-900">Highest Amount</option>
                                            </select>
                                            <button
                                                onClick={exportOrdersCSV}
                                                className="bg-white text-zinc-900 px-5 py-3 rounded-xl text-sm font-bold hover:bg-zinc-200 transition-all shadow-[0_0_15px_rgba(255,255,255,0.1)] hover:shadow-[0_0_25px_rgba(255,255,255,0.2)] whitespace-nowrap active:scale-95"
                                            >
                                                Export CSV
                                            </button>
                                        </div>
                                    </div>

                                    <div>
                                        <div className="flex items-center gap-3 mb-5">
                                            <h2 className="text-lg font-bold text-white tracking-wide">Active Orders</h2>
                                            <span className="bg-blue-500/20 text-blue-400 border border-blue-500/30 text-xs font-semibold px-3 py-1 rounded-full keep-color">{activeOrders.length}</span>
                                        </div>
                                        {activeOrders.length === 0 ? (
                                            <div className="bg-zinc-900/30 backdrop-blur-md rounded-2xl p-10 text-center text-zinc-500 border border-white/5">
                                                <div className="text-4xl mb-3 opacity-50">📭</div>
                                                No active orders found
                                            </div>
                                        ) : (
                                            <div className="space-y-4">{activeOrders.map(renderOrderCard)}</div>
                                        )}
                                    </div>

                                    <div>
                                        <button
                                            onClick={() => setShowPastOrders(!showPastOrders)}
                                            className="flex items-center gap-3 mb-5 w-full text-left group"
                                        >
                                            <h2 className="text-lg font-bold text-zinc-500 group-hover:text-zinc-300 transition-colors tracking-wide">Past Orders</h2>
                                            <span className="bg-white/5 border border-white/10 text-zinc-400 text-xs font-semibold px-3 py-1 rounded-full keep-color">{pastOrders.length}</span>
                                            <span className="text-zinc-600 group-hover:text-zinc-400 ml-auto text-sm transition-colors">{showPastOrders ? '▲ Hide' : '▼ Show'}</span>
                                        </button>
                                        {showPastOrders && (
                                            pastOrders.length === 0 ? (
                                                <div className="bg-zinc-900/30 backdrop-blur-md rounded-2xl p-10 text-center text-zinc-500 border border-white/5">No past orders</div>
                                            ) : (
                                                <div className="space-y-4">{pastOrders.map(renderOrderCard)}</div>
                                            )
                                        )}
                                    </div>
                                </div>
                            )}

                            {activeTab === 'custom' && (
                                <div>
                                    <SearchBar value={customSearch} onChange={setCustomSearch} placeholder="Search by name or email..." />
                                    {filteredCustom.length === 0 ? (
                                        <div className="bg-zinc-900/30 backdrop-blur-md rounded-2xl p-12 text-center text-zinc-500 border border-white/5 flex flex-col items-center">
                                            <div className="text-5xl mb-4 opacity-40">✨</div>
                                            <p className="text-lg font-medium text-zinc-400">No custom requests yet</p>
                                        </div>
                                    ) : (
                                        <div className="space-y-4">{filteredCustom.map(renderCustomCard)}</div>
                                    )}
                                </div>
                            )}

                            {activeTab === 'contact' && (
                                <div>
                                    <SearchBar value={contactSearch} onChange={setContactSearch} placeholder="Search messages..." />
                                    {filteredContact.length === 0 ? (
                                        <div className="bg-zinc-900/30 backdrop-blur-md rounded-2xl p-12 text-center text-zinc-500 border border-white/5 flex flex-col items-center">
                                            <div className="text-5xl mb-4 opacity-40">📨</div>
                                            <p className="text-lg font-medium text-zinc-400">No contact messages</p>
                                        </div>
                                    ) : (
                                        <div className="space-y-4">{filteredContact.map(renderContactCard)}</div>
                                    )}
                                </div>
                            )}

                            {activeTab === 'calls' && (
                                <div>
                                    <SearchBar value={callSearch} onChange={setCallSearch} placeholder="Search by name, email, or phone..." />
                                    {filteredCalls.length === 0 ? (
                                        <div className="bg-zinc-900/30 backdrop-blur-md rounded-2xl p-12 text-center text-zinc-500 border border-white/5 flex flex-col items-center">
                                            <div className="text-5xl mb-4 opacity-40">📞</div>
                                            <p className="text-lg font-medium text-zinc-400">No booked calls</p>
                                        </div>
                                    ) : (
                                        <div className="space-y-4">{filteredCalls.map(renderCallCard)}</div>
                                    )}
                                </div>
                            )}

                            {activeTab === 'prebooks' && (
                                <div>
                                    <SearchBar value={prebookSearch} onChange={setPrebookSearch} placeholder="Search by name, email, or product..." />
                                    {filteredPrebooks.length === 0 ? (
                                        <div className="bg-zinc-900/30 backdrop-blur-md rounded-2xl p-12 text-center text-zinc-500 border border-white/5 flex flex-col items-center">
                                            <div className="text-5xl mb-4 opacity-40">🎫</div>
                                            <p className="text-lg font-medium text-zinc-400">No prebook requests</p>
                                        </div>
                                    ) : (
                                        <div className="space-y-4">{filteredPrebooks.map(renderPrebookCard)}</div>
                                    )}
                                </div>
                            )}

                        </>
                    )}
                </main>
            </div>

            {/* ── PP DEV Works Account Modal ── */}
            {showAccountModal && (
                <div className="fixed inset-0 z-[200] bg-zinc-950/80 backdrop-blur-3xl flex flex-col overflow-y-auto">

                    {/* Top bar */}
                    <div className="sticky top-0 z-10 bg-zinc-950/50 border-b border-white/5 px-6 py-4 flex items-center justify-between flex-shrink-0 backdrop-blur-md">
                        <div className="flex items-center gap-2.5">
                            <div className="w-5 h-5 rounded bg-gradient-to-br from-blue-500 to-emerald-500 flex-shrink-0" />
                            <div>
                                <span className="text-sm font-bold font-serif text-white tracking-tight">3 Layered</span>
                                <p className="text-[11px] text-zinc-400 font-medium leading-none mt-0.5">{subClientName}</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setShowAccountModal(false)}
                            className="w-8 h-8 flex items-center justify-center rounded-lg text-zinc-500 hover:text-white hover:bg-white/5 transition-all text-lg leading-none"
                        >
                            ✕
                        </button>
                    </div>

                    {/* Content */}
                    <div className="flex-1 w-full max-w-2xl mx-auto px-6 py-12">

                        {/* Owner */}
                        <div className="mb-10">
                            <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.15em] mb-5">Owner</p>
                            <div className="flex items-start justify-between gap-4">
                                <div>
                                    <h2 className="text-3xl font-bold text-white tracking-tight leading-none">{subClientName}</h2>
                                    <p className="text-base text-zinc-400 mt-2 font-medium">{subWebsiteName}</p>
                                </div>
                                {subWebsiteUrl && (
                                    <a
                                        href={subWebsiteUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex-shrink-0 flex items-center gap-1.5 text-xs font-semibold text-zinc-400 hover:text-white border border-white/10 hover:border-white/30 bg-white/5 hover:bg-white/10 rounded-lg px-3 py-2 transition-all"
                                    >
                                        {subWebsiteUrl.replace('https://', '').replace('http://', '')}
                                        <span className="opacity-40">↗</span>
                                    </a>
                                )}
                            </div>
                        </div>

                        <div className="border-t border-white/5 mb-10" />

                        {/* Subscription */}
                        <div className="mb-10">
                            <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.15em] mb-5">Subscription</p>
                            <div className="grid grid-cols-3 gap-3">
                                <div className="bg-zinc-900/50 border border-white/5 rounded-2xl p-5">
                                    <p className="text-xs text-zinc-500 mb-2">Plan</p>
                                    <p className="text-base font-bold text-white leading-tight">{subPlanName}</p>
                                </div>
                                <div className="bg-zinc-900/50 border border-white/5 rounded-2xl p-5">
                                    <p className="text-xs text-zinc-500 mb-2">Monthly</p>
                                    <p className="text-base font-bold text-white leading-tight">₹{Number(subAmount).toLocaleString('en-IN')}</p>
                                </div>
                                <div className={
                                    'rounded-2xl p-5 border ' + (
                                        modalDaysUntil !== null && modalDaysUntil < 0 ? 'bg-red-500/10 border-red-500/20' :
                                        modalDaysUntil !== null && modalDaysUntil <= 2 ? 'bg-amber-500/10 border-amber-500/20' : 'bg-zinc-900/50 border-white/5'
                                    )
                                }>
                                    <p className="text-xs text-zinc-500 mb-2">Next Billing</p>
                                    {modalFormattedBilling ? (
                                        <>
                                            <p className="text-base font-bold text-white leading-tight">{modalFormattedBilling}</p>
                                            {modalDaysUntil !== null && (
                                                <p className={
                                                    'text-[11px] mt-1.5 font-semibold ' + (
                                                        modalDaysUntil < 0 ? 'text-red-400' :
                                                        modalDaysUntil <= 2 ? 'text-amber-400' : 'text-zinc-500'
                                                    )
                                                }>
                                                    {modalDaysUntil < 0
                                                        ? Math.abs(modalDaysUntil) + ' d overdue'
                                                        : modalDaysUntil === 0 ? 'Due today'
                                                        : modalDaysUntil === 1 ? 'Tomorrow'
                                                        : 'In ' + modalDaysUntil + ' days'}
                                                </p>
                                            )}
                                        </>
                                    ) : (
                                        <p className="text-base font-bold text-zinc-600">—</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="border-t border-white/5 mb-10" />

                        {/* Payment */}
                        <div className="mb-10">
                            <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.15em] mb-6">Pay This Month</p>
                            {subQrCodeUrl || subPaymentLink ? (
                                <div className="grid grid-cols-2 gap-8 items-start">

                                    {/* Left — QR + payment details */}
                                    <div className="space-y-4">
                                        {subQrCodeUrl ? (
                                            <img
                                                src={subQrCodeUrl}
                                                alt="Payment QR Code"
                                                className="w-full max-w-[200px] aspect-square rounded-2xl border border-white/10 shadow-[0_0_30px_rgba(255,255,255,0.05)]"
                                            />
                                        ) : (
                                            <div className="w-full max-w-[200px] aspect-square rounded-2xl bg-zinc-900/50 border border-dashed border-white/10 flex items-center justify-center text-xs text-zinc-500">
                                                No QR set
                                            </div>
                                        )}
                                        <div className="space-y-2 pt-1 mt-2">
                                            <div className="flex items-center gap-2 text-sm text-zinc-400">
                                                <span className="text-zinc-500 text-xs font-semibold uppercase tracking-wider w-14">UPI</span>
                                                <span className="font-mono font-bold text-emerald-400 text-xs">{subPaymentLink || '—'}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm text-zinc-400">
                                                <span className="text-zinc-500 text-xs font-semibold uppercase tracking-wider w-14">Phone</span>
                                                <span className="font-bold text-emerald-400 text-xs">+91 99299 20521</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Right — amount + actions */}
                                    <div className="space-y-5 pt-1">
                                        <div>
                                            <p className="text-4xl font-bold text-white tracking-tight">₹{Number(subAmount).toLocaleString('en-IN')}</p>
                                            {modalFormattedBilling && (
                                                <p className="text-sm text-zinc-500 font-medium mt-1.5">Due {modalFormattedBilling}</p>
                                            )}
                                        </div>
                                        <div className="space-y-3">
                                            {subPaymentLink && (
                                                <a
                                                    href={subPaymentLink}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center justify-center gap-2 w-full bg-blue-500/10 text-blue-400 border border-blue-500/20 py-3.5 rounded-xl font-semibold hover:bg-blue-500/20 transition-all text-sm keep-color"
                                                >
                                                    💳  Pay via UPI App
                                                </a>
                                            )}
                                            {subPaymentPending || payNotifSent ? (
                                                <div className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl text-sm font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-inner keep-color">
                                                    ⏳  Awaiting confirmation
                                                </div>
                                            ) : (
                                                <button
                                                    onClick={sendPaymentNotification}
                                                    disabled={payNotifSending}
                                                    className="w-full py-3.5 rounded-xl font-bold text-sm border-2 border-white/10 text-white hover:bg-white/10 hover:border-white/20 transition-all disabled:opacity-40"
                                                >
                                                    {payNotifSending ? 'Sending...' : "✓  I've Paid — Notify Developer"}
                                                </button>
                                            )}
                                        </div>
                                    </div>

                                </div>
                            ) : (
                                <div className="bg-zinc-900/50 border border-white/5 rounded-2xl p-10 text-center text-sm text-zinc-500">
                                    Payment details not configured yet
                                </div>
                            )}
                        </div>

                        <div className="border-t border-white/5 mb-10" />

                        {/* Contact Support */}
                        <div className="mb-12">
                            <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.15em] mb-5">Contact Developer</p>
                            <div className="flex items-center justify-between bg-zinc-900/50 border border-white/5 rounded-2xl px-5 py-4">
                                <div>
                                    <p className="text-sm font-semibold text-white">PP DEV Works</p>
                                    <p className="text-xs text-zinc-400 mt-0.5">+91 99299 20521</p>
                                </div>
                                <a
                                    href="https://wa.me/919929920521"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 bg-[#25D366]/20 border border-[#25D366]/30 text-[#25D366] text-sm font-bold px-4 py-2.5 rounded-xl hover:bg-[#25D366]/30 transition-colors keep-color"
                                >
                                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                                    </svg>
                                    Chat on WhatsApp
                                </a>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="border-t border-white/5 pt-8 pb-4 flex items-center justify-center gap-2">
                            <div className="w-4 h-4 rounded-full bg-gradient-to-br from-blue-400 to-emerald-500 shadow-[0_0_10px_rgba(59,130,246,0.5)] flex-shrink-0" />
                            <p className="text-xs text-zinc-500">Managed by <span className="font-bold text-zinc-300">PP DEV Works</span></p>
                        </div>

                    </div>
                </div>
            )}
        </div>
        </div>
    );
}

