import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, Truck, CheckCircle2, Clock, MapPin, Package, ArrowRight } from 'lucide-react';
import { OrderService } from '../services/OrderService';
import { DemoOrder } from '../types/order';
import { formatCentsToUSD } from '../utils/currency';
import { SafeImage } from '../components/common/SafeImage';

export const OrderTrackingPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const queryTracking = searchParams.get('tracking') || '';

  const [inputVal, setInputVal] = useState(queryTracking || 'URB-TRK-7749219');
  const [order, setOrder] = useState<DemoOrder | null>(null);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);

  const performSearch = async (query: string) => {
    if (!query.trim()) return;
    setLoading(true);
    setSearched(true);
    try {
      const found = await OrderService.getOrderById(query);
      setOrder(found);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (queryTracking) {
      setInputVal(queryTracking);
      performSearch(queryTracking);
    } else {
      // default initial search for demonstration convenience
      performSearch('URB-TRK-7749219');
    }
  }, [queryTracking]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    performSearch(inputVal);
  };

  const steps = [
    { title: 'Order Confirmed', desc: 'Payment simulated & receipt issued', completed: true },
    { title: 'Processing & Quality Inspection', desc: 'Garments verified and packed at logistics hub', completed: true },
    { title: 'Dispatched with Carrier', desc: 'Handed to DHL Express Worldwide', completed: order?.status !== 'Processing' },
    { title: 'In Transit / Customs Cleared', desc: 'En route to regional distribution center', completed: order?.status === 'Out for Delivery' || order?.status === 'Delivered' },
    { title: 'Delivered', desc: 'Package signed and delivered', completed: order?.status === 'Delivered' },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pb-24">
      {/* Header */}
      <div className="text-center max-w-xl mx-auto mb-10">
        <span className="text-xs uppercase tracking-widest text-neutral-500 font-semibold block mb-1">
          Demo Package Tracker
        </span>
        <h1 className="text-3xl font-serif font-bold text-neutral-900 mb-2">
          Track Your Order
        </h1>
        <p className="text-xs text-neutral-500">
          Enter your simulated Order ID (e.g. <code>ORD-928410</code>) or tracking number to inspect real-time demonstration dispatch logs.
        </p>
      </div>

      {/* Search Input */}
      <div className="bg-white border border-neutral-200 p-4 rounded-sm shadow-xs mb-10">
        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="relative flex-1">
            <Search size={18} className="absolute left-3 top-3 text-neutral-400" />
            <input
              type="text"
              placeholder="Enter Order # (e.g. ORD-928410) or Tracking #"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              className="w-full pl-10 pr-3 py-2.5 text-xs border border-neutral-200 rounded uppercase font-mono focus:outline-none focus:border-neutral-900"
            />
          </div>
          <button
            type="submit"
            className="bg-[#111111] hover:bg-neutral-800 text-white text-xs font-semibold px-6 py-2.5 rounded uppercase tracking-wider transition-colors shrink-0"
          >
            Track Status
          </button>
        </form>
      </div>

      {loading ? (
        <div className="py-16 text-center text-xs text-neutral-400">
          Retrieving simulated shipment telemetry...
        </div>
      ) : order ? (
        <div className="space-y-8">
          {/* Tracking Card */}
          <div className="bg-white border border-neutral-200 rounded-sm p-6 sm:p-8 shadow-xs space-y-8">
            <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-neutral-100">
              <div>
                <span className="text-[10px] text-neutral-400 font-mono uppercase block">Status</span>
                <div className="flex items-center gap-2 mt-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  <h3 className="text-lg font-serif font-bold text-neutral-900">{order.status}</h3>
                </div>
              </div>

              <div>
                <span className="text-[10px] text-neutral-400 font-mono uppercase block">Tracking Number</span>
                <strong className="text-xs font-mono text-neutral-900">{order.trackingNumber}</strong>
              </div>

              <div>
                <span className="text-[10px] text-neutral-400 font-mono uppercase block">Estimated Delivery</span>
                <strong className="text-xs text-neutral-900">{order.estimatedDelivery}</strong>
              </div>

              <div>
                <span className="text-[10px] text-neutral-400 font-mono uppercase block">Carrier</span>
                <span className="text-xs text-neutral-800">{order.carrier}</span>
              </div>
            </div>

            {/* Visual Timeline */}
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-neutral-700 mb-6">
                Shipment Milestones
              </h4>

              <div className="space-y-6 relative pl-6 before:content-[''] before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-[2px] before:bg-neutral-200">
                {steps.map((st, i) => (
                  <div key={i} className="relative flex items-start gap-4 text-xs">
                    <div
                      className={`absolute -left-6 top-0 w-5 h-5 rounded-full flex items-center justify-center ${
                        st.completed ? 'bg-neutral-900 text-white' : 'bg-neutral-200 text-neutral-400'
                      }`}
                    >
                      <CheckCircle2 size={12} />
                    </div>
                    <div>
                      <strong className={`block ${st.completed ? 'text-neutral-900' : 'text-neutral-400'}`}>
                        {st.title}
                      </strong>
                      <p className="text-[11px] text-neutral-500 mt-0.5">{st.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Destination & Package Items */}
            <div className="pt-6 border-t border-neutral-100 grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
              <div className="p-4 bg-[#F8F7F4] rounded-sm space-y-1">
                <span className="font-semibold uppercase tracking-wider text-neutral-700 block mb-2">
                  Destination Address
                </span>
                <p className="text-neutral-900 font-medium">{order.shippingAddress.fullName}</p>
                <p className="text-neutral-600">{order.shippingAddress.address}</p>
                <p className="text-neutral-600">
                  {order.shippingAddress.city}, {order.shippingAddress.stateOrRegion} {order.shippingAddress.postalCode}
                </p>
                <p className="text-neutral-600">{order.shippingAddress.country}</p>
              </div>

              <div className="p-4 bg-[#F8F7F4] rounded-sm space-y-2">
                <span className="font-semibold uppercase tracking-wider text-neutral-700 block mb-2">
                  Shipment Content ({order.items.length} items)
                </span>
                <div className="space-y-2 max-h-36 overflow-y-auto">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex justify-between items-center text-[11px]">
                      <span className="text-neutral-800 truncate mr-2">
                        {item.quantity}× {item.product.name} ({item.selectedSize})
                      </span>
                      <span className="font-mono tabular-nums text-neutral-900">
                        {formatCentsToUSD(item.unitPriceCents * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : searched ? (
        <div className="text-center py-16 bg-white border border-neutral-100 rounded p-8">
          <p className="font-serif text-lg font-bold text-neutral-800 mb-2">
            No demonstration order found for "{inputVal}"
          </p>
          <p className="text-xs text-neutral-500 max-w-sm mx-auto mb-6">
            Make sure to check your demo order ID in your order history or try demo order <code>ORD-928410</code>.
          </p>
          <button
            onClick={() => performSearch('ORD-928410')}
            className="text-xs font-semibold text-neutral-900 underline"
          >
            Load Sample Order (ORD-928410)
          </button>
        </div>
      ) : null}
    </div>
  );
};
