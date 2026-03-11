import { Truck, Shield, RefreshCw, Headphones, Award, Leaf } from "lucide-react";

const benefits = [
  { icon: Truck, title: "Free Delivery", desc: "On orders above ₹999" },
  { icon: Shield, title: "Secure Payment", desc: "100% safe & encrypted" },
  { icon: RefreshCw, title: "Easy Returns", desc: "7-day hassle free returns" },
  { icon: Headphones, title: "24/7 Support", desc: "Dedicated help center" },
  { icon: Award, title: "Best Quality", desc: "Premium grade wood" },
  { icon: Leaf, title: "Eco Friendly", desc: "Sustainably sourced" },
];

export default function BenefitsStrip() {
  return (
    <div className="bg-white border-y border-cream-300">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {benefits.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-wood-600/10 flex items-center justify-center shrink-0">
                <Icon size={18} className="text-wood-600" />
              </div>
              <div>
                <p className="font-semibold text-sm text-charcoal">{title}</p>
                <p className="text-xs text-charcoal/50">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
