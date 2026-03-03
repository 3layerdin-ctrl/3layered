'use client';

import { useState, useEffect } from 'react';

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

type Tab = 'dashboard' | 'orders' | 'custom' | 'contact' | 'calls' | 'prebooks';

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
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${cfg.bg} ${cfg.text}`}>
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

    useEffect(() => {
        if (sessionStorage.getItem('admin_authenticated') === 'true') {
            setIsAuthenticated(true);
            fetchAllData();
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

    const handleLogout = () => {
        setIsAuthenticated(false);
        sessionStorage.removeItem('admin_authenticated');
        document.cookie = 'admin_authenticated=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    };

    const fetchAllData = async () => {
        setLoading(true);
        try {
            await Promise.all([fetchOrders(), fetchCustomRequests(), fetchContactSubmissions(), fetchBookedCalls(), fetchPrebookRequests()]);
        } finally {
            setLoading(false);
        }
    };

    const fetchOrders = async () => {
        const res = await fetch(`/api/orders?password=${encodeURIComponent(ADMIN_PASS)}`);
        const data = await res.json();
        if (data.orders) setOrders(data.orders);
    };

    const fetchCustomRequests = async () => {
        const res = await fetch(`/api/custom-requests?password=${encodeURIComponent(ADMIN_PASS)}`);
        const data = await res.json();
        if (data.requests) setCustomRequests(data.requests);
    };

    const fetchContactSubmissions = async () => {
        const res = await fetch(`/api/contact?password=${encodeURIComponent(ADMIN_PASS)}`);
        const data = await res.json();
        if (data.submissions) setContactSubmissions(data.submissions);
    };

    const fetchBookedCalls = async () => {
        const res = await fetch(`/api/booked-calls?password=${encodeURIComponent(ADMIN_PASS)}`);
        const data = await res.json();
        if (data.bookings) setBookedCalls(data.bookings);
    };

    const fetchPrebookRequests = async () => {
        const res = await fetch(`/api/prebook-requests?password=${encodeURIComponent(ADMIN_PASS)}`);
        const data = await res.json();
        if (data.requests) setPrebookRequests(data.requests);
    };

    const patchOrder = async (orderId: string, payload: object) => {
        await fetch('/api/orders', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ orderId, adminPassword: ADMIN_PASS, ...payload }),
        });
        await fetchOrders();
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
        await fetch(`/api/orders?orderId=${orderId}&password=${encodeURIComponent(ADMIN_PASS)}`, { method: 'DELETE' });
        await fetchOrders();
    };

    const updateCustomRequestStatus = async (id: string, status: string) => {
        await fetch('/api/custom-requests', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ requestId: id, status, adminPassword: ADMIN_PASS }),
        });
        await fetchCustomRequests();
    };

    const deleteCustomRequest = async (id: string) => {
        if (!confirm('Delete this request?')) return;
        await fetch(`/api/custom-requests?requestId=${id}&password=${encodeURIComponent(ADMIN_PASS)}`, { method: 'DELETE' });
        await fetchCustomRequests();
    };

    const updateContactStatus = async (id: string, status: string) => {
        await fetch('/api/contact', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ submissionId: id, status, adminPassword: ADMIN_PASS }),
        });
        await fetchContactSubmissions();
    };

    const deleteContact = async (id: string) => {
        if (!confirm('Delete this message?')) return;
        await fetch(`/api/contact?submissionId=${id}&password=${encodeURIComponent(ADMIN_PASS)}`, { method: 'DELETE' });
        await fetchContactSubmissions();
    };

    const updateCallStatus = async (id: string, status: string) => {
        await fetch('/api/booked-calls', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ bookingId: id, status, adminPassword: ADMIN_PASS }),
        });
        await fetchBookedCalls();
    };

    const deleteCall = async (id: string) => {
        if (!confirm('Delete this booking?')) return;
        await fetch(`/api/booked-calls?bookingId=${id}&password=${encodeURIComponent(ADMIN_PASS)}`, { method: 'DELETE' });
        await fetchBookedCalls();
    };

    const updatePrebookStatus = async (id: string, status: string) => {
        await fetch('/api/prebook-requests', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ requestId: id, status, adminPassword: ADMIN_PASS }),
        });
        await fetchPrebookRequests();
    };

    const deletePrebook = async (id: string) => {
        if (!confirm('Delete this prebook?')) return;
        await fetch(`/api/prebook-requests?requestId=${id}&password=${encodeURIComponent(ADMIN_PASS)}`, { method: 'DELETE' });
        await fetchPrebookRequests();
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
        const csv = [headers, ...rows].map(r => r.map(v => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\n');
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
            <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
                <div className="w-full max-w-sm bg-white rounded-2xl shadow-2xl p-8">
                    <div className="text-center mb-8">
                        <div className="text-5xl mb-3">🏛️</div>
                        <h1 className="text-2xl font-bold text-gray-900">3 Layered Admin</h1>
                        <p className="text-gray-400 text-sm mt-1">Sign in to continue</p>
                    </div>
                    <div className="space-y-4">
                        <input
                            type="password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && handleLogin()}
                            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
                            placeholder="Admin password"
                            autoFocus
                        />
                        {loginError && <p className="text-red-600 text-sm">{loginError}</p>}
                        <button
                            onClick={handleLogin}
                            className="w-full bg-gray-900 text-white py-3 rounded-xl font-medium hover:bg-gray-800 transition-colors"
                        >
                            Sign In
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    const renderOrderCard = (order: Order) => {
        const cfg = STATUS_CONFIG[order.status] || { label: order.status, bg: 'bg-gray-100', text: 'text-gray-800', border: 'border-l-gray-300' };
        const isActive = ACTIVE_ORDER_STATUSES.includes(order.status);

        return (
            <div key={order.id} className={`bg-white rounded-xl shadow-sm border-l-4 ${cfg.border} border border-gray-100 p-5 ${!isActive ? 'opacity-70' : ''}`}>
                <div className="flex items-start justify-between mb-4">
                    <div>
                        <StatusBadge status={order.status} />
                        <div className="font-bold text-gray-900 mt-1 font-mono text-sm">{order.order_number}</div>
                    </div>
                    <div className="text-right">
                        {order.discount && order.discount > 0 ? (
                            <>
                                <div className="text-xs text-gray-400 line-through">₹{(order.total + order.discount).toLocaleString('en-IN')}</div>
                                <div className="text-xl font-bold text-green-700">₹{order.total.toLocaleString('en-IN')}</div>
                                {order.coupon_code && <div className="text-xs text-green-600 font-medium">{order.coupon_code} −₹{order.discount}</div>}
                            </>
                        ) : (
                            <div className="text-xl font-bold text-gray-900">₹{order.total.toLocaleString('en-IN')}</div>
                        )}
                        <div className="text-xs text-gray-400 mt-0.5">{formatDate(order.created_at)}</div>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-4 text-sm">
                    <div className="bg-gray-50 rounded-lg p-3">
                        <div className="text-xs text-gray-400 mb-0.5 uppercase tracking-wide">Customer</div>
                        <div className="font-semibold text-gray-900">{order.customer_name}</div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3">
                        <div className="text-xs text-gray-400 mb-0.5 uppercase tracking-wide">Email</div>
                        <div className="flex items-center gap-1">
                            <span className="text-gray-700 truncate">{order.customer_email}</span>
                            <button onClick={() => copy(order.customer_email)} title="Copy" className="text-gray-300 hover:text-gray-600 flex-shrink-0">📋</button>
                        </div>
                    </div>
                    {order.customer_phone && (
                        <div className="bg-gray-50 rounded-lg p-3">
                            <div className="text-xs text-gray-400 mb-0.5 uppercase tracking-wide">Phone</div>
                            <div className="flex items-center gap-2">
                                <span className="text-gray-700">{order.customer_phone}</span>
                                <button onClick={() => copy(order.customer_phone || '')} title="Copy" className="text-gray-300 hover:text-gray-600">📋</button>
                                <a href={getWhatsAppLink(order.customer_phone)} target="_blank" rel="noopener noreferrer" className="text-green-500 hover:text-green-700 text-xs font-bold bg-green-50 px-2 py-0.5 rounded-full">WA</a>
                            </div>
                        </div>
                    )}
                    <div className="bg-gray-50 rounded-lg p-3">
                        <div className="text-xs text-gray-400 mb-0.5 uppercase tracking-wide">Payment</div>
                        <div className="flex items-center gap-2">
                            <span className="text-gray-700">{order.payment_method === 'cod' ? 'COD' : 'Online'}</span>
                            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                                order.payment_status === 'paid' || order.payment_status === 'completed'
                                    ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                            }`}>
                                {order.payment_status || 'pending'}
                            </span>
                        </div>
                    </div>
                    {order.razorpay_payment_id && (
                        <div className="bg-gray-50 rounded-lg p-3 sm:col-span-2">
                            <div className="text-xs text-gray-400 mb-0.5 uppercase tracking-wide">Razorpay ID</div>
                            <div className="flex items-center gap-1">
                                <span className="font-mono text-xs text-gray-600">{order.razorpay_payment_id}</span>
                                <button onClick={() => copy(order.razorpay_payment_id || '')} className="text-gray-300 hover:text-gray-600">📋</button>
                            </div>
                        </div>
                    )}
                </div>

                {order.customer_address && (
                    <div className="mb-4 p-3 bg-blue-50 rounded-lg text-sm">
                        <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-semibold text-blue-600 uppercase tracking-wide">Shipping Address</span>
                            <button onClick={() => {
                                const a = order.customer_address;
                                copy(`${a.address}${a.apartment ? ', ' + a.apartment : ''}, ${a.city}, ${a.state} ${a.pincode}, ${a.country}`);
                            }} className="text-xs text-blue-400 hover:text-blue-600">📋 Copy</button>
                        </div>
                        <div className="text-gray-700">
                            {order.customer_address.address}{order.customer_address.apartment && `, ${order.customer_address.apartment}`},{' '}
                            {order.customer_address.city}, {order.customer_address.state} {order.customer_address.pincode}, {order.customer_address.country}
                        </div>
                    </div>
                )}

                <div className="mb-4">
                    <div className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Items Ordered</div>
                    <div className="space-y-1">
                        {order.items.map((item: any, i: number) => (
                            <div key={i} className="flex justify-between text-sm">
                                <span className="text-gray-700">{item.productName} × {item.quantity}</span>
                                <span className="font-medium text-gray-900">₹{item.totalPrice?.toLocaleString('en-IN')}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                    <div>
                        <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1 block">Tracking Number</label>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={trackingInputs[order.id] ?? ''}
                                onChange={e => setTrackingInputs(p => ({ ...p, [order.id]: e.target.value }))}
                                onKeyDown={e => e.key === 'Enter' && saveTrackingNumber(order.id)}
                                placeholder="e.g. DTDC1234567890"
                                className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 min-w-0"
                            />
                            <button
                                onClick={() => saveTrackingNumber(order.id)}
                                disabled={savingTracking[order.id]}
                                className="bg-gray-900 text-white px-3 py-2 rounded-lg text-xs font-semibold hover:bg-gray-700 disabled:opacity-50 whitespace-nowrap"
                            >
                                {savingTracking[order.id] ? '...' : 'Save'}
                            </button>
                        </div>
                    </div>
                    <div>
                        <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1 block">Admin Notes</label>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={notesInputs[order.id] ?? ''}
                                onChange={e => setNotesInputs(p => ({ ...p, [order.id]: e.target.value }))}
                                onKeyDown={e => e.key === 'Enter' && saveAdminNotes(order.id)}
                                placeholder="Internal notes..."
                                className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 min-w-0"
                            />
                            <button
                                onClick={() => saveAdminNotes(order.id)}
                                disabled={savingNotes[order.id]}
                                className="bg-gray-900 text-white px-3 py-2 rounded-lg text-xs font-semibold hover:bg-gray-700 disabled:opacity-50 whitespace-nowrap"
                            >
                                {savingNotes[order.id] ? '...' : 'Save'}
                            </button>
                        </div>
                    </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-gray-100 flex-wrap gap-2">
                    <div className="flex flex-wrap gap-1.5">
                        {(['pending', 'processing', 'shipped', 'delivered', 'cancelled'] as const).map(s => (
                            <button
                                key={s}
                                onClick={() => patchOrder(order.id, { status: s })}
                                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                                    order.status === s
                                        ? `${STATUS_CONFIG[s]?.bg} ${STATUS_CONFIG[s]?.text} ring-2 ring-offset-1 ring-gray-300`
                                        : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                                }`}
                            >
                                {STATUS_CONFIG[s]?.label}
                            </button>
                        ))}
                    </div>
                    <button onClick={() => deleteOrder(order.id)} className="text-red-400 hover:text-red-600 text-sm font-medium transition-colors">
                        Delete
                    </button>
                </div>
            </div>
        );
    };

    const renderCustomCard = (req: CustomRequest) => {
        const cfg = STATUS_CONFIG[req.status] || { label: req.status, bg: 'bg-gray-100', text: 'text-gray-800', border: 'border-l-gray-300' };
        return (
            <div key={req.id} className={`bg-white rounded-xl shadow-sm border-l-4 ${cfg.border} border border-gray-100 p-5`}>
                <div className="flex items-start justify-between mb-3">
                    <div>
                        <StatusBadge status={req.status} />
                        <div className="font-bold text-gray-900 mt-1">{req.name}</div>
                    </div>
                    <div className="text-xs text-gray-400">{formatDate(req.created_at)}</div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4 text-sm">
                    <div className="bg-gray-50 rounded-lg p-3">
                        <div className="text-xs text-gray-400 mb-0.5 uppercase tracking-wide">Email</div>
                        <div className="flex items-center gap-1">
                            <span className="text-gray-700 truncate">{req.email}</span>
                            <button onClick={() => copy(req.email)} className="text-gray-300 hover:text-gray-600">📋</button>
                        </div>
                    </div>
                    {req.phone && (
                        <div className="bg-gray-50 rounded-lg p-3">
                            <div className="text-xs text-gray-400 mb-0.5 uppercase tracking-wide">Phone</div>
                            <div className="flex items-center gap-2">
                                <span className="text-gray-700">{req.phone}</span>
                                <button onClick={() => copy(req.phone || '')} className="text-gray-300 hover:text-gray-600">📋</button>
                                <a href={getWhatsAppLink(req.phone)} target="_blank" rel="noopener noreferrer" className="text-green-500 hover:text-green-700 text-xs font-bold bg-green-50 px-2 py-0.5 rounded-full">WA</a>
                            </div>
                        </div>
                    )}
                    {req.budget_range && (
                        <div className="bg-gray-50 rounded-lg p-3">
                            <div className="text-xs text-gray-400 mb-0.5 uppercase tracking-wide">Budget</div>
                            <div className="text-gray-700">{req.budget_range}</div>
                        </div>
                    )}
                    {req.timeline && (
                        <div className="bg-gray-50 rounded-lg p-3">
                            <div className="text-xs text-gray-400 mb-0.5 uppercase tracking-wide">Timeline</div>
                            <div className="text-gray-700">{req.timeline}</div>
                        </div>
                    )}
                </div>

                <div className="mb-4 p-3 bg-gray-50 rounded-lg text-sm">
                    <div className="text-xs text-gray-400 mb-1 uppercase tracking-wide">Project Description</div>
                    <div className="text-gray-700 whitespace-pre-wrap">{req.project_description}</div>
                </div>

                {(req.address || req.city) && (
                    <div className="mb-4 p-3 bg-blue-50 rounded-lg text-sm">
                        <div className="text-xs font-semibold text-blue-600 mb-1 uppercase tracking-wide">Address</div>
                        <div className="text-gray-700">
                            {req.address && <>{req.address}, </>}
                            {req.city && <>{req.city}, </>}
                            {req.state && <>{req.state} </>}
                            {req.pincode && <>{req.pincode}, </>}
                            {req.country}
                        </div>
                    </div>
                )}

                <div className="flex items-center justify-between pt-3 border-t border-gray-100 flex-wrap gap-2">
                    <div className="flex flex-wrap gap-1.5">
                        {(['new', 'reviewing', 'quoted', 'accepted', 'rejected', 'completed'] as const).map(s => (
                            <button
                                key={s}
                                onClick={() => updateCustomRequestStatus(req.id, s)}
                                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                                    req.status === s
                                        ? `${STATUS_CONFIG[s]?.bg} ${STATUS_CONFIG[s]?.text} ring-2 ring-offset-1 ring-gray-300`
                                        : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                                }`}
                            >
                                {STATUS_CONFIG[s]?.label}
                            </button>
                        ))}
                    </div>
                    <button onClick={() => deleteCustomRequest(req.id)} className="text-red-400 hover:text-red-600 text-sm font-medium">Delete</button>
                </div>
            </div>
        );
    };

    const renderContactCard = (sub: ContactSubmission) => {
        const cfg = STATUS_CONFIG[sub.status] || { label: sub.status, bg: 'bg-gray-100', text: 'text-gray-800', border: 'border-l-gray-300' };
        return (
            <div key={sub.id} className={`bg-white rounded-xl shadow-sm border-l-4 ${cfg.border} border border-gray-100 p-5`}>
                <div className="flex items-start justify-between mb-3">
                    <div>
                        <StatusBadge status={sub.status} />
                        <div className="font-bold text-gray-900 mt-1">{sub.name}</div>
                        {sub.subject && <div className="text-sm text-gray-500 mt-0.5">{sub.subject}</div>}
                    </div>
                    <div className="text-xs text-gray-400">{formatDate(sub.created_at)}</div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4 text-sm">
                    <div className="bg-gray-50 rounded-lg p-3">
                        <div className="text-xs text-gray-400 mb-0.5 uppercase tracking-wide">Email</div>
                        <div className="flex items-center gap-1">
                            <span className="text-gray-700 truncate">{sub.email}</span>
                            <button onClick={() => copy(sub.email)} className="text-gray-300 hover:text-gray-600">📋</button>
                        </div>
                    </div>
                    {sub.phone && (
                        <div className="bg-gray-50 rounded-lg p-3">
                            <div className="text-xs text-gray-400 mb-0.5 uppercase tracking-wide">Phone</div>
                            <div className="flex items-center gap-2">
                                <span className="text-gray-700">{sub.phone}</span>
                                <a href={getWhatsAppLink(sub.phone)} target="_blank" rel="noopener noreferrer" className="text-green-500 hover:text-green-700 text-xs font-bold bg-green-50 px-2 py-0.5 rounded-full">WA</a>
                            </div>
                        </div>
                    )}
                </div>

                <div className="mb-4 p-3 bg-gray-50 rounded-lg text-sm">
                    <div className="text-xs text-gray-400 mb-1 uppercase tracking-wide">Message</div>
                    <div className="text-gray-700 whitespace-pre-wrap">{sub.message}</div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-gray-100 flex-wrap gap-2">
                    <div className="flex flex-wrap gap-1.5">
                        {(['unread', 'read', 'replied', 'resolved'] as const).map(s => (
                            <button
                                key={s}
                                onClick={() => updateContactStatus(sub.id, s)}
                                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                                    sub.status === s
                                        ? `${STATUS_CONFIG[s]?.bg} ${STATUS_CONFIG[s]?.text} ring-2 ring-offset-1 ring-gray-300`
                                        : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                                }`}
                            >
                                {STATUS_CONFIG[s]?.label}
                            </button>
                        ))}
                    </div>
                    <button onClick={() => deleteContact(sub.id)} className="text-red-400 hover:text-red-600 text-sm font-medium">Delete</button>
                </div>
            </div>
        );
    };

    const renderCallCard = (call: BookedCall) => {
        const cfg = STATUS_CONFIG[call.status] || { label: call.status, bg: 'bg-gray-100', text: 'text-gray-800', border: 'border-l-gray-300' };
        return (
            <div key={call.id} className={`bg-white rounded-xl shadow-sm border-l-4 ${cfg.border} border border-gray-100 p-5`}>
                <div className="flex items-start justify-between mb-3">
                    <div>
                        <StatusBadge status={call.status} />
                        <div className="font-bold text-gray-900 mt-1">{call.name}</div>
                    </div>
                    <div className="text-xs text-gray-400">{formatDate(call.created_at)}</div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4 text-sm">
                    <div className="bg-gray-50 rounded-lg p-3">
                        <div className="text-xs text-gray-400 mb-0.5 uppercase tracking-wide">Email</div>
                        <div className="flex items-center gap-1">
                            <span className="text-gray-700 truncate">{call.email}</span>
                            <button onClick={() => copy(call.email)} className="text-gray-300 hover:text-gray-600">📋</button>
                        </div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3">
                        <div className="text-xs text-gray-400 mb-0.5 uppercase tracking-wide">Phone</div>
                        <div className="flex items-center gap-2">
                            <span className="text-gray-700">{call.phone}</span>
                            <button onClick={() => copy(call.phone)} className="text-gray-300 hover:text-gray-600">📋</button>
                            <a href={getWhatsAppLink(call.phone)} target="_blank" rel="noopener noreferrer" className="text-green-500 hover:text-green-700 text-xs font-bold bg-green-50 px-2 py-0.5 rounded-full">WA</a>
                        </div>
                    </div>
                </div>

                {call.admin_notes && (
                    <div className="mb-4 p-3 bg-yellow-50 rounded-lg text-sm">
                        <div className="text-xs text-yellow-600 mb-1 uppercase tracking-wide font-semibold">Notes</div>
                        <div className="text-gray-700">{call.admin_notes}</div>
                    </div>
                )}

                <div className="flex items-center justify-between pt-3 border-t border-gray-100 flex-wrap gap-2">
                    <div className="flex flex-wrap gap-1.5">
                        {(['new', 'contacted', 'scheduled', 'completed', 'cancelled'] as const).map(s => (
                            <button
                                key={s}
                                onClick={() => updateCallStatus(call.id, s)}
                                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                                    call.status === s
                                        ? `${STATUS_CONFIG[s]?.bg} ${STATUS_CONFIG[s]?.text} ring-2 ring-offset-1 ring-gray-300`
                                        : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                                }`}
                            >
                                {STATUS_CONFIG[s]?.label}
                            </button>
                        ))}
                    </div>
                    <button onClick={() => deleteCall(call.id)} className="text-red-400 hover:text-red-600 text-sm font-medium">Delete</button>
                </div>
            </div>
        );
    };

    const renderPrebookCard = (req: PrebookRequest) => {
        const cfg = STATUS_CONFIG[req.status] || { label: req.status, bg: 'bg-gray-100', text: 'text-gray-800', border: 'border-l-gray-300' };
        return (
            <div key={req.id} className={`bg-white rounded-xl shadow-sm border-l-4 ${cfg.border} border border-gray-100 p-5`}>
                <div className="flex items-start justify-between mb-3">
                    <div>
                        <StatusBadge status={req.status} />
                        <div className="font-bold text-gray-900 mt-1">{req.first_name} {req.last_name}</div>
                        <div className="text-sm text-gray-500 capitalize mt-0.5">{req.product_slug?.replace(/-/g, ' ')}</div>
                    </div>
                    <div className="text-xs text-gray-400">{formatDate(req.created_at)}</div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4 text-sm">
                    <div className="bg-gray-50 rounded-lg p-3">
                        <div className="text-xs text-gray-400 mb-0.5 uppercase tracking-wide">Email</div>
                        <div className="flex items-center gap-1">
                            <span className="text-gray-700 truncate">{req.email}</span>
                            <button onClick={() => copy(req.email)} className="text-gray-300 hover:text-gray-600">📋</button>
                        </div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3">
                        <div className="text-xs text-gray-400 mb-0.5 uppercase tracking-wide">Phone</div>
                        <div className="flex items-center gap-2">
                            <span className="text-gray-700">{req.phone}</span>
                            <button onClick={() => copy(req.phone)} className="text-gray-300 hover:text-gray-600">📋</button>
                            <a href={getWhatsAppLink(req.phone)} target="_blank" rel="noopener noreferrer" className="text-green-500 hover:text-green-700 text-xs font-bold bg-green-50 px-2 py-0.5 rounded-full">WA</a>
                        </div>
                    </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-gray-100 flex-wrap gap-2">
                    <div className="flex flex-wrap gap-1.5">
                        {(['new', 'contacted', 'confirmed', 'completed', 'cancelled'] as const).map(s => (
                            <button
                                key={s}
                                onClick={() => updatePrebookStatus(req.id, s)}
                                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                                    req.status === s
                                        ? `${STATUS_CONFIG[s]?.bg} ${STATUS_CONFIG[s]?.text} ring-2 ring-offset-1 ring-gray-300`
                                        : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                                }`}
                            >
                                {STATUS_CONFIG[s]?.label}
                            </button>
                        ))}
                    </div>
                    <button onClick={() => deletePrebook(req.id)} className="text-red-400 hover:text-red-600 text-sm font-medium">Delete</button>
                </div>
            </div>
        );
    };

    const SearchBar = ({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder: string }) => (
        <div className="bg-white rounded-xl p-4 shadow-sm mb-4">
            <input
                type="text"
                value={value}
                onChange={e => onChange(e.target.value)}
                placeholder={placeholder}
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
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
    };

    return (
        <div className="min-h-screen bg-gray-100 flex">

            {/* Dark Sidebar */}
            <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-gray-900 flex flex-col transform transition-transform duration-300 ease-in-out ${
                sidebarOpen ? 'translate-x-0' : '-translate-x-full'
            } lg:translate-x-0`}>

                <div className="p-6 border-b border-gray-800">
                    <div className="text-white font-bold text-lg tracking-tight">3 Layered</div>
                    <div className="text-gray-500 text-xs mt-0.5">Admin Panel</div>
                </div>

                <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
                    {navItems.map(item => (
                        <button
                            key={item.id}
                            onClick={() => { setActiveTab(item.id); setSidebarOpen(false); }}
                            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                                activeTab === item.id
                                    ? 'bg-white text-gray-900 shadow-sm'
                                    : 'text-gray-400 hover:text-white hover:bg-gray-800'
                            }`}
                        >
                            <span className="flex items-center gap-3">
                                <span className="text-base">{item.icon}</span>
                                <span>{item.label}</span>
                            </span>
                            {item.badge > 0 && (
                                <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full min-w-[20px] text-center">
                                    {item.badge}
                                </span>
                            )}
                        </button>
                    ))}
                </nav>

                <div className="p-4 border-t border-gray-800">
                    <button
                        onClick={handleLogout}
                        className="w-full text-gray-500 hover:text-white text-sm py-2 transition-colors rounded-lg hover:bg-gray-800"
                    >
                        Sign Out
                    </button>
                </div>
            </aside>

            {sidebarOpen && (
                <div className="fixed inset-0 z-40 bg-black/60 lg:hidden" onClick={() => setSidebarOpen(false)} />
            )}

            <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">

                <header className="bg-white border-b border-gray-200 px-4 sm:px-6 py-4 flex items-center justify-between sticky top-0 z-30 shadow-sm">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 text-gray-600 text-xl leading-none"
                        >
                            ☰
                        </button>
                        <h1 className="text-lg font-bold text-gray-900">{tabLabel[activeTab]}</h1>
                    </div>
                    <div className="flex items-center gap-3">
                        {totalAlerts > 0 && (
                            <span className="bg-red-500 text-white text-xs font-bold px-2.5 py-1 rounded-full">
                                {totalAlerts} new
                            </span>
                        )}
                        <button
                            onClick={fetchAllData}
                            className="text-sm text-gray-600 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-lg transition-colors font-medium"
                        >
                            Refresh
                        </button>
                    </div>
                </header>

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
                                        <div className="bg-white rounded-xl p-5 shadow-sm">
                                            <div className="text-xs text-gray-400 mb-1 uppercase tracking-wide font-medium">Active Orders</div>
                                            <div className="text-3xl font-bold text-gray-900">{stats.activeOrders}</div>
                                            <div className="text-xs text-amber-600 font-semibold mt-1">{stats.pendingOrders} pending</div>
                                        </div>
                                        <div className="bg-white rounded-xl p-5 shadow-sm">
                                            <div className="text-xs text-gray-400 mb-1 uppercase tracking-wide font-medium">Revenue</div>
                                            <div className="text-2xl font-bold text-gray-900">₹{stats.totalRevenue.toLocaleString('en-IN')}</div>
                                            <div className="text-xs text-gray-400 mt-1">delivered orders</div>
                                        </div>
                                        <div className="bg-white rounded-xl p-5 shadow-sm">
                                            <div className="text-xs text-gray-400 mb-1 uppercase tracking-wide font-medium">Today</div>
                                            <div className="text-3xl font-bold text-gray-900">{stats.todayOrders.length}</div>
                                            <div className="text-xs text-green-600 font-semibold mt-1">₹{stats.todayOrders.reduce((s, o) => s + o.total, 0).toLocaleString('en-IN')}</div>
                                        </div>
                                        <div className="bg-white rounded-xl p-5 shadow-sm">
                                            <div className="text-xs text-gray-400 mb-1 uppercase tracking-wide font-medium">Needs Attention</div>
                                            <div className={`text-3xl font-bold ${totalAlerts > 0 ? 'text-red-500' : 'text-green-500'}`}>{totalAlerts}</div>
                                            <div className="text-xs text-gray-400 mt-1">{totalAlerts === 0 ? 'all clear!' : 'unread items'}</div>
                                        </div>
                                    </div>

                                    {totalAlerts > 0 && (
                                        <div className="bg-amber-50 border border-amber-200 rounded-xl p-5">
                                            <h3 className="font-bold text-amber-900 mb-3 text-sm uppercase tracking-wide">Action Required</h3>
                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                                {stats.pendingOrders > 0 && (
                                                    <button onClick={() => setActiveTab('orders')} className="bg-white rounded-xl p-4 text-center hover:shadow-md transition-shadow border border-amber-100">
                                                        <div className="text-2xl font-bold text-amber-600">{stats.pendingOrders}</div>
                                                        <div className="text-xs text-gray-500 mt-1">Pending Orders</div>
                                                    </button>
                                                )}
                                                {stats.unreadContacts > 0 && (
                                                    <button onClick={() => setActiveTab('contact')} className="bg-white rounded-xl p-4 text-center hover:shadow-md transition-shadow border border-amber-100">
                                                        <div className="text-2xl font-bold text-red-500">{stats.unreadContacts}</div>
                                                        <div className="text-xs text-gray-500 mt-1">Unread Messages</div>
                                                    </button>
                                                )}
                                                {stats.newCustom > 0 && (
                                                    <button onClick={() => setActiveTab('custom')} className="bg-white rounded-xl p-4 text-center hover:shadow-md transition-shadow border border-amber-100">
                                                        <div className="text-2xl font-bold text-orange-500">{stats.newCustom}</div>
                                                        <div className="text-xs text-gray-500 mt-1">Custom Requests</div>
                                                    </button>
                                                )}
                                                {stats.newCalls > 0 && (
                                                    <button onClick={() => setActiveTab('calls')} className="bg-white rounded-xl p-4 text-center hover:shadow-md transition-shadow border border-amber-100">
                                                        <div className="text-2xl font-bold text-blue-500">{stats.newCalls}</div>
                                                        <div className="text-xs text-gray-500 mt-1">Booked Calls</div>
                                                    </button>
                                                )}
                                                {stats.newPrebooks > 0 && (
                                                    <button onClick={() => setActiveTab('prebooks')} className="bg-white rounded-xl p-4 text-center hover:shadow-md transition-shadow border border-amber-100">
                                                        <div className="text-2xl font-bold text-purple-500">{stats.newPrebooks}</div>
                                                        <div className="text-xs text-gray-500 mt-1">Prebook Requests</div>
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    <div>
                                        <div className="flex items-center justify-between mb-4">
                                            <h3 className="text-base font-bold text-gray-900">Recent Active Orders</h3>
                                            <button onClick={() => setActiveTab('orders')} className="text-sm text-gray-500 hover:text-gray-900 font-medium">View all →</button>
                                        </div>
                                        {activeOrders.length === 0 ? (
                                            <div className="bg-white rounded-xl p-10 text-center text-gray-400">
                                                <div className="text-4xl mb-2">✅</div>
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
                                    <div className="bg-white rounded-xl p-4 shadow-sm">
                                        <div className="flex flex-col sm:flex-row gap-3">
                                            <input
                                                type="text"
                                                placeholder="Search by name, email, or order number..."
                                                value={orderSearch}
                                                onChange={e => setOrderSearch(e.target.value)}
                                                className="flex-1 border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
                                            />
                                            <select
                                                value={sortBy}
                                                onChange={e => setSortBy(e.target.value as any)}
                                                className="border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 bg-white"
                                            >
                                                <option value="newest">Newest First</option>
                                                <option value="oldest">Oldest First</option>
                                                <option value="amount">Highest Amount</option>
                                            </select>
                                            <button
                                                onClick={exportOrdersCSV}
                                                className="bg-gray-900 text-white px-4 py-2.5 rounded-lg text-sm font-semibold hover:bg-gray-700 transition-colors whitespace-nowrap"
                                            >
                                                Export CSV
                                            </button>
                                        </div>
                                    </div>

                                    <div>
                                        <div className="flex items-center gap-3 mb-4">
                                            <h2 className="text-base font-bold text-gray-900">Active Orders</h2>
                                            <span className="bg-amber-100 text-amber-800 text-xs font-bold px-2.5 py-1 rounded-full">{activeOrders.length}</span>
                                        </div>
                                        {activeOrders.length === 0 ? (
                                            <div className="bg-white rounded-xl p-10 text-center text-gray-400">
                                                <div className="text-4xl mb-2">📭</div>
                                                No active orders
                                            </div>
                                        ) : (
                                            <div className="space-y-4">{activeOrders.map(renderOrderCard)}</div>
                                        )}
                                    </div>

                                    <div>
                                        <button
                                            onClick={() => setShowPastOrders(!showPastOrders)}
                                            className="flex items-center gap-3 mb-4 w-full text-left group"
                                        >
                                            <h2 className="text-base font-bold text-gray-400 group-hover:text-gray-600 transition-colors">Past Orders</h2>
                                            <span className="bg-gray-100 text-gray-500 text-xs font-bold px-2.5 py-1 rounded-full">{pastOrders.length}</span>
                                            <span className="text-gray-300 ml-auto text-sm">{showPastOrders ? '▲ Hide' : '▼ Show'}</span>
                                        </button>
                                        {showPastOrders && (
                                            pastOrders.length === 0 ? (
                                                <div className="bg-white rounded-xl p-8 text-center text-gray-400">No past orders</div>
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
                                        <div className="bg-white rounded-xl p-10 text-center text-gray-400">No custom requests</div>
                                    ) : (
                                        <div className="space-y-4">{filteredCustom.map(renderCustomCard)}</div>
                                    )}
                                </div>
                            )}

                            {activeTab === 'contact' && (
                                <div>
                                    <SearchBar value={contactSearch} onChange={setContactSearch} placeholder="Search messages..." />
                                    {filteredContact.length === 0 ? (
                                        <div className="bg-white rounded-xl p-10 text-center text-gray-400">No contact messages</div>
                                    ) : (
                                        <div className="space-y-4">{filteredContact.map(renderContactCard)}</div>
                                    )}
                                </div>
                            )}

                            {activeTab === 'calls' && (
                                <div>
                                    <SearchBar value={callSearch} onChange={setCallSearch} placeholder="Search by name, email, or phone..." />
                                    {filteredCalls.length === 0 ? (
                                        <div className="bg-white rounded-xl p-10 text-center text-gray-400">No booked calls</div>
                                    ) : (
                                        <div className="space-y-4">{filteredCalls.map(renderCallCard)}</div>
                                    )}
                                </div>
                            )}

                            {activeTab === 'prebooks' && (
                                <div>
                                    <SearchBar value={prebookSearch} onChange={setPrebookSearch} placeholder="Search by name, email, or product..." />
                                    {filteredPrebooks.length === 0 ? (
                                        <div className="bg-white rounded-xl p-10 text-center text-gray-400">No prebook requests</div>
                                    ) : (
                                        <div className="space-y-4">{filteredPrebooks.map(renderPrebookCard)}</div>
                                    )}
                                </div>
                            )}
                        </>
                    )}
                </main>
            </div>
        </div>
    );
}
