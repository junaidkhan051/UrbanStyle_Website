import React, { useState } from 'react';
import { X, Ruler } from 'lucide-react';

interface SizeGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: 'men' | 'women' | 'kids' | 'footwear';
}

export const SizeGuideModal: React.FC<SizeGuideModalProps> = ({
  isOpen,
  onClose,
  defaultTab = 'men',
}) => {
  const [activeTab, setActiveTab] = useState<'men' | 'women' | 'kids' | 'footwear'>(defaultTab);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto p-4 sm:p-6 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/60 backdrop-blur-xs" onClick={onClose} />
      <div className="relative bg-white w-full max-w-2xl shadow-2xl rounded-sm overflow-hidden z-10 p-6 sm:p-8 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between pb-4 border-b border-neutral-100 mb-6">
          <div className="flex items-center gap-2">
            <Ruler size={20} className="text-neutral-900" />
            <h3 className="text-lg font-serif font-bold tracking-wide uppercase text-neutral-900">
              International Sizing Guide
            </h3>
          </div>
          <button onClick={onClose} className="p-1 text-neutral-400 hover:text-black">
            <X size={20} />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="flex gap-2 p-1 bg-neutral-100 rounded mb-6 text-xs font-semibold uppercase tracking-wider">
          {(['men', 'women', 'kids', 'footwear'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-2 text-center rounded transition-colors ${
                activeTab === tab ? 'bg-white text-neutral-900 shadow-xs' : 'text-neutral-500 hover:text-neutral-900'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Sizing Tables */}
        <div className="overflow-x-auto text-xs">
          {activeTab === 'men' && (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-neutral-200 text-neutral-500 font-mono">
                  <th className="py-2.5 px-3">Size</th>
                  <th className="py-2.5 px-3">Chest (in / cm)</th>
                  <th className="py-2.5 px-3">Waist (in / cm)</th>
                  <th className="py-2.5 px-3">Neck (in)</th>
                  <th className="py-2.5 px-3">EU</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 tabular-nums">
                <tr><td className="py-2.5 px-3 font-semibold">XS</td><td>34-36" / 86-91cm</td><td>28-30" / 71-76cm</td><td>14.5"</td><td>44</td></tr>
                <tr><td className="py-2.5 px-3 font-semibold">S</td><td>36-38" / 91-96cm</td><td>30-32" / 76-81cm</td><td>15.0"</td><td>46</td></tr>
                <tr><td className="py-2.5 px-3 font-semibold">M</td><td>38-40" / 96-101cm</td><td>32-34" / 81-86cm</td><td>15.5"</td><td>48</td></tr>
                <tr><td className="py-2.5 px-3 font-semibold">L</td><td>40-42" / 101-106cm</td><td>34-36" / 86-91cm</td><td>16.5"</td><td>52</td></tr>
                <tr><td className="py-2.5 px-3 font-semibold">XL</td><td>42-44" / 106-111cm</td><td>36-38" / 91-96cm</td><td>17.5"</td><td>56</td></tr>
                <tr><td className="py-2.5 px-3 font-semibold">XXL</td><td>44-46" / 111-117cm</td><td>38-40" / 96-101cm</td><td>18.0"</td><td>60</td></tr>
              </tbody>
            </table>
          )}

          {activeTab === 'women' && (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-neutral-200 text-neutral-500 font-mono">
                  <th className="py-2.5 px-3">Size</th>
                  <th className="py-2.5 px-3">Bust (in / cm)</th>
                  <th className="py-2.5 px-3">Waist (in / cm)</th>
                  <th className="py-2.5 px-3">Hips (in / cm)</th>
                  <th className="py-2.5 px-3">US / UK / EU</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 tabular-nums">
                <tr><td className="py-2.5 px-3 font-semibold">XS</td><td>31-33" / 79-84cm</td><td>24-25" / 61-64cm</td><td>34-35" / 86-89cm</td><td>0-2 / 4-6 / 32-34</td></tr>
                <tr><td className="py-2.5 px-3 font-semibold">S</td><td>33-35" / 84-89cm</td><td>26-27" / 66-69cm</td><td>36-37" / 91-94cm</td><td>4-6 / 8-10 / 36-38</td></tr>
                <tr><td className="py-2.5 px-3 font-semibold">M</td><td>35-37" / 89-94cm</td><td>28-29" / 71-74cm</td><td>38-39" / 96-99cm</td><td>8-10 / 12-14 / 40-42</td></tr>
                <tr><td className="py-2.5 px-3 font-semibold">L</td><td>37-40" / 94-101cm</td><td>30-32" / 76-81cm</td><td>40-42" / 101-107cm</td><td>12-14 / 16-18 / 44-46</td></tr>
                <tr><td className="py-2.5 px-3 font-semibold">XL</td><td>40-43" / 101-109cm</td><td>33-35" / 84-89cm</td><td>43-45" / 109-114cm</td><td>16 / 20 / 48</td></tr>
              </tbody>
            </table>
          )}

          {activeTab === 'kids' && (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-neutral-200 text-neutral-500 font-mono">
                  <th className="py-2.5 px-3">Age Group</th>
                  <th className="py-2.5 px-3">Child Height</th>
                  <th className="py-2.5 px-3">Weight Range</th>
                  <th className="py-2.5 px-3">Chest</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 tabular-nums">
                <tr><td className="py-2.5 px-3 font-semibold">2-3Y</td><td>36-38" / 92-98cm</td><td>28-33 lbs / 13-15kg</td><td>20.5" / 52cm</td></tr>
                <tr><td className="py-2.5 px-3 font-semibold">4-5Y</td><td>41-43" / 104-110cm</td><td>38-44 lbs / 17-20kg</td><td>22.5" / 57cm</td></tr>
                <tr><td className="py-2.5 px-3 font-semibold">6-7Y</td><td>46-48" / 116-122cm</td><td>48-56 lbs / 22-25kg</td><td>24.5" / 62cm</td></tr>
                <tr><td className="py-2.5 px-3 font-semibold">8-9Y</td><td>50-53" / 128-134cm</td><td>60-70 lbs / 27-32kg</td><td>26.5" / 67cm</td></tr>
                <tr><td className="py-2.5 px-3 font-semibold">10-11Y</td><td>55-58" / 140-146cm</td><td>75-88 lbs / 34-40kg</td><td>28.5" / 72cm</td></tr>
              </tbody>
            </table>
          )}

          {activeTab === 'footwear' && (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-neutral-200 text-neutral-500 font-mono">
                  <th className="py-2.5 px-3">EU</th>
                  <th className="py-2.5 px-3">US Men</th>
                  <th className="py-2.5 px-3">US Women</th>
                  <th className="py-2.5 px-3">UK</th>
                  <th className="py-2.5 px-3">Foot Length (cm)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 tabular-nums">
                <tr><td className="py-2.5 px-3 font-semibold">39</td><td>6.5</td><td>8.0</td><td>6.0</td><td>24.7 cm</td></tr>
                <tr><td className="py-2.5 px-3 font-semibold">40</td><td>7.5</td><td>9.0</td><td>6.5</td><td>25.4 cm</td></tr>
                <tr><td className="py-2.5 px-3 font-semibold">41</td><td>8.0</td><td>9.5</td><td>7.5</td><td>26.0 cm</td></tr>
                <tr><td className="py-2.5 px-3 font-semibold">42</td><td>9.0</td><td>10.5</td><td>8.5</td><td>26.7 cm</td></tr>
                <tr><td className="py-2.5 px-3 font-semibold">43</td><td>10.0</td><td>11.5</td><td>9.5</td><td>27.3 cm</td></tr>
                <tr><td className="py-2.5 px-3 font-semibold">44</td><td>11.0</td><td>12.5</td><td>10.5</td><td>28.0 cm</td></tr>
                <tr><td className="py-2.5 px-3 font-semibold">45</td><td>12.0</td><td>13.5</td><td>11.5</td><td>28.7 cm</td></tr>
              </tbody>
            </table>
          )}
        </div>

        <p className="mt-6 text-xs text-neutral-500 text-center">
          Between sizes? For relaxed tailoring or oversized cuts, choose your standard size. For tailored fits, size up if between measurements.
        </p>
      </div>
    </div>
  );
};
