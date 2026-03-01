import { Upload, Search, Package, Cpu, DollarSign, Truck } from 'lucide-react';

const buyerSteps = [
  {
    icon: Upload,
    title: 'Upload Your File',
    description: 'Drop your STL file and select your material. We extract dimensions and show a 3D preview instantly.',
  },
  {
    icon: Search,
    title: 'Find Nearby Makers',
    description: 'Browse available machines filtered by compatibility, distance, and price. See ratings and turnaround times.',
  },
  {
    icon: Package,
    title: 'Get Your Part',
    description: 'Place your order with transparent pricing. Track progress and get your part shipped or pick it up locally.',
  },
];

const sellerSteps = [
  {
    icon: Cpu,
    title: 'List Your Machine',
    description: 'Search our database of 300+ machines for auto-fill, or add custom specs. Set your materials and pricing.',
  },
  {
    icon: DollarSign,
    title: 'Accept Orders',
    description: 'Review incoming requests, accept jobs that fit your schedule. We handle the pricing and shipping labels.',
  },
  {
    icon: Truck,
    title: 'Ship & Earn',
    description: 'Fabricate the part, slap on the prepaid label, and ship. You never pay for shipping out of pocket.',
  },
];

export default function HowItWorks() {
  return (
    <section className="py-20 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-center text-3xl font-bold text-slate-900 mb-4">
          How It Works
        </h2>
        <p className="text-center text-slate-600 mb-16 max-w-xl mx-auto">
          Whether you need a part made or have a machine to put to work, BuildDash connects you in three simple steps.
        </p>

        <div className="grid md:grid-cols-2 gap-16">
          {/* Buyer flow */}
          <div>
            <h3 className="text-lg font-semibold text-orange-600 mb-8 flex items-center gap-2">
              <span className="h-6 w-6 rounded bg-orange-100 flex items-center justify-center text-xs font-bold">B</span>
              For Buyers
            </h3>
            <div className="space-y-8">
              {buyerSteps.map((step, i) => (
                <div key={i} className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-50 text-orange-500">
                      <step.icon className="h-5 w-5" />
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900">{step.title}</h4>
                    <p className="mt-1 text-sm text-slate-600">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Seller flow */}
          <div>
            <h3 className="text-lg font-semibold text-blue-600 mb-8 flex items-center gap-2">
              <span className="h-6 w-6 rounded bg-blue-100 flex items-center justify-center text-xs font-bold">S</span>
              For Sellers
            </h3>
            <div className="space-y-8">
              {sellerSteps.map((step, i) => (
                <div key={i} className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-500">
                      <step.icon className="h-5 w-5" />
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900">{step.title}</h4>
                    <p className="mt-1 text-sm text-slate-600">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
