'use client';

import { useState, useEffect } from 'react';
import { Navbar } from '@/components/Navbar';
import { SlideProvider } from '@/contexts/SlideContext';

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

export default function AdminPanel() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [password, setPassword] = useState('');
    const [activeTab, setActiveTab] = useState<'orders' | 'custom' | 'contact' | 'calls' | 'prebooks'>('orders');
    const [orders, setOrders] = useState<Order[]>([]);
    const [customRequests, setCustomRequests] = useState<CustomRequest[]>([]);
    const [contactSubmissions, setContactSubmissions] = useState<ContactSubmission[]>([]);
    const [bookedCalls, setBookedCalls] = useState<BookedCall[]>([]);
    const [prebookRequests, setPrebookRequests] = useState<PrebookRequest[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'amount'>('newest');

    // Search states
    const [orderSearch, setOrderSearch] = useState('');
    const [customSearch, setCustomSearch] = useState('');
    const [contactSearch, setContactSearch] = useState('');
    const [callSearch, setCallSearch] = useState('');
    const [prebookSearch, setPrebookSearch] = useState('');
    const [filterStatus, setFilterStatus] = useState<string>('all');

    // Check for existing session on mount
    useEffect(() => {
        const adminAuth = sessionStorage.getItem('admin_authenticated');
        if (adminAuth === 'true') {
            setIsAuthenticated(true);
            fetchAllData();
        }
    }, []);

    // Sort orders when sortBy changes
    useEffect(() => {
        if (orders.length > 0) {
            const sorted = [...orders].sort((a, b) => {
                if (sortBy === 'newest') {
                    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
                } else if (sortBy === 'oldest') {
                    return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
                } else {
                    return b.total - a.total;
                }
            });
            setOrders(sorted);
        }
    }, [sortBy]);

    const handleLogin = () => {
        if (password === 'jaygehlot20053layeredadmin//200590()') {
            setIsAuthenticated(true);
            setError('');
            // Store in session storage
            sessionStorage.setItem('admin_authenticated', 'true');
            // Set secure cookie
            document.cookie = 'admin_authenticated=true; path=/; SameSite=Strict; Secure';
            fetchAllData();
        } else {
            setError('Invalid password');
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
            await Promise.all([
                fetchOrders(),
                fetchCustomRequests(),
                fetchContactSubmissions(),
                fetchBookedCalls(),
                fetchPrebookRequests()
            ]);
        } catch (err) {
            console.error('Error fetching data:', err);
        } finally {
            setLoading(false);
        }
    };

    const fetchOrders = async () => {
        try {
            const response = await fetch(`/api/orders?password=${encodeURIComponent('jaygehlot20053layeredadmin//200590()')}`);
            const data = await response.json();
            if (data.orders) {
                setOrders(data.orders);
            }
        } catch (err) {
            console.error('Error fetching orders:', err);
        }
    };

    const fetchCustomRequests = async () => {
        try {
            const response = await fetch(`/api/custom-requests?password=${encodeURIComponent('jaygehlot20053layeredadmin//200590()')}`);
            const data = await response.json();
            if (data.requests) {
                setCustomRequests(data.requests);
            }
        } catch (err) {
            console.error('Error fetching custom requests:', err);
        }
    };

    const fetchContactSubmissions = async () => {
        try {
            const response = await fetch(`/api/contact?password=${encodeURIComponent('jaygehlot20053layeredadmin//200590()')}`);
            const data = await response.json();
            if (data.submissions) {
                setContactSubmissions(data.submissions);
            }
        } catch (err) {
            console.error('Error fetching contact submissions:', err);
        }
    };

    const fetchBookedCalls = async () => {
        try {
            const response = await fetch(`/api/booked-calls?password=${encodeURIComponent('jaygehlot20053layeredadmin//200590()')}`);
            const data = await response.json();
            if (data.bookings) {
                setBookedCalls(data.bookings);
            }
        } catch (err) {
            console.error('Error fetching booked calls:', err);
        }
    };

    const fetchPrebookRequests = async () => {
        try {
            const response = await fetch(`/api/prebook-requests?password=${encodeURIComponent('jaygehlot20053layeredadmin//200590()')}`);
            const data = await response.json();
            if (data.requests) {
                setPrebookRequests(data.requests);
            }
        } catch (err) {
            console.error('Error fetching prebook requests:', err);
        }
    };

    const updateOrderStatus = async (orderId: string, newStatus: string) => {
        try {
            const response = await fetch('/api/orders', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    orderId,
                    status: newStatus,
                    adminPassword: 'jaygehlot20053layeredadmin//200590()'
                })
            });
            if (response.ok) {
                // Refetch to get updated data from database
                await fetchOrders();
            }
        } catch (err) {
            console.error('Error updating order:', err);
        }
    };

    const updateCustomRequestStatus = async (requestId: string, newStatus: string) => {
        try {
            const response = await fetch('/api/custom-requests', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    requestId,
                    status: newStatus,
                    adminPassword: 'jaygehlot20053layeredadmin//200590()'
                })
            });
            if (response.ok) {
                fetchCustomRequests();
            }
        } catch (err) {
            console.error('Error updating custom request:', err);
        }
    };

    const updateContactStatus = async (submissionId: string, newStatus: string) => {
        try {
            const response = await fetch('/api/contact', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    submissionId,
                    status: newStatus,
                    adminPassword: 'jaygehlot20053layeredadmin//200590()'
                })
            });
            if (response.ok) {
                fetchContactSubmissions();
            }
        } catch (err) {
            console.error('Error updating contact submission:', err);
        }
    };

    const deleteOrder = async (orderId: string) => {
        if (!confirm('Are you sure you want to delete this order?')) return;

        try {
            const response = await fetch(`/api/orders?orderId=${orderId}&password=${encodeURIComponent('jaygehlot20053layeredadmin//200590()')}`, {
                method: 'DELETE'
            });
            if (response.ok) {
                fetchOrders();
            }
        } catch (err) {
            console.error('Error deleting order:', err);
        }
    };

    const deleteCustomRequest = async (requestId: string) => {
        if (!confirm('Are you sure you want to delete this custom request?')) return;

        try {
            const response = await fetch(`/api/custom-requests?requestId=${requestId}&password=${encodeURIComponent('jaygehlot20053layeredadmin//200590()')}`, {
                method: 'DELETE'
            });
            if (response.ok) {
                fetchCustomRequests();
            }
        } catch (err) {
            console.error('Error deleting custom request:', err);
        }
    };

    const deleteContactSubmission = async (submissionId: string) => {
        if (!confirm('Are you sure you want to delete this contact submission?')) return;

        try {
            const response = await fetch(`/api/contact?submissionId=${submissionId}&password=${encodeURIComponent('jaygehlot20053layeredadmin//200590()')}`, {
                method: 'DELETE'
            });
            if (response.ok) {
                fetchContactSubmissions();
            }
        } catch (err) {
            console.error('Error deleting contact submission:', err);
        }
    };

    const updateBookedCallStatus = async (bookingId: string, newStatus: string) => {
        try {
            const response = await fetch('/api/booked-calls', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    bookingId,
                    status: newStatus,
                    adminPassword: 'jaygehlot20053layeredadmin//200590()'
                })
            });
            if (response.ok) {
                fetchBookedCalls();
            }
        } catch (err) {
            console.error('Error updating booked call:', err);
        }
    };

    const deleteBookedCall = async (bookingId: string) => {
        if (!confirm('Are you sure you want to delete this booked call?')) return;

        try {
            const response = await fetch(`/api/booked-calls?bookingId=${bookingId}&password=${encodeURIComponent('jaygehlot20053layeredadmin//200590()')}`, {
                method: 'DELETE'
            });
            if (response.ok) {
                fetchBookedCalls();
            }
        } catch (err) {
            console.error('Error deleting booked call:', err);
        }
    };

    const updatePrebookStatus = async (requestId: string, newStatus: string) => {
        try {
            const response = await fetch('/api/prebook-requests', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    requestId,
                    status: newStatus,
                    adminPassword: 'jaygehlot20053layeredadmin//200590()'
                })
            });
            if (response.ok) {
                fetchPrebookRequests();
            }
        } catch (err) {
            console.error('Error updating prebook request:', err);
        }
    };

    const deletePrebookRequest = async (requestId: string) => {
        if (!confirm('Are you sure you want to delete this prebook request?')) return;

        try {
            const response = await fetch(`/api/prebook-requests?requestId=${requestId}&password=${encodeURIComponent('jaygehlot20053layeredadmin//200590()')}`, {
                method: 'DELETE'
            });
            if (response.ok) {
                fetchPrebookRequests();
            }
        } catch (err) {
            console.error('Error deleting prebook request:', err);
        }
    };

    // Statistics calculations
    const stats = {
        totalOrders: orders.length,
        totalRevenue: orders.reduce((sum, order) => sum + (order.total || 0), 0),
        pendingCustomRequests: customRequests.filter(r => r.status === 'new' || r.status === 'reviewing').length,
        unreadContacts: contactSubmissions.filter(c => c.status === 'unread').length,
        newCalls: bookedCalls.filter(c => c.status === 'new').length,
        newPrebooks: prebookRequests.filter(p => p.status === 'new').length
    };

    // Filter functions
    const filteredOrders = orders.filter(order =>
        orderSearch === '' ||
        order.customer_name?.toLowerCase().includes(orderSearch.toLowerCase()) ||
        order.customer_email?.toLowerCase().includes(orderSearch.toLowerCase()) ||
        order.order_number?.toLowerCase().includes(orderSearch.toLowerCase())
    );

    const filteredCustomRequests = customRequests.filter(req =>
        customSearch === '' ||
        req.name?.toLowerCase().includes(customSearch.toLowerCase()) ||
        req.email?.toLowerCase().includes(customSearch.toLowerCase()) ||
        req.project_description?.toLowerCase().includes(customSearch.toLowerCase())
    );

    const filteredContactSubmissions = contactSubmissions.filter(sub =>
        contactSearch === '' ||
        sub.name?.toLowerCase().includes(contactSearch.toLowerCase()) ||
        sub.email?.toLowerCase().includes(contactSearch.toLowerCase()) ||
        sub.message?.toLowerCase().includes(contactSearch.toLowerCase())
    );

    const filteredBookedCalls = bookedCalls.filter(call =>
        callSearch === '' ||
        call.name?.toLowerCase().includes(callSearch.toLowerCase()) ||
        call.email?.toLowerCase().includes(callSearch.toLowerCase()) ||
        call.phone?.toLowerCase().includes(callSearch.toLowerCase())
    );

    const filteredPrebookRequests = prebookRequests.filter(req =>
        prebookSearch === '' ||
        req.first_name?.toLowerCase().includes(prebookSearch.toLowerCase()) ||
        req.last_name?.toLowerCase().includes(prebookSearch.toLowerCase()) ||
        req.email?.toLowerCase().includes(prebookSearch.toLowerCase()) ||
        req.product_slug?.toLowerCase().includes(prebookSearch.toLowerCase())
    );

    // Status badge helper
    const getStatusBadge = (status: string, type: 'order' | 'custom' | 'contact' | 'call') => {
        const colorMap: Record<string, string> = {
            // Orders
            'delivered': 'bg-green-100 text-green-800',
            'shipped': 'bg-blue-100 text-blue-800',
            'processing': 'bg-yellow-100 text-yellow-800',
            'pending': 'bg-gray-100 text-gray-800',
            'cancelled': 'bg-red-100 text-red-800',
            // Custom requests
            'completed': 'bg-green-100 text-green-800',
            'quoted': 'bg-blue-100 text-blue-800',
            'reviewing': 'bg-yellow-100 text-yellow-800',
            'new': 'bg-red-100 text-red-800',
            'accepted': 'bg-green-100 text-green-800',
            'rejected': 'bg-red-100 text-red-800',
            // Contact
            'resolved': 'bg-green-100 text-green-800',
            'replied': 'bg-blue-100 text-blue-800',
            'read': 'bg-gray-100 text-gray-800',
            'unread': 'bg-red-100 text-red-800',
            // Calls
            'scheduled': 'bg-blue-100 text-blue-800',
            'contacted': 'bg-yellow-100 text-yellow-800',
        };

        const color = colorMap[status.toLowerCase()] || 'bg-gray-100 text-gray-800';
        return (
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${color}`}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
            </span>
        );
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        alert('Copied to clipboard!');
    };

    if (!isAuthenticated) {
        return (
            <SlideProvider>
                <Navbar />
                <main className="min-h-screen bg-gray-50 pt-24 flex items-center justify-center px-4">
                    <div className="max-w-md w-full bg-white border border-gray-200 p-8">
                        <h1 className="font-serif text-4xl font-bold mb-8 text-center">Admin Panel</h1>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-2">Password</label>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
                                    className="w-full border border-gray-300 px-4 py-3 focus:outline-none focus:border-black"
                                    placeholder="Enter admin password"
                                />
                            </div>
                            {error && (
                                <div className="text-red-600 text-sm">{error}</div>
                            )}
                            <button
                                onClick={handleLogin}
                                className="w-full bg-black text-white py-3 px-6 hover:bg-gray-900 transition-colors"
                            >
                                Login
                            </button>
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
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="mb-8 flex justify-between items-center">
                        <h1 className="font-serif text-5xl font-bold">Admin Panel</h1>
                        <button
                            onClick={handleLogout}
                            className="text-sm text-gray-600 hover:text-black"
                        >
                            Logout
                        </button>
                    </div>

                    {/* Dashboard Statistics */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                        <div className="bg-white border border-gray-200 p-6">
                            <div className="flex items-center justify-between mb-2">
                                <div className="text-sm text-gray-500">Total Orders</div>
                                <div className="text-3xl">📦</div>
                            </div>
                            <div className="text-3xl font-bold">{stats.totalOrders}</div>
                            <div className="text-sm text-green-600 mt-1">₹{stats.totalRevenue.toLocaleString('en-IN')}</div>
                        </div>

                        <div className="bg-white border border-gray-200 p-6">
                            <div className="flex items-center justify-between mb-2">
                                <div className="text-sm text-gray-500">Custom Requests</div>
                                <div className="text-3xl">📝</div>
                            </div>
                            <div className="text-3xl font-bold">{customRequests.length}</div>
                            <div className="text-sm text-yellow-600 mt-1">{stats.pendingCustomRequests} pending</div>
                        </div>

                        <div className="bg-white border border-gray-200 p-6">
                            <div className="flex items-center justify-between mb-2">
                                <div className="text-sm text-gray-500">Contact Messages</div>
                                <div className="text-3xl">✉️</div>
                            </div>
                            <div className="text-3xl font-bold">{contactSubmissions.length}</div>
                            <div className="text-sm text-red-600 mt-1">{stats.unreadContacts} unread</div>
                        </div>

                        <div className="bg-white border border-gray-200 p-6">
                            <div className="flex items-center justify-between mb-2">
                                <div className="text-sm text-gray-500">Booked Calls</div>
                                <div className="text-3xl">📞</div>
                            </div>
                            <div className="text-3xl font-bold">{bookedCalls.length}</div>
                            <div className="text-sm text-red-600 mt-1">{stats.newCalls} new</div>
                        </div>

                        <div className="bg-white border border-gray-200 p-6">
                            <div className="flex items-center justify-between mb-2">
                                <div className="text-sm text-gray-500">Prebook Requests</div>
                                <div className="text-3xl">🏛️</div>
                            </div>
                            <div className="text-3xl font-bold">{prebookRequests.length}</div>
                            <div className="text-sm text-red-600 mt-1">{stats.newPrebooks} new</div>
                        </div>
                    </div>

                    {/* Tabs */}
                    <div className="mb-8 border-b border-gray-200">
                        <div className="flex gap-8">
                            <button
                                onClick={() => setActiveTab('orders')}
                                className={`pb-4 border-b-2 transition-colors ${activeTab === 'orders'
                                    ? 'border-black text-black font-medium'
                                    : 'border-transparent text-gray-500 hover:text-black'
                                    }`}
                            >
                                Orders ({orders.length})
                            </button>
                            <button
                                onClick={() => setActiveTab('custom')}
                                className={`pb-4 border-b-2 transition-colors ${activeTab === 'custom'
                                    ? 'border-black text-black font-medium'
                                    : 'border-transparent text-gray-500 hover:text-black'
                                    }`}
                            >
                                Custom Requests ({customRequests.length})
                            </button>
                            <button
                                onClick={() => setActiveTab('contact')}
                                className={`pb-4 border-b-2 transition-colors ${activeTab === 'contact'
                                    ? 'border-black text-black font-medium'
                                    : 'border-transparent text-gray-500 hover:text-black'
                                    }`}
                            >
                                Contact ({contactSubmissions.length})
                            </button>
                            <button
                                onClick={() => setActiveTab('calls')}
                                className={`pb-4 border-b-2 transition-colors ${activeTab === 'calls'
                                    ? 'border-black text-black font-medium'
                                    : 'border-transparent text-gray-500 hover:text-black'
                                    }`}
                            >
                                Booked Calls ({bookedCalls.length})
                            </button>
                            <button
                                onClick={() => setActiveTab('prebooks')}
                                className={`pb-4 border-b-2 transition-colors ${activeTab === 'prebooks'
                                    ? 'border-black text-black font-medium'
                                    : 'border-transparent text-gray-500 hover:text-black'
                                    }`}
                            >
                                Prebook Requests ({prebookRequests.length})
                            </button>
                        </div>
                    </div>

                    {loading ? (
                        <div className="text-center py-16">
                            <div className="text-xl text-gray-600">Loading...</div>
                        </div>
                    ) : (
                        <>
                            {/* Orders Tab */}
                            {activeTab === 'orders' && (
                                <div className="space-y-4">
                                    {/* Search Box */}
                                    <div className="bg-white border border-gray-200 p-4">
                                        <input
                                            type="text"
                                            placeholder="🔍 Search orders by name, email, or order number..."
                                            value={orderSearch}
                                            onChange={(e) => setOrderSearch(e.target.value)}
                                            className="w-full border border-gray-300 px-4 py-2 focus:outline-none focus:border-black"
                                        />
                                    </div>

                                    {/* Sort Controls */}
                                    <div className="flex justify-end gap-2 mb-4">
                                        <label className="text-sm text-gray-600">Sort by:</label>
                                        <select
                                            value={sortBy}
                                            onChange={(e) => setSortBy(e.target.value as any)}
                                            className="border border-gray-300 px-3 py-1 text-sm"
                                        >
                                            <option value="newest">Newest First</option>
                                            <option value="oldest">Oldest First</option>
                                            <option value="amount">Highest Amount</option>
                                        </select>
                                    </div>

                                    {orders.length === 0 ? (
                                        <div className="bg-white border border-gray-200 p-8 text-center text-gray-600">
                                            {filterStatus === 'all' ? 'No orders yet' : `No ${filterStatus} orders`}
                                        </div>
                                    ) : (
                                        orders.filter(order => filterStatus === 'all' || order.status === filterStatus).map((order) => (
                                            <div key={order.id} className="bg-white border border-gray-200 p-6">
                                                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                                    <div>
                                                        <div className="text-sm text-gray-500">Order Number</div>
                                                        <div className="font-bold">{order.order_number}</div>
                                                    </div>
                                                    <div>
                                                        <div className="text-sm text-gray-500">Customer</div>
                                                        <div className="font-medium">{order.customer_name}</div>
                                                        <div className="text-sm text-gray-600 flex items-center gap-2">
                                                            {order.customer_email}
                                                            <button
                                                                onClick={() => copyToClipboard(order.customer_email)}
                                                                className="text-blue-600 hover:text-blue-800"
                                                                title="Copy email"
                                                            >
                                                                📋
                                                            </button>
                                                        </div>
                                                        {order.customer_phone && (
                                                            <div className="text-sm text-gray-600 flex items-center gap-2">
                                                                {order.customer_phone}
                                                                <button
                                                                    onClick={() => copyToClipboard(order.customer_phone || '')}
                                                                    className="text-blue-600 hover:text-blue-800"
                                                                    title="Copy phone"
                                                                >
                                                                    📋
                                                                </button>
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div>
                                                        <div className="text-sm text-gray-500">Total</div>
                                                        <div className="space-y-1">
                                                            {order.discount && order.discount > 0 ? (
                                                                <>
                                                                    <div className="text-sm text-gray-500 line-through">₹{((order.total || 0) + (order.discount || 0)).toLocaleString()}</div>
                                                                    <div className="font-bold text-xl text-green-600">₹{order.total.toLocaleString()}</div>
                                                                    {order.coupon_code && (
                                                                        <div className="text-xs text-green-600 font-medium">🎉 {order.coupon_code} (-₹{order.discount})</div>
                                                                    )}
                                                                </>
                                                            ) : (
                                                                <div className="font-bold text-xl">₹{order.total.toLocaleString()}</div>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <div className="text-sm text-gray-500">Date</div>
                                                        <div className="text-sm">{new Date(order.created_at).toLocaleDateString()}</div>
                                                    </div>
                                                </div>

                                                {/* Shipping Address */}
                                                {order.customer_address && (
                                                    <div className="mt-4 pt-4 border-t border-gray-200">
                                                        <div className="text-sm text-gray-500 mb-2 flex items-center gap-2">
                                                            Shipping Address:
                                                            <button
                                                                onClick={() => {
                                                                    const fullAddress = `${order.customer_address.address}${order.customer_address.apartment ? ', ' + order.customer_address.apartment : ''}, ${order.customer_address.city}, ${order.customer_address.state} ${order.customer_address.pincode}, ${order.customer_address.country}`;
                                                                    copyToClipboard(fullAddress);
                                                                }}
                                                                className="text-blue-600 hover:text-blue-800"
                                                                title="Copy address"
                                                            >
                                                                📋
                                                            </button>
                                                        </div>
                                                        <div className="text-sm">
                                                            {order.customer_address.address}
                                                            {order.customer_address.apartment && `, ${order.customer_address.apartment}`}
                                                            <br />
                                                            {order.customer_address.city}, {order.customer_address.state} {order.customer_address.pincode}
                                                            <br />
                                                            {order.customer_address.country}
                                                        </div>
                                                    </div>
                                                )}
                                                <div className="mt-4 pt-4 border-t border-gray-200">
                                                    <div className="text-sm text-gray-500 mb-2">Items:</div>
                                                    {order.items.map((item: any, index: number) => (
                                                        <div key={index} className="text-sm mb-1">
                                                            {item.productName} × {item.quantity} - ₹{item.totalPrice.toLocaleString()}
                                                        </div>
                                                    ))}
                                                </div>

                                                {/* Payment Information */}
                                                {order.payment_method && (
                                                    <div className="mt-4 pt-4 border-t border-gray-200">
                                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                            <div>
                                                                <div className="text-sm text-gray-500">Payment Method</div>
                                                                <div className="font-medium capitalize">
                                                                    {order.payment_method === 'cod' ? 'Cash on Delivery' : 'Online Payment'}
                                                                </div>
                                                            </div>
                                                            <div>
                                                                <div className="text-sm text-gray-500">Payment Status</div>
                                                                <div className="font-medium">
                                                                    <span className={`px-2 py-1 text-xs rounded ${order.payment_status === 'completed' ? 'bg-green-100 text-green-800' :
                                                                        order.payment_status === 'failed' ? 'bg-red-100 text-red-800' :
                                                                            'bg-yellow-100 text-yellow-800'
                                                                        }`}>
                                                                        {order.payment_status || 'pending'}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                            {order.razorpay_payment_id && (
                                                                <div>
                                                                    <div className="text-sm text-gray-500">Razorpay Payment ID</div>
                                                                    <div className="text-sm font-mono flex items-center gap-2">
                                                                        {order.razorpay_payment_id}
                                                                        <button
                                                                            onClick={() => copyToClipboard(order.razorpay_payment_id || '')}
                                                                            className="text-blue-600 hover:text-blue-800"
                                                                            title="Copy payment ID"
                                                                        >
                                                                            📋
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                )}
                                                <div className="mt-4 flex items-center justify-between gap-4">
                                                    <div className="flex items-center gap-4">
                                                        <label className="text-sm text-gray-600">Status:</label>
                                                        <select
                                                            value={order.status}
                                                            onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                                                            className="border border-gray-300 px-3 py-1 text-sm"
                                                        >
                                                            <option value="pending">Pending</option>
                                                            <option value="processing">Processing</option>
                                                            <option value="shipped">Shipped</option>
                                                            <option value="delivered">Delivered</option>
                                                            <option value="cancelled">Cancelled</option>
                                                        </select>
                                                    </div>
                                                    <button
                                                        onClick={() => deleteOrder(order.id)}
                                                        className="text-red-600 hover:text-red-800 text-sm font-medium"
                                                    >
                                                        🗑️ Delete
                                                    </button>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            )}

                            {/* Custom Requests Tab */}
                            {activeTab === 'custom' && (
                                <div className="space-y-4">
                                    {customRequests.length === 0 ? (
                                        <div className="bg-white border border-gray-200 p-8 text-center text-gray-600">
                                            No custom requests yet
                                        </div>
                                    ) : (
                                        customRequests.map((request) => (
                                            <div key={request.id} className="bg-white border border-gray-200 p-6">
                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                                    <div>
                                                        <div className="text-sm text-gray-500">Name</div>
                                                        <div className="font-bold">{request.name}</div>
                                                    </div>
                                                    <div>
                                                        <div className="text-sm text-gray-500">Email</div>
                                                        <div className="font-medium flex items-center gap-2">
                                                            {request.email}
                                                            <button
                                                                onClick={() => copyToClipboard(request.email)}
                                                                className="text-blue-600 hover:text-blue-800"
                                                                title="Copy email"
                                                            >
                                                                📋
                                                            </button>
                                                        </div>
                                                    </div>
                                                    {request.phone && (
                                                        <div>
                                                            <div className="text-sm text-gray-500">Phone</div>
                                                            <div className="font-medium flex items-center gap-2">
                                                                {request.phone}
                                                                <button
                                                                    onClick={() => copyToClipboard(request.phone || '')}
                                                                    className="text-blue-600 hover:text-blue-800"
                                                                    title="Copy phone"
                                                                >
                                                                    📋
                                                                </button>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="mb-4">
                                                    <div className="text-sm text-gray-500 mb-1">Project Description</div>
                                                    <div className="text-sm">{request.project_description}</div>
                                                </div>

                                                {/* Shipping Address */}
                                                {(request.address || request.city || request.state) && (
                                                    <div className="mb-4 pt-4 border-t border-gray-200">
                                                        <div className="text-sm text-gray-500 mb-2 flex items-center gap-2">
                                                            Shipping Address:
                                                            <button
                                                                onClick={() => {
                                                                    const fullAddress = `${request.address || ''}${request.city ? ', ' + request.city : ''}${request.state ? ', ' + request.state : ''}${request.pincode ? ' ' + request.pincode : ''}${request.country ? ', ' + request.country : ''}`;
                                                                    copyToClipboard(fullAddress);
                                                                }}
                                                                className="text-blue-600 hover:text-blue-800"
                                                                title="Copy address"
                                                            >
                                                                📋
                                                            </button>
                                                        </div>
                                                        <div className="text-sm">
                                                            {request.address && <>{request.address}<br /></>}
                                                            {request.city && <>{request.city}{request.state ? ', ' : ''}</>}
                                                            {request.state && <>{request.state} </>}
                                                            {request.pincode && <>{request.pincode}</>}
                                                            {(request.city || request.state || request.pincode) && <br />}
                                                            {request.country}
                                                        </div>
                                                    </div>
                                                )}

                                                {request.budget_range && (
                                                    <div className="text-sm mb-2">
                                                        <span className="text-gray-500">Budget:</span> {request.budget_range}
                                                    </div>
                                                )}
                                                {request.timeline && (
                                                    <div className="text-sm mb-4">
                                                        <span className="text-gray-500">Timeline:</span> {request.timeline}
                                                    </div>
                                                )}
                                                <div className="mt-4 flex items-center justify-between gap-4">
                                                    <div className="flex items-center gap-4">
                                                        <label className="text-sm text-gray-600">Status:</label>
                                                        <select
                                                            value={request.status}
                                                            onChange={(e) => updateCustomRequestStatus(request.id, e.target.value)}
                                                            className="border border-gray-300 px-3 py-1 text-sm"
                                                        >
                                                            <option value="new">New</option>
                                                            <option value="reviewing">Reviewing</option>
                                                            <option value="quoted">Quoted</option>
                                                            <option value="accepted">Accepted</option>
                                                            <option value="rejected">Rejected</option>
                                                            <option value="completed">Completed</option>
                                                        </select>
                                                        <span className="text-xs text-gray-500">
                                                            {new Date(request.created_at).toLocaleString()}
                                                        </span>
                                                    </div>
                                                    <button
                                                        onClick={() => deleteCustomRequest(request.id)}
                                                        className="text-red-600 hover:text-red-800 text-sm font-medium"
                                                    >
                                                        🗑️ Delete
                                                    </button>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            )}

                            {/* Contact Submissions Tab */}
                            {activeTab === 'contact' && (
                                <div className="space-y-4">
                                    {contactSubmissions.length === 0 ? (
                                        <div className="bg-white border border-gray-200 p-8 text-center text-gray-600">
                                            No contact submissions yet
                                        </div>
                                    ) : (
                                        contactSubmissions.map((submission) => (
                                            <div key={submission.id} className="bg-white border border-gray-200 p-6">
                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                                    <div>
                                                        <div className="text-sm text-gray-500">Name</div>
                                                        <div className="font-bold">{submission.name}</div>
                                                    </div>
                                                    <div>
                                                        <div className="text-sm text-gray-500">Email</div>
                                                        <div className="font-medium flex items-center gap-2">
                                                            {submission.email}
                                                            <button
                                                                onClick={() => copyToClipboard(submission.email)}
                                                                className="text-blue-600 hover:text-blue-800"
                                                                title="Copy email"
                                                            >
                                                                📋
                                                            </button>
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <div className="text-sm text-gray-500">Phone</div>
                                                        <div className="font-medium">
                                                            {submission.phone || 'N/A'}
                                                        </div>
                                                    </div>
                                                </div>
                                                {submission.subject && (
                                                    <div className="mb-2">
                                                        <div className="text-sm text-gray-500">Subject</div>
                                                        <div className="font-medium">{submission.subject}</div>
                                                    </div>
                                                )}
                                                <div className="mb-4">
                                                    <div className="text-sm text-gray-500 mb-1">Message</div>
                                                    <div className="text-sm whitespace-pre-wrap">{submission.message}</div>
                                                </div>
                                                <div className="mt-4 flex items-center justify-between gap-4">
                                                    <div className="flex items-center gap-4">
                                                        <label className="text-sm text-gray-600">Status:</label>
                                                        <select
                                                            value={submission.status}
                                                            onChange={(e) => updateContactStatus(submission.id, e.target.value)}
                                                            className="border border-gray-300 px-3 py-1 text-sm"
                                                        >
                                                            <option value="unread">Unread</option>
                                                            <option value="read">Read</option>
                                                            <option value="replied">Replied</option>
                                                            <option value="resolved">Resolved</option>
                                                        </select>
                                                        <span className="text-xs text-gray-500">
                                                            {new Date(submission.created_at).toLocaleString()}
                                                        </span>
                                                    </div>
                                                    <button
                                                        onClick={() => deleteContactSubmission(submission.id)}
                                                        className="text-red-600 hover:text-red-800 text-sm font-medium"
                                                    >
                                                        🗑️ Delete
                                                    </button>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            )}

                            {/* Booked Calls Tab */}
                            {activeTab === 'calls' && (
                                <div className="space-y-4">
                                    {bookedCalls.length === 0 ? (
                                        <div className="bg-white border border-gray-200 p-8 text-center text-gray-600">
                                            No booked calls yet
                                        </div>
                                    ) : (
                                        bookedCalls.map((call) => (
                                            <div key={call.id} className="bg-white border border-gray-200 p-6">
                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                                    <div>
                                                        <div className="text-sm text-gray-500">Name</div>
                                                        <div className="font-bold">{call.name}</div>
                                                    </div>
                                                    <div>
                                                        <div className="text-sm text-gray-500">Email</div>
                                                        <div className="font-medium flex items-center gap-2">
                                                            {call.email}
                                                            <button
                                                                onClick={() => copyToClipboard(call.email)}
                                                                className="text-blue-600 hover:text-blue-800"
                                                                title="Copy email"
                                                            >
                                                                📋
                                                            </button>
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <div className="text-sm text-gray-500">Phone</div>
                                                        <div className="font-medium flex items-center gap-2">
                                                            {call.phone}
                                                            <button
                                                                onClick={() => copyToClipboard(call.phone)}
                                                                className="text-blue-600 hover:text-blue-800"
                                                                title="Copy phone"
                                                            >
                                                                📋
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="mt-4 flex items-center justify-between gap-4">
                                                    <div className="flex items-center gap-4">
                                                        <label className="text-sm text-gray-600">Status:</label>
                                                        <select
                                                            value={call.status}
                                                            onChange={(e) => updateBookedCallStatus(call.id, e.target.value)}
                                                            className="border border-gray-300 px-3 py-1 text-sm"
                                                        >
                                                            <option value="new">New</option>
                                                            <option value="contacted">Contacted</option>
                                                            <option value="scheduled">Scheduled</option>
                                                            <option value="completed">Completed</option>
                                                            <option value="cancelled">Cancelled</option>
                                                        </select>
                                                        <span className="text-xs text-gray-500">
                                                            {new Date(call.created_at).toLocaleString()}
                                                        </span>
                                                    </div>
                                                    <button
                                                        onClick={() => deleteBookedCall(call.id)}
                                                        className="text-red-600 hover:text-red-800 text-sm font-medium"
                                                    >
                                                        🗑️ Delete
                                                    </button>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            )}

                            {/* Prebook Requests Tab */}
                            {activeTab === 'prebooks' && (
                                <div className="space-y-4">
                                    <div className="bg-white border border-gray-200 p-4">
                                        <input
                                            type="text"
                                            placeholder="🔍 Search prebook requests by name, email, or product..."
                                            value={prebookSearch}
                                            onChange={(e) => setPrebookSearch(e.target.value)}
                                            className="w-full border border-gray-300 px-4 py-2 focus:outline-none focus:border-black"
                                        />
                                    </div>

                                    {prebookRequests.length === 0 ? (
                                        <div className="bg-white border border-gray-200 p-8 text-center text-gray-600">
                                            No prebook requests yet
                                        </div>
                                    ) : (
                                        filteredPrebookRequests.map((request) => (
                                            <div key={request.id} className="bg-white border border-gray-200 p-6">
                                                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                                                    <div>
                                                        <div className="text-sm text-gray-500">Customer</div>
                                                        <div className="font-bold">{request.first_name} {request.last_name}</div>
                                                    </div>
                                                    <div>
                                                        <div className="text-sm text-gray-500">Email</div>
                                                        <div className="font-medium flex items-center gap-2">
                                                            {request.email}
                                                            <button
                                                                onClick={() => copyToClipboard(request.email)}
                                                                className="text-blue-600 hover:text-blue-800"
                                                                title="Copy email"
                                                            >
                                                                📋
                                                            </button>
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <div className="text-sm text-gray-500">Phone</div>
                                                        <div className="font-medium flex items-center gap-2">
                                                            {request.phone}
                                                            <button
                                                                onClick={() => copyToClipboard(request.phone)}
                                                                className="text-blue-600 hover:text-blue-800"
                                                                title="Copy phone"
                                                            >
                                                                📋
                                                            </button>
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <div className="text-sm text-gray-500">Date</div>
                                                        <div className="text-sm">{new Date(request.created_at).toLocaleDateString()}</div>
                                                    </div>
                                                </div>

                                                <div className="mb-4 pt-4 border-t border-gray-200">
                                                    <div className="text-sm text-gray-500 mb-1">Product</div>
                                                    <div className="font-medium capitalize">
                                                        {request.product_slug?.replace(/-/g, ' ') || 'N/A'}
                                                    </div>
                                                </div>

                                                <div className="flex items-center justify-between gap-4">
                                                    <div className="flex items-center gap-4">
                                                        <label className="text-sm text-gray-600">Status:</label>
                                                        <select
                                                            value={request.status}
                                                            onChange={(e) => updatePrebookStatus(request.id, e.target.value)}
                                                            className="border border-gray-300 px-3 py-1 text-sm"
                                                        >
                                                            <option value="new">New</option>
                                                            <option value="contacted">Contacted</option>
                                                            <option value="confirmed">Confirmed</option>
                                                            <option value="completed">Completed</option>
                                                            <option value="cancelled">Cancelled</option>
                                                        </select>
                                                    </div>
                                                    <button
                                                        onClick={() => deletePrebookRequest(request.id)}
                                                        className="text-red-600 hover:text-red-800 text-sm font-medium"
                                                    >
                                                        🗑️ Delete
                                                    </button>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            )}
                        </>
                    )}
                </div>
            </main>
        </SlideProvider>
    );
}
