import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { 
  LayoutDashboard, Package, Tag, ShoppingCart, Users, 
  BarChart3, Settings, AlertTriangle, Plus, Trash2, Edit3, 
  Search, Check, ShieldAlert, ArrowUpRight, DollarSign, 
  Truck, ArrowRight, Eye, RefreshCw, X 
} from 'lucide-react';
import { useProductStore } from '../store/useProductStore';
import { useAuthStore } from '../store/useAuthStore';
import { useToastStore } from '../store/useToastStore';
import { OrderService } from '../services/OrderService';
import { CustomerService } from '../services/CustomerService';
import { Product, ProductCategory } from '../types/product';
import { DemoOrder, OrderStatus } from '../types/order';
import { DemoUser } from '../types/auth';
import { formatCentsToUSD, dollarsToCents } from '../utils/currency';
import { API_CONFIG } from '../services/apiConfig';
import { SafeImage } from '../components/common/SafeImage';
import { LOCAL_IMAGES } from '../assets/images';

export const AdminDashboardPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentTab = searchParams.get('tab') || 'overview';

  const { products, addProduct, updateProduct, deleteProduct } = useProductStore();
  const { user } = useAuthStore();
  const showToast = useToastStore((state) => state.showToast);

  const [orders, setOrders] = useState<DemoOrder[]>([]);
  const [customers, setCustomers] = useState<DemoUser[]>([]);
  const [productSearch, setProductSearch] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form state for creating / editing product
  const [prodForm, setProdForm] = useState({
    name: '',
    subtitle: '',
    description: '',
    category: 'men' as ProductCategory,
    subCategory: 't-shirts',
    priceDollars: '49.99',
    stock: 35,
    sizes: 'S, M, L, XL',
    colors: 'Onyx Black (#111111), Warm Ivory (#F7F5F0)',
    imageUrl: LOCAL_IMAGES.tshirt,
    isBestSeller: false,
    isNewArrival: true,
  });

  useEffect(() => {
    const loadAdminData = async () => {
      const orderList = await OrderService.getAllOrders();
      setOrders(orderList);
      const customerList = await CustomerService.getAllCustomers();
      setCustomers(customerList);
    };
    loadAdminData();
  }, []);

  const setTab = (tab: string) => {
    setSearchParams({ tab });
  };

  // KPI Calculations in integer cents
  const totalRevenueCents = orders.reduce((acc, o) => acc + o.totalCents, 0);
  const lowStockCount = products.filter((p) => p.demoStockQuantity < 20).length;

  // Filtered products in admin table
  const adminFilteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
      p.category.toLowerCase().includes(productSearch.toLowerCase()) ||
      p.sku.toLowerCase().includes(productSearch.toLowerCase())
  );

  const handleStatusChange = async (orderId: string, newStatus: OrderStatus) => {
    try {
      const updated = await OrderService.updateOrderStatus(orderId, newStatus);
      setOrders(orders.map((o) => (o.id === orderId ? updated : o)));
      showToast(`Order ${orderId} status set to ${newStatus}`);
    } catch {
      showToast('Failed to update status', 'error');
    }
  };

  const handleStockAdjust = async (productId: string, delta: number) => {
    const item = products.find((p) => p.id === productId);
    if (!item) return;
    const newStock = Math.max(0, item.demoStockQuantity + delta);
    await updateProduct(productId, { demoStockQuantity: newStock });
    showToast(`Updated stock for ${item.name} to ${newStock}`);
  };

  const handleDeleteProduct = async (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to remove "${name}" from the demo catalog?`)) {
      await deleteProduct(id);
      showToast(`Deleted "${name}"`);
    }
  };

  const handleOpenEdit = (p: Product) => {
    setEditingProduct(p);
    setProdForm({
      name: p.name,
      subtitle: p.subtitle,
      description: p.description,
      category: p.category,
      subCategory: p.subCategory,
      priceDollars: (p.priceCents / 100).toFixed(2),
      stock: p.demoStockQuantity,
      sizes: p.availableSizes.join(', '),
      colors: p.availableColors.map((c) => `${c.name} (${c.hex})`).join(', '),
      imageUrl: p.images[0] || '',
      isBestSeller: !!p.isBestSeller,
      isNewArrival: !!p.isNewArrival,
    });
    setIsAddModalOpen(true);
  };

  const handleOpenAdd = () => {
    setEditingProduct(null);
    setProdForm({
      name: '',
      subtitle: '',
      description: '',
      category: 'men',
      subCategory: 't-shirts',
      priceDollars: '49.99',
      stock: 35,
      sizes: 'S, M, L, XL',
      colors: 'Onyx Black (#111111), Warm Ivory (#F7F5F0)',
      imageUrl: LOCAL_IMAGES.tshirt,
      isBestSeller: false,
      isNewArrival: true,
    });
    setIsAddModalOpen(true);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();

    const priceCents = dollarsToCents(prodForm.priceDollars);
    const parsedSizes = prodForm.sizes.split(',').map((s) => s.trim()).filter(Boolean);
    const parsedColors = prodForm.colors.split(',').map((c) => {
      const match = c.match(/(.+)\((#.+)\)/);
      if (match) {
        return { name: match[1].trim(), hex: match[2].trim() };
      }
      return { name: c.trim(), hex: '#111111' };
    });

    if (editingProduct) {
      await updateProduct(editingProduct.id, {
        name: prodForm.name,
        subtitle: prodForm.subtitle,
        description: prodForm.description,
        category: prodForm.category,
        subCategory: prodForm.subCategory as any,
        priceCents,
        demoStockQuantity: Number(prodForm.stock),
        availableSizes: parsedSizes,
        availableColors: parsedColors,
        images: [prodForm.imageUrl],
        isBestSeller: prodForm.isBestSeller,
        isNewArrival: prodForm.isNewArrival,
      });
      showToast(`Updated "${prodForm.name}" successfully`);
    } else {
      await addProduct({
        name: prodForm.name,
        slug: prodForm.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        subtitle: prodForm.subtitle,
        description: prodForm.description,
        details: ['Premium natural fiber construction', 'Tailored ergonomic fit'],
        materials: '100% Certified Sustainable Material',
        careInstructions: 'Machine wash cold.',
        category: prodForm.category,
        subCategory: prodForm.subCategory as any,
        priceCents,
        images: [prodForm.imageUrl],
        availableSizes: parsedSizes,
        availableColors: parsedColors,
        demoStockQuantity: Number(prodForm.stock),
        isBestSeller: prodForm.isBestSeller,
        isNewArrival: prodForm.isNewArrival,
        rating: 5.0,
        reviewCount: 1,
        sku: `URB-ADM-${Date.now().toString().slice(-4)}`,
        createdAt: new Date().toISOString(),
      });
      showToast(`Created new demo product "${prodForm.name}"`);
    }

    setIsAddModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#F7F5F0] pb-24">
      {/* Top Banner Disclaimer */}
      <div className="bg-[#111111] text-amber-300 px-4 py-2 text-xs flex items-center justify-between border-b border-neutral-800">
        <div className="flex items-center gap-2">
          <ShieldAlert size={14} className="text-amber-400" />
          <span>
            <strong>Simulated Admin Dashboard:</strong> All inventory alterations, order statuses, and analytics update local browser demo state. Future implementations connect with Spring Boot RBAC microservices.
          </span>
        </div>
        <Link to="/" className="text-white hover:underline text-[11px] shrink-0 font-medium">
          Exit to Storefront →
        </Link>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Admin Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-neutral-300 gap-4 mb-8">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-neutral-500 block mb-1">
              UrbanStyle Management Suite
            </span>
            <h1 className="text-3xl font-serif font-bold text-neutral-900">
              Admin Console
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleOpenAdd}
              className="bg-[#111111] hover:bg-neutral-800 text-white px-4 py-2.5 rounded text-xs font-semibold uppercase tracking-wider flex items-center gap-2 transition-colors shadow-sm"
            >
              <Plus size={15} />
              <span>Add Demo Product</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex overflow-x-auto gap-2 pb-4 mb-8 border-b border-neutral-200 text-xs font-semibold uppercase tracking-wider">
          {[
            { id: 'overview', label: 'Dashboard Overview', icon: LayoutDashboard },
            { id: 'products', label: 'Products', icon: Package },
            { id: 'orders', label: 'Orders', icon: ShoppingCart },
            { id: 'inventory', label: 'Inventory', icon: AlertTriangle },
            { id: 'customers', label: 'Customers', icon: Users },
            { id: 'analytics', label: 'Analytics', icon: BarChart3 },
            { id: 'settings', label: 'Spring Boot Settings', icon: Settings },
          ].map((tab) => {
            const Icon = tab.icon;
            const active = currentTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded whitespace-nowrap transition-colors ${
                  active
                    ? 'bg-[#111111] text-white shadow-xs'
                    : 'bg-white text-neutral-700 hover:bg-neutral-100 border border-neutral-200'
                }`}
              >
                <Icon size={15} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* ========================================================
            TAB 1: DASHBOARD OVERVIEW
            ======================================================== */}
        {currentTab === 'overview' && (
          <div className="space-y-8">
            {/* 4 Cards Requirement */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-6 rounded-sm border border-neutral-200 shadow-xs space-y-2">
                <div className="flex items-center justify-between text-neutral-400">
                  <span className="text-xs uppercase tracking-wider font-semibold">Total Demo Products</span>
                  <Package size={18} />
                </div>
                <div className="text-3xl font-mono font-bold text-neutral-900 tabular-nums">
                  {products.length}
                </div>
                <p className="text-[11px] text-neutral-500">Across 5 departments</p>
              </div>

              <div className="bg-white p-6 rounded-sm border border-neutral-200 shadow-xs space-y-2">
                <div className="flex items-center justify-between text-neutral-400">
                  <span className="text-xs uppercase tracking-wider font-semibold">Demo Orders</span>
                  <ShoppingCart size={18} />
                </div>
                <div className="text-3xl font-mono font-bold text-neutral-900 tabular-nums">
                  {orders.length}
                </div>
                <p className="text-[11px] text-emerald-600 font-medium">100% simulated fulfillment</p>
              </div>

              <div className="bg-white p-6 rounded-sm border border-neutral-200 shadow-xs space-y-2">
                <div className="flex items-center justify-between text-neutral-400">
                  <span className="text-xs uppercase tracking-wider font-semibold">Demo Revenue</span>
                  <DollarSign size={18} />
                </div>
                <div className="text-3xl font-mono font-bold text-neutral-900 tabular-nums">
                  {formatCentsToUSD(totalRevenueCents)}
                </div>
                <p className="text-[11px] text-neutral-500">Calculated in integer cents</p>
              </div>

              <div className="bg-white p-6 rounded-sm border border-neutral-200 shadow-xs space-y-2">
                <div className="flex items-center justify-between text-amber-500">
                  <span className="text-xs uppercase tracking-wider font-semibold text-neutral-700">Low Stock Styles</span>
                  <AlertTriangle size={18} />
                </div>
                <div className="text-3xl font-mono font-bold text-amber-600 tabular-nums">
                  {lowStockCount}
                </div>
                <p className="text-[11px] text-neutral-500">&lt; 20 units remaining</p>
              </div>
            </div>

            {/* Recent Orders Overview */}
            <div className="bg-white border border-neutral-200 rounded-sm p-6 space-y-4 shadow-xs">
              <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
                <h2 className="font-serif font-bold text-base text-neutral-900">
                  Recent Simulated Orders
                </h2>
                <button
                  onClick={() => setTab('orders')}
                  className="text-xs text-neutral-600 hover:text-black font-semibold flex items-center gap-1"
                >
                  <span>Manage All Orders</span>
                  <ArrowRight size={12} />
                </button>
              </div>

              <div className="overflow-x-auto text-xs">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-neutral-200 text-neutral-400 font-mono text-[11px]">
                      <th className="py-2.5">Order ID</th>
                      <th className="py-2.5">Customer</th>
                      <th className="py-2.5">Items</th>
                      <th className="py-2.5">Total (USD)</th>
                      <th className="py-2.5">Status</th>
                      <th className="py-2.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100 tabular-nums">
                    {orders.slice(0, 5).map((ord) => (
                      <tr key={ord.id} className="hover:bg-neutral-50">
                        <td className="py-3 font-mono font-semibold text-neutral-900">{ord.id}</td>
                        <td className="py-3 text-neutral-700">{ord.shippingAddress.fullName}</td>
                        <td className="py-3 text-neutral-500">{ord.items.length} garments</td>
                        <td className="py-3 font-mono font-semibold text-neutral-900">
                          {formatCentsToUSD(ord.totalCents)}
                        </td>
                        <td className="py-3">
                          <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-neutral-100 text-neutral-800 border border-neutral-200">
                            {ord.status}
                          </span>
                        </td>
                        <td className="py-3 text-right">
                          <Link
                            to={`/order-tracking?tracking=${encodeURIComponent(ord.trackingNumber)}`}
                            className="text-xs text-neutral-600 hover:text-black underline"
                          >
                            Track
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================
            TAB 2: PRODUCT MANAGEMENT
            ======================================================== */}
        {currentTab === 'products' && (
          <div className="bg-white border border-neutral-200 rounded-sm p-6 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="relative w-full sm:w-80">
                <Search size={16} className="absolute left-3 top-3 text-neutral-400" />
                <input
                  type="text"
                  placeholder="Filter products by name or SKU..."
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs border border-neutral-200 rounded bg-[#FBFBFA] focus:outline-none focus:border-neutral-900"
                />
              </div>

              <div className="text-xs text-neutral-500 font-mono">
                Catalog: <strong>{adminFilteredProducts.length}</strong> items
              </div>
            </div>

            <div className="overflow-x-auto text-xs">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-neutral-200 text-neutral-400 font-mono text-[11px]">
                    <th className="py-3 px-2">Image</th>
                    <th className="py-3">Name & SKU</th>
                    <th className="py-3">Category</th>
                    <th className="py-3">Price (USD)</th>
                    <th className="py-3">Demo Stock</th>
                    <th className="py-3">Flags</th>
                    <th className="py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100 tabular-nums">
                  {adminFilteredProducts.map((p) => (
                    <tr key={p.id} className="hover:bg-neutral-50">
                      <td className="py-2.5 px-2">
                        <div className="w-10 h-12 bg-neutral-100 rounded overflow-hidden">
                          <SafeImage src={p.images[0]} alt="" className="w-full h-full object-cover" />
                        </div>
                      </td>
                      <td className="py-2.5">
                        <strong className="block text-neutral-900 font-semibold">{p.name}</strong>
                        <span className="text-[10px] text-neutral-400 font-mono">{p.sku}</span>
                      </td>
                      <td className="py-2.5 uppercase text-neutral-600 text-[11px]">
                        {p.category} · {p.subCategory}
                      </td>
                      <td className="py-2.5 font-mono font-bold text-neutral-900">
                        {formatCentsToUSD(p.priceCents)}
                      </td>
                      <td className="py-2.5 font-mono">
                        <span className={`px-2 py-0.5 rounded text-[10px] ${p.demoStockQuantity < 20 ? 'bg-amber-100 text-amber-800' : 'bg-neutral-100 text-neutral-700'}`}>
                          {p.demoStockQuantity} in stock
                        </span>
                      </td>
                      <td className="py-2.5 text-[10px] space-x-1">
                        {p.isBestSeller && <span className="bg-black text-white px-1.5 py-0.5 rounded">Best</span>}
                        {p.isNewArrival && <span className="bg-neutral-200 text-neutral-800 px-1.5 py-0.5 rounded">New</span>}
                      </td>
                      <td className="py-2.5 text-right space-x-2">
                        <button
                          onClick={() => handleOpenEdit(p)}
                          className="p-1.5 text-neutral-600 hover:text-black border border-neutral-200 rounded"
                          title="Edit Product"
                        >
                          <Edit3 size={14} />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(p.id, p.name)}
                          className="p-1.5 text-neutral-400 hover:text-red-600 border border-neutral-200 rounded"
                          title="Delete Product"
                        >
                          <Trash2 size={14} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ========================================================
            TAB 3: ORDERS MANAGEMENT
            ======================================================== */}
        {currentTab === 'orders' && (
          <div className="bg-white border border-neutral-200 rounded-sm p-6 shadow-xs space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-neutral-100">
              <h2 className="font-serif font-bold text-base text-neutral-900">
                Customer Demo Orders ({orders.length})
              </h2>
              <span className="text-xs text-neutral-500 font-mono">Real-time status updater</span>
            </div>

            <div className="overflow-x-auto text-xs">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-neutral-200 text-neutral-400 font-mono text-[11px]">
                    <th className="py-3">Order ID</th>
                    <th className="py-3">Date</th>
                    <th className="py-3">Customer</th>
                    <th className="py-3">Destination</th>
                    <th className="py-3">Total (USD)</th>
                    <th className="py-3">Status Control</th>
                    <th className="py-3 text-right">Receipt</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100 tabular-nums">
                  {orders.map((ord) => (
                    <tr key={ord.id} className="hover:bg-neutral-50">
                      <td className="py-3 font-mono font-bold text-neutral-900">{ord.id}</td>
                      <td className="py-3 text-neutral-500">
                        {new Date(ord.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-3">
                        <strong className="block text-neutral-900">{ord.shippingAddress.fullName}</strong>
                        <span className="text-neutral-400 text-[11px]">{ord.shippingAddress.email}</span>
                      </td>
                      <td className="py-3 text-neutral-600">
                        {ord.shippingAddress.city}, {ord.shippingAddress.country}
                      </td>
                      <td className="py-3 font-mono font-bold text-neutral-900">
                        {formatCentsToUSD(ord.totalCents)}
                      </td>
                      <td className="py-3">
                        <select
                          value={ord.status}
                          onChange={(e) => handleStatusChange(ord.id, e.target.value as OrderStatus)}
                          className="border border-neutral-300 rounded px-2 py-1 text-xs bg-white text-neutral-800 font-medium focus:outline-none focus:border-neutral-900"
                        >
                          <option value="Confirmed">Confirmed</option>
                          <option value="Processing">Processing</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Out for Delivery">Out for Delivery</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </td>
                      <td className="py-3 text-right">
                        <Link
                          to={`/order-tracking?tracking=${encodeURIComponent(ord.trackingNumber)}`}
                          className="text-xs text-neutral-600 hover:text-black underline"
                        >
                          View Tracking
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ========================================================
            TAB 4: INVENTORY
            ======================================================== */}
        {currentTab === 'inventory' && (
          <div className="bg-white border border-neutral-200 rounded-sm p-6 shadow-xs space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-neutral-100">
              <div>
                <h2 className="font-serif font-bold text-base text-neutral-900">
                  Stock Level Controls
                </h2>
                <p className="text-xs text-neutral-500">
                  Adjust live stock numbers with instant reflection across PDP and cart validation.
                </p>
              </div>
              <span className="text-xs font-mono text-amber-700 bg-amber-50 px-2.5 py-1 rounded">
                {lowStockCount} Styles Under Low Stock Threshold (&lt;20)
              </span>
            </div>

            <div className="overflow-x-auto text-xs">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-neutral-200 text-neutral-400 font-mono text-[11px]">
                    <th className="py-3">Product</th>
                    <th className="py-3">SKU</th>
                    <th className="py-3">Unit Price (USD)</th>
                    <th className="py-3">Current Stock</th>
                    <th className="py-3">Quick Stepper</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100 tabular-nums">
                  {products.map((p) => (
                    <tr key={p.id} className="hover:bg-neutral-50">
                      <td className="py-3">
                        <strong className="block text-neutral-900">{p.name}</strong>
                        <span className="text-[11px] text-neutral-400 uppercase">{p.category}</span>
                      </td>
                      <td className="py-3 font-mono text-neutral-500">{p.sku}</td>
                      <td className="py-3 font-mono text-neutral-900 font-semibold">
                        {formatCentsToUSD(p.priceCents)}
                      </td>
                      <td className="py-3">
                        <span
                          className={`font-mono font-bold px-2.5 py-1 rounded text-xs ${
                            p.demoStockQuantity < 20
                              ? 'bg-amber-100 text-amber-900 border border-amber-200'
                              : 'bg-emerald-50 text-emerald-800'
                          }`}
                        >
                          {p.demoStockQuantity} units
                        </span>
                      </td>
                      <td className="py-3">
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleStockAdjust(p.id, -5)}
                            className="px-2 py-1 border border-neutral-200 bg-white hover:bg-neutral-100 rounded text-xs"
                            title="-5 units"
                          >
                            -5
                          </button>
                          <button
                            onClick={() => handleStockAdjust(p.id, -1)}
                            className="px-2 py-1 border border-neutral-200 bg-white hover:bg-neutral-100 rounded text-xs"
                            title="-1 unit"
                          >
                            -1
                          </button>
                          <button
                            onClick={() => handleStockAdjust(p.id, 1)}
                            className="px-2 py-1 border border-neutral-200 bg-white hover:bg-neutral-100 rounded text-xs"
                            title="+1 unit"
                          >
                            +1
                          </button>
                          <button
                            onClick={() => handleStockAdjust(p.id, 10)}
                            className="px-2 py-1 border border-neutral-200 bg-white hover:bg-neutral-100 rounded text-xs"
                            title="+10 units"
                          >
                            +10
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ========================================================
            TAB 5: CUSTOMERS
            ======================================================== */}
        {currentTab === 'customers' && (
          <div className="bg-white border border-neutral-200 rounded-sm p-6 shadow-xs space-y-6">
            <h2 className="font-serif font-bold text-base text-neutral-900 pb-3 border-b border-neutral-100">
              Registered Client Directory ({customers.length})
            </h2>

            <div className="overflow-x-auto text-xs">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-neutral-200 text-neutral-400 font-mono text-[11px]">
                    <th className="py-3">Client Name</th>
                    <th className="py-3">Email Address</th>
                    <th className="py-3">Contact</th>
                    <th className="py-3">Role</th>
                    <th className="py-3">Joined</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {customers.map((c) => (
                    <tr key={c.id} className="hover:bg-neutral-50">
                      <td className="py-3 font-semibold text-neutral-900">{c.fullName}</td>
                      <td className="py-3 font-mono text-neutral-600">{c.email}</td>
                      <td className="py-3 font-mono text-neutral-500">{c.phone || 'N/A'}</td>
                      <td className="py-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${
                          c.role === 'admin' ? 'bg-neutral-900 text-white' : 'bg-neutral-100 text-neutral-800'
                        }`}>
                          {c.role}
                        </span>
                      </td>
                      <td className="py-3 text-neutral-500">{c.joinedDate}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ========================================================
            TAB 6: ANALYTICS
            ======================================================== */}
        {currentTab === 'analytics' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-sm border border-neutral-200 shadow-xs space-y-2">
                <span className="text-xs uppercase font-semibold text-neutral-400">
                  Average Order Value (AOV)
                </span>
                <div className="text-2xl font-mono font-bold text-neutral-900 tabular-nums">
                  {orders.length > 0 ? formatCentsToUSD(Math.round(totalRevenueCents / orders.length)) : '$0.00'}
                </div>
                <p className="text-[11px] text-neutral-500">Based on {orders.length} simulated orders</p>
              </div>

              <div className="bg-white p-6 rounded-sm border border-neutral-200 shadow-xs space-y-2">
                <span className="text-xs uppercase font-semibold text-neutral-400">
                  Estimated Gross Margin
                </span>
                <div className="text-2xl font-mono font-bold text-emerald-700 tabular-nums">
                  68.4%
                </div>
                <p className="text-[11px] text-neutral-500">Direct-to-consumer luxury model</p>
              </div>

              <div className="bg-white p-6 rounded-sm border border-neutral-200 shadow-xs space-y-2">
                <span className="text-xs uppercase font-semibold text-neutral-400">
                  Free Shipping Rate
                </span>
                <div className="text-2xl font-mono font-bold text-neutral-900 tabular-nums">
                  85.2%
                </div>
                <p className="text-[11px] text-neutral-500">Orders qualifying for &gt;$100 USD waiver</p>
              </div>
            </div>

            <div className="bg-white border border-neutral-200 p-6 rounded-sm shadow-xs space-y-4">
              <h2 className="font-serif font-bold text-base text-neutral-900">
                Department Revenue Contribution
              </h2>
              <div className="space-y-3 text-xs">
                {[
                  { name: "Men's Tailoring & Essentials", share: 42, color: 'bg-neutral-900' },
                  { name: "Women's Silks & Outerwear", share: 36, color: 'bg-neutral-700' },
                  { name: "Footwear & Fine Leather", share: 14, color: 'bg-neutral-500' },
                  { name: "Kids Organic Apparel", share: 8, color: 'bg-neutral-300' },
                ].map((dep) => (
                  <div key={dep.name} className="space-y-1">
                    <div className="flex justify-between font-medium">
                      <span>{dep.name}</span>
                      <span className="font-mono">{dep.share}%</span>
                    </div>
                    <div className="w-full bg-neutral-100 h-2 rounded-full overflow-hidden">
                      <div className={`${dep.color} h-full`} style={{ width: `${dep.share}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================
            TAB 7: SPRING BOOT SETTINGS & INTEGRATION ARCHITECTURE
            ======================================================== */}
        {currentTab === 'settings' && (
          <div className="bg-white border border-neutral-200 rounded-sm p-6 sm:p-8 shadow-xs space-y-6">
            <div>
              <h2 className="font-serif font-bold text-lg text-neutral-900">
                Java Spring Boot Integration Architecture
              </h2>
              <p className="text-xs text-neutral-500 mt-1">
                Configure future REST microservice endpoints and inspect service contracts.
              </p>
            </div>

            <div className="p-4 bg-[#F8F7F4] border border-neutral-200 rounded text-xs space-y-3">
              <strong className="block text-neutral-900 font-semibold">Active API Adapter Status:</strong>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span className="font-mono text-neutral-700">
                  {API_CONFIG.useMockAdapter ? 'Client MockService Adapter (Active Portfolio Mode)' : 'Live Spring Boot REST Controller'}
                </span>
              </div>
              <div className="pt-2 text-neutral-600 space-y-1 font-mono text-[11px]">
                <p>Configured Base URL: <strong>{API_CONFIG.baseUrl}</strong></p>
                <p>Request Timeout: <strong>{API_CONFIG.timeoutMs}ms</strong></p>
              </div>
            </div>

            {/* Endpoints Table */}
            <div className="space-y-3">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-800">
                Mapped Spring Boot REST Controller Endpoints:
              </h3>
              <div className="overflow-x-auto text-xs">
                <table className="w-full text-left border-collapse font-mono text-[11px]">
                  <thead>
                    <tr className="border-b border-neutral-200 text-neutral-400">
                      <th className="py-2">Method</th>
                      <th className="py-2">Endpoint</th>
                      <th className="py-2">Target Controller</th>
                      <th className="py-2">Purpose</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100">
                    <tr><td className="py-2 text-sky-700 font-bold">GET</td><td>/api/products</td><td>ProductController.java</td><td>Query catalog with pagination</td></tr>
                    <tr><td className="py-2 text-sky-700 font-bold">GET</td><td>/api/products/{`{id}`}</td><td>ProductController.java</td><td>Fetch individual product with inventory</td></tr>
                    <tr><td className="py-2 text-emerald-700 font-bold">POST</td><td>/api/orders</td><td>OrderController.java</td><td>Create purchase and dispatch Kafka event</td></tr>
                    <tr><td className="py-2 text-emerald-700 font-bold">POST</td><td>/api/auth/login</td><td>AuthController.java</td><td>Spring Security JWT authentication</td></tr>
                    <tr><td className="py-2 text-sky-700 font-bold">GET</td><td>/api/customer/profile</td><td>CustomerController.java</td><td>User profile & saved addresses</td></tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Add / Edit Product Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto p-4 flex items-center justify-center">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs" onClick={() => setIsAddModalOpen(false)} />
          <div className="relative bg-white w-full max-w-xl p-6 sm:p-8 rounded-sm shadow-2xl z-10 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center pb-3 border-b border-neutral-200 mb-6">
              <h2 className="font-serif font-bold text-lg text-neutral-900">
                {editingProduct ? `Edit Style: ${editingProduct.name}` : 'Add New Demo Product'}
              </h2>
              <button onClick={() => setIsAddModalOpen(false)} className="text-neutral-400 hover:text-black">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
              <div>
                <label className="block text-neutral-700 font-semibold mb-1">Product Title *</label>
                <input
                  type="text"
                  required
                  value={prodForm.name}
                  onChange={(e) => setProdForm({ ...prodForm, name: e.target.value })}
                  placeholder="e.g. Cashmere Relaxed Crewneck"
                  className="w-full border border-neutral-200 p-2.5 rounded bg-[#FBFBFA] focus:outline-none focus:border-neutral-900"
                />
              </div>

              <div>
                <label className="block text-neutral-700 font-semibold mb-1">Subtitle / Material Spec</label>
                <input
                  type="text"
                  value={prodForm.subtitle}
                  onChange={(e) => setProdForm({ ...prodForm, subtitle: e.target.value })}
                  placeholder="e.g. 100% Mongolian Cashmere 12-gauge knit"
                  className="w-full border border-neutral-200 p-2.5 rounded bg-[#FBFBFA] focus:outline-none focus:border-neutral-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-700 font-semibold mb-1">Category *</label>
                  <select
                    value={prodForm.category}
                    onChange={(e) => setProdForm({ ...prodForm, category: e.target.value as ProductCategory })}
                    className="w-full border border-neutral-200 p-2.5 rounded bg-[#FBFBFA] focus:outline-none focus:border-neutral-900"
                  >
                    <option value="men">Men</option>
                    <option value="women">Women</option>
                    <option value="kids">Kids</option>
                    <option value="accessories">Accessories</option>
                    <option value="footwear">Footwear</option>
                  </select>
                </div>

                <div>
                  <label className="block text-neutral-700 font-semibold mb-1">Subcategory *</label>
                  <input
                    type="text"
                    value={prodForm.subCategory}
                    onChange={(e) => setProdForm({ ...prodForm, subCategory: e.target.value })}
                    placeholder="e.g. hoodies, t-shirts, jackets"
                    className="w-full border border-neutral-200 p-2.5 rounded bg-[#FBFBFA] focus:outline-none focus:border-neutral-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-700 font-semibold mb-1">Price (USD Dollars) *</label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-neutral-500 font-mono">$</span>
                    <input
                      type="number"
                      step="0.01"
                      required
                      value={prodForm.priceDollars}
                      onChange={(e) => setProdForm({ ...prodForm, priceDollars: e.target.value })}
                      className="w-full pl-7 pr-3 py-2.5 border border-neutral-200 rounded bg-[#FBFBFA] font-mono focus:outline-none focus:border-neutral-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-neutral-700 font-semibold mb-1">Stock Quantity *</label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={prodForm.stock}
                    onChange={(e) => setProdForm({ ...prodForm, stock: Number(e.target.value) })}
                    className="w-full border border-neutral-200 p-2.5 rounded bg-[#FBFBFA] font-mono focus:outline-none focus:border-neutral-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-neutral-700 font-semibold mb-1">Available Sizes (comma separated)</label>
                <input
                  type="text"
                  value={prodForm.sizes}
                  onChange={(e) => setProdForm({ ...prodForm, sizes: e.target.value })}
                  placeholder="XS, S, M, L, XL"
                  className="w-full border border-neutral-200 p-2.5 rounded bg-[#FBFBFA] focus:outline-none focus:border-neutral-900"
                />
              </div>

              <div>
                <label className="block text-neutral-700 font-semibold mb-1">Product Image URL</label>
                <input
                  type="url"
                  value={prodForm.imageUrl}
                  onChange={(e) => setProdForm({ ...prodForm, imageUrl: e.target.value })}
                  placeholder="https://..."
                  className="w-full border border-neutral-200 p-2.5 rounded bg-[#FBFBFA] focus:outline-none focus:border-neutral-900"
                />
              </div>

              <div>
                <label className="block text-neutral-700 font-semibold mb-1">Full Description</label>
                <textarea
                  rows={3}
                  value={prodForm.description}
                  onChange={(e) => setProdForm({ ...prodForm, description: e.target.value })}
                  className="w-full border border-neutral-200 p-2.5 rounded bg-[#FBFBFA] focus:outline-none focus:border-neutral-900 resize-none"
                  placeholder="Crafted from premium long-staple cotton..."
                />
              </div>

              <div className="flex gap-4 pt-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={prodForm.isNewArrival}
                    onChange={(e) => setProdForm({ ...prodForm, isNewArrival: e.target.checked })}
                    className="rounded text-black"
                  />
                  <span>Mark as New Arrival</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={prodForm.isBestSeller}
                    onChange={(e) => setProdForm({ ...prodForm, isBestSeller: e.target.checked })}
                    className="rounded text-black"
                  />
                  <span>Mark as Best Seller</span>
                </label>
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-neutral-200">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 border border-neutral-300 text-neutral-700 rounded hover:bg-neutral-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-[#111111] hover:bg-black text-white font-semibold rounded uppercase tracking-wider"
                >
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
