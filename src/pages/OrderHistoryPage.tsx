import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, ExternalLink, ArrowRight, Truck, CheckCircle2 } from 'lucide-react';
import { OrderService } from '../services/OrderService';
import { DemoOrder } from '../types/order';
import { formatCentsToUSD } from '../utils/currency';
import { SafeImage } from '../components/common/SafeImage';

export const OrderHistoryPage: React.FC = () => {
  const [orders, setOrders] = useState<DemoOrder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const list = await OrderService.getAllOrders();
        setOrders(list);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Delivered':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Shipped':
      case 'Out for Delivery':
        return 'bg-sky-50 text-sky-700 border-sky-200';
      case 'Cancelled':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      default:
        return 'bg-amber-50 text-amber-700 border-amber-200';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pb-24">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between pb-6 border-b border-neutral-200 mb-8 gap-4">
        <div>
          <span className="text-xs uppercase tracking-widest text-neutral-500 font-semibold block mb-1">
            Simulated Purchases
          </span>
          <h1 className="text-3xl font-serif font-bold text-neutral-900">
            Order History
          </h1>
        </div>

        <Link
          to="/order-tracking"
          className="text-xs font-semibold text-neutral-800 hover:text-black flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Truck size={14} />
          <span>Track Any Package →</span>
        </Link>
      </div>

      {loading ? (
        <div className="py-20 text-center text-neutral-400 text-xs">
          Loading order history...
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-20 bg-white border border-neutral-100 rounded-sm p-8">
          <Package size={48} strokeWidth={1} className="text-neutral-300 mx-auto mb-4" />
          <h2 className="font-serif text-xl font-bold text-neutral-800 mb-2">No demo orders yet</h2>
          <p className="text-xs text-neutral-500 max-w-sm mx-auto mb-6">
            Place a simulated order through our checkout to see it recorded and track its simulated progress.
          </p>
          <Link
            to="/shop"
            className="inline-block bg-[#111111] text-white text-xs font-semibold px-8 py-3.5 uppercase tracking-wider hover:bg-neutral-800 transition-colors"
          >
            Start Browsing
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white border border-neutral-200 rounded-sm overflow-hidden shadow-xs"
            >
              {/* Order Card Header */}
              <div className="bg-[#F8F7F4] p-4 sm:px-6 flex flex-wrap items-center justify-between gap-4 text-xs border-b border-neutral-200">
                <div className="flex items-center gap-6">
                  <div>
                    <span className="text-neutral-500 block text-[10px] uppercase tracking-wider">
                      Order Placed
                    </span>
                    <strong className="text-neutral-900">
                      {new Date(order.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </strong>
                  </div>

                  <div>
                    <span className="text-neutral-500 block text-[10px] uppercase tracking-wider">
                      Total
                    </span>
                    <strong className="text-neutral-900 font-mono tabular-nums">
                      {formatCentsToUSD(order.totalCents)}
                    </strong>
                  </div>

                  <div className="hidden sm:block">
                    <span className="text-neutral-500 block text-[10px] uppercase tracking-wider">
                      Ship To
                    </span>
                    <strong className="text-neutral-900 truncate max-w-xs block">
                      {order.shippingAddress.fullName}
                    </strong>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className={`px-2.5 py-1 text-[11px] font-medium rounded border ${getStatusBadge(order.status)}`}>
                    {order.status}
                  </span>

                  <span className="text-neutral-400 font-mono font-semibold">
                    {order.id}
                  </span>
                </div>
              </div>

              {/* Items in order */}
              <div className="p-4 sm:p-6 divide-y divide-neutral-100">
                {order.items.map((item) => (
                  <div key={item.id} className="py-4 first:pt-0 last:pb-0 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-18 bg-neutral-100 overflow-hidden rounded-xs shrink-0">
                        <SafeImage
                          src={item.product.images[0]}
                          alt={item.product.name}
                          category={item.product.category}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <h4 className="text-xs sm:text-sm font-semibold text-neutral-900">
                          <Link to={`/product/${item.productId}`} className="hover:underline">
                            {item.product.name}
                          </Link>
                        </h4>
                        <p className="text-[11px] text-neutral-500 mt-0.5">
                          Size: {item.selectedSize} · Color: {item.selectedColor.name} · Qty: {item.quantity}
                        </p>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-xs sm:text-sm font-mono font-bold text-neutral-900 tabular-nums">
                        {formatCentsToUSD(item.unitPriceCents * item.quantity)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Actions Footer */}
              <div className="p-4 bg-white border-t border-neutral-100 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="text-neutral-500 text-[11px]">
                  Carrier: <strong>{order.carrier}</strong> · Est. Delivery: <strong>{order.estimatedDelivery}</strong>
                </div>

                <div className="flex items-center gap-3">
                  <Link
                    to={`/order-tracking?tracking=${encodeURIComponent(order.trackingNumber)}`}
                    className="flex items-center gap-1.5 bg-[#111111] hover:bg-neutral-800 text-white px-4 py-2 rounded text-xs font-medium transition-colors"
                  >
                    <Truck size={14} />
                    <span>Track Package</span>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
