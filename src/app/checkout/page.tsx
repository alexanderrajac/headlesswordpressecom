"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { QRCodeSVG } from "qrcode.react";
import { useCartStore } from "@/store/cartStore";
import { createOrder, formatPrice } from "@/lib/woocommerce";
import type { CheckoutForm } from "@/types";
import toast from "react-hot-toast";
import { ChevronRight, CheckCircle, CreditCard, MapPin, User, Copy, Check, Loader2 } from "lucide-react";

const STEPS = ["Address", "Review", "Payment"];

const INDIAN_STATES = [
  "Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chhattisgarh","Goa","Gujarat","Haryana",
  "Himachal Pradesh","Jharkhand","Karnataka","Kerala","Madhya Pradesh","Maharashtra","Manipur",
  "Meghalaya","Mizoram","Nagaland","Odisha","Punjab","Rajasthan","Sikkim","Tamil Nadu","Telangana",
  "Tripura","Uttar Pradesh","Uttarakhand","West Bengal","Delhi","Jammu & Kashmir","Ladakh",
];

const UPI_ID = process.env.NEXT_PUBLIC_UPI_ID || "carpenterbullet@upi";
const UPI_NAME = process.env.NEXT_PUBLIC_UPI_NAME || "CarpenterBullet";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getTotalPrice, clearCart } = useCartStore();
  const [mounted, setMounted] = useState(false);
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [orderId, setOrderId] = useState<number | null>(null);
  const [txnVerifying, setTxnVerifying] = useState(false);

  const total = getTotalPrice();
  const shipping = total >= 999 ? 0 : 99;
  const grandTotal = total + shipping;

  const upiUrl = `upi://pay?pa=${UPI_ID}&pn=${encodeURIComponent(UPI_NAME)}&am=${grandTotal}&cu=INR&tn=${encodeURIComponent("CarpenterBullet Order")}`;

  const [form, setForm] = useState<CheckoutForm>({
    first_name: "", last_name: "", email: "", phone: "",
    address_1: "", address_2: "", city: "", state: "Tamil Nadu",
    postcode: "", country: "IN", transaction_id: "", notes: "",
  });

  const [errors, setErrors] = useState<Partial<CheckoutForm>>({});

  useEffect(() => { setMounted(true); }, []);

  const updateForm = (k: keyof CheckoutForm, v: string) => {
    setForm((p) => ({ ...p, [k]: v }));
    setErrors((p) => ({ ...p, [k]: "" }));
  };

  const validateStep0 = () => {
    const e: Partial<CheckoutForm> = {};
    if (!form.first_name.trim()) e.first_name = "Required";
    if (!form.last_name.trim()) e.last_name = "Required";
    if (!form.email.includes("@")) e.email = "Valid email required";
    if (form.phone.length < 10) e.phone = "Valid phone required";
    if (!form.address_1.trim()) e.address_1 = "Required";
    if (!form.city.trim()) e.city = "Required";
    if (!form.postcode.trim()) e.postcode = "Required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handlePlaceOrder = async () => {
    if (!form.transaction_id.trim()) {
      setErrors((p) => ({ ...p, transaction_id: "Please enter your UPI transaction ID" }));
      return;
    }
    setLoading(true);
    try {
      const order = await createOrder({
        payment_method: "upi",
        payment_method_title: "UPI Payment",
        status: "pending",
        billing: {
          first_name: form.first_name, last_name: form.last_name,
          email: form.email, phone: form.phone,
          address_1: form.address_1, address_2: form.address_2,
          city: form.city, state: form.state, postcode: form.postcode, country: "IN",
        },
        shipping: {
          first_name: form.first_name, last_name: form.last_name,
          address_1: form.address_1, address_2: form.address_2,
          city: form.city, state: form.state, postcode: form.postcode, country: "IN",
        },
        line_items: items.map((item) => ({
          product_id: item.id, quantity: item.quantity,
        })),
        meta_data: [
          { key: "upi_transaction_id", value: form.transaction_id },
          { key: "order_notes", value: form.notes },
        ],
      });
      clearCart();
      router.push(`/order-success?orderId=${order.id}&orderKey=${order.order_key}`);
    } catch (err: unknown) {
      console.error(err);
      toast.error("Order failed. Please try again or contact support.");
    } finally {
      setLoading(false);
    }
  };

  const copyUpiId = () => {
    navigator.clipboard.writeText(UPI_ID);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!mounted) return null;

  if (items.length === 0) {
    return (
      <div className="max-w-lg mx-auto px-4 py-20 text-center">
        <p className="font-display text-2xl font-bold mb-4">Your cart is empty</p>
        <button onClick={() => router.push("/products")} className="btn-primary">Shop Now</button>
      </div>
    );
  }

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Steps */}
      <div className="flex items-center justify-center mb-8">
        {STEPS.map((s, i) => (
          <div key={s} className="flex items-center">
            <div
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-semibold transition-colors ${
                i === step ? "bg-wood-600 text-cream" :
                i < step ? "bg-green-100 text-green-700" :
                "bg-cream-200 text-charcoal/40"
              }`}
            >
              {i < step ? <CheckCircle size={14} /> : <span>{i + 1}</span>}
              <span className="hidden sm:block">{s}</span>
            </div>
            {i < STEPS.length - 1 && (
              <ChevronRight size={16} className="mx-2 text-charcoal/30" />
            )}
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main form */}
        <div className="lg:col-span-2">
          <AnimatePresence mode="wait">
            {/* Step 0: Address */}
            {step === 0 && (
              <motion.div key="step0" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}>
                <div className="bg-white rounded-2xl p-6 shadow-card">
                  <h2 className="font-display font-bold text-xl text-charcoal mb-5 flex items-center gap-2">
                    <User size={20} className="text-wood-600" /> Delivery Information
                  </h2>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {[
                      { key: "first_name", label: "First Name", placeholder: "Rahul" },
                      { key: "last_name", label: "Last Name", placeholder: "Sharma" },
                    ].map(({ key, label, placeholder }) => (
                      <div key={key}>
                        <label className="block text-sm font-medium text-charcoal mb-1">{label} *</label>
                        <input
                          value={form[key as keyof CheckoutForm]}
                          onChange={(e) => updateForm(key as keyof CheckoutForm, e.target.value)}
                          placeholder={placeholder}
                          className={`input-field ${errors[key as keyof CheckoutForm] ? "border-red-500" : ""}`}
                        />
                        {errors[key as keyof CheckoutForm] && <p className="text-red-500 text-xs mt-1">{errors[key as keyof CheckoutForm]}</p>}
                      </div>
                    ))}
                    <div>
                      <label className="block text-sm font-medium text-charcoal mb-1">Email *</label>
                      <input
                        type="email"
                        value={form.email}
                        onChange={(e) => updateForm("email", e.target.value)}
                        placeholder="rahul@example.com"
                        className={`input-field ${errors.email ? "border-red-500" : ""}`}
                      />
                      {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-charcoal mb-1">Phone *</label>
                      <input
                        type="tel"
                        value={form.phone}
                        onChange={(e) => updateForm("phone", e.target.value)}
                        placeholder="+91 98765 43210"
                        className={`input-field ${errors.phone ? "border-red-500" : ""}`}
                      />
                      {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-sm font-medium text-charcoal mb-1">Address Line 1 *</label>
                      <input
                        value={form.address_1}
                        onChange={(e) => updateForm("address_1", e.target.value)}
                        placeholder="House No, Street Name"
                        className={`input-field ${errors.address_1 ? "border-red-500" : ""}`}
                      />
                      {errors.address_1 && <p className="text-red-500 text-xs mt-1">{errors.address_1}</p>}
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-sm font-medium text-charcoal mb-1">Address Line 2</label>
                      <input
                        value={form.address_2}
                        onChange={(e) => updateForm("address_2", e.target.value)}
                        placeholder="Landmark, Area (optional)"
                        className="input-field"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-charcoal mb-1">City *</label>
                      <input
                        value={form.city}
                        onChange={(e) => updateForm("city", e.target.value)}
                        placeholder="Chennai"
                        className={`input-field ${errors.city ? "border-red-500" : ""}`}
                      />
                      {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-charcoal mb-1">State *</label>
                      <select
                        value={form.state}
                        onChange={(e) => updateForm("state", e.target.value)}
                        className="input-field"
                      >
                        {INDIAN_STATES.map((s) => <option key={s}>{s}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-charcoal mb-1">PIN Code *</label>
                      <input
                        value={form.postcode}
                        onChange={(e) => updateForm("postcode", e.target.value)}
                        placeholder="600001"
                        maxLength={6}
                        className={`input-field ${errors.postcode ? "border-red-500" : ""}`}
                      />
                      {errors.postcode && <p className="text-red-500 text-xs mt-1">{errors.postcode}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-charcoal mb-1">Country</label>
                      <input value="India" disabled className="input-field bg-cream-100 text-charcoal/50 cursor-not-allowed" />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-sm font-medium text-charcoal mb-1">Order Notes (optional)</label>
                      <textarea
                        value={form.notes}
                        onChange={(e) => updateForm("notes", e.target.value)}
                        placeholder="Special instructions for delivery..."
                        rows={3}
                        className="input-field resize-none"
                      />
                    </div>
                  </div>

                  <button
                    onClick={() => validateStep0() && setStep(1)}
                    className="btn-primary w-full mt-6 flex items-center justify-center gap-2 py-4"
                  >
                    Review Order <ChevronRight size={18} />
                  </button>
                </div>
              </motion.div>
            )}

            {/* Step 1: Review */}
            {step === 1 && (
              <motion.div key="step1" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}>
                <div className="bg-white rounded-2xl p-6 shadow-card space-y-6">
                  <h2 className="font-display font-bold text-xl text-charcoal flex items-center gap-2">
                    <MapPin size={20} className="text-wood-600" /> Review Your Order
                  </h2>

                  {/* Delivery address */}
                  <div className="bg-cream-100 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-semibold text-sm text-charcoal">Delivery Address</p>
                      <button onClick={() => setStep(0)} className="text-xs text-wood-600 hover:underline">Edit</button>
                    </div>
                    <p className="text-sm text-charcoal/70">{form.first_name} {form.last_name}</p>
                    <p className="text-sm text-charcoal/70">{form.address_1}{form.address_2 ? `, ${form.address_2}` : ""}</p>
                    <p className="text-sm text-charcoal/70">{form.city}, {form.state} - {form.postcode}</p>
                    <p className="text-sm text-charcoal/70">📞 {form.phone}</p>
                  </div>

                  {/* Items */}
                  <div className="space-y-3">
                    <p className="font-semibold text-sm text-charcoal">Order Items ({items.length})</p>
                    {items.map((item) => (
                      <div key={item.id} className="flex items-center gap-3 py-2 border-b border-cream-300 last:border-0">
                        <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-cream-100 shrink-0">
                          {item.product.images[0] && (
                            <Image src={item.product.images[0].src} alt={item.product.name} fill className="object-cover" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium line-clamp-1" dangerouslySetInnerHTML={{ __html: item.product.name }} />
                          <p className="text-xs text-charcoal/50">Qty: {item.quantity}</p>
                        </div>
                        <p className="font-semibold text-sm">{formatPrice(item.price * item.quantity)}</p>
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-3">
                    <button onClick={() => setStep(0)} className="btn-secondary flex-1 py-3">← Back</button>
                    <button onClick={() => setStep(2)} className="btn-primary flex-1 py-3 flex items-center justify-center gap-2">
                      Pay Now <ChevronRight size={18} />
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 2: Payment */}
            {step === 2 && (
              <motion.div key="step2" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}>
                <div className="bg-white rounded-2xl p-6 shadow-card space-y-6">
                  <h2 className="font-display font-bold text-xl text-charcoal flex items-center gap-2">
                    <CreditCard size={20} className="text-wood-600" /> Pay via UPI
                  </h2>

                  <div className="bg-gradient-to-br from-wood-600 to-wood-700 rounded-2xl p-6 text-cream text-center">
                    <p className="text-cream/70 text-sm mb-1">Amount to Pay</p>
                    <p className="font-display font-bold text-4xl">{formatPrice(grandTotal)}</p>
                    <p className="text-cream/60 text-xs mt-1">Inclusive of all taxes & shipping</p>
                  </div>

                  {/* QR Code */}
                  <div className="flex flex-col items-center gap-4">
                    <p className="font-semibold text-charcoal">Scan QR Code to Pay</p>
                    <div className="bg-white p-4 rounded-2xl shadow-wood border-2 border-wood-600/20">
                      <QRCodeSVG
                        value={upiUrl}
                        size={200}
                        bgColor="#ffffff"
                        fgColor="#2F2F2F"
                        level="M"
                        includeMargin={false}
                      />
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-charcoal/60 mb-1">Or pay directly to UPI ID</p>
                      <div className="flex items-center gap-2 bg-cream-100 rounded-lg px-4 py-2">
                        <span className="font-mono font-semibold text-charcoal">{UPI_ID}</span>
                        <button onClick={copyUpiId} className="text-wood-600 hover:text-wood-700 transition-colors">
                          {copied ? <Check size={16} /> : <Copy size={16} />}
                        </button>
                      </div>
                    </div>
                    <a href={upiUrl} className="sm:hidden btn-primary flex items-center gap-2">
                      Open UPI App
                    </a>
                  </div>

                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                    <p className="text-sm font-semibold text-amber-800 mb-2">📋 Payment Instructions:</p>
                    <ol className="text-sm text-amber-700 space-y-1 list-decimal pl-4">
                      <li>Open any UPI app (GPay, PhonePe, BHIM, Paytm etc.)</li>
                      <li>Scan the QR code or enter UPI ID manually</li>
                      <li>Pay exactly <strong>{formatPrice(grandTotal)}</strong></li>
                      <li>Copy the Transaction/UTR ID from payment confirmation</li>
                      <li>Enter it below and click Place Order</li>
                    </ol>
                  </div>

                  {/* Transaction ID input */}
                  <div>
                    <label className="block text-sm font-semibold text-charcoal mb-2">
                      UPI Transaction ID / UTR Number *
                    </label>
                    <input
                      value={form.transaction_id}
                      onChange={(e) => updateForm("transaction_id", e.target.value)}
                      placeholder="e.g. 408912345678 or T2406123456789"
                      className={`input-field ${errors.transaction_id ? "border-red-500" : ""}`}
                    />
                    {errors.transaction_id && (
                      <p className="text-red-500 text-xs mt-1">{errors.transaction_id}</p>
                    )}
                    <p className="text-xs text-charcoal/50 mt-1">
                      Find this in your UPI app under Payment History → Transaction Details
                    </p>
                  </div>

                  <div className="flex gap-3">
                    <button onClick={() => setStep(1)} className="btn-secondary px-6 py-3">← Back</button>
                    <button
                      onClick={handlePlaceOrder}
                      disabled={loading}
                      className="btn-primary flex-1 py-3 flex items-center justify-center gap-2"
                    >
                      {loading ? (
                        <>
                          <Loader2 size={18} className="animate-spin" />
                          Placing Order...
                        </>
                      ) : (
                        <>
                          <CheckCircle size={18} />
                          Place Order
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Order summary sidebar */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl p-5 shadow-card sticky top-24">
            <h3 className="font-display font-bold text-lg text-charcoal mb-4">Order Summary</h3>
            <div className="space-y-2 mb-4 max-h-64 overflow-y-auto">
              {items.map((item) => (
                <div key={item.id} className="flex items-center gap-2 text-sm">
                  <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-cream-100 shrink-0">
                    {item.product.images[0] && (
                      <Image src={item.product.images[0].src} alt="" fill className="object-cover" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="line-clamp-1 text-charcoal text-xs" dangerouslySetInnerHTML={{ __html: item.product.name }} />
                    <p className="text-charcoal/50 text-xs">×{item.quantity}</p>
                  </div>
                  <p className="font-semibold text-xs shrink-0">{formatPrice(item.price * item.quantity)}</p>
                </div>
              ))}
            </div>
            <div className="border-t border-cream-300 pt-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-charcoal/60">Subtotal</span>
                <span>{formatPrice(total)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-charcoal/60">Shipping</span>
                <span className={shipping === 0 ? "text-green-600 font-semibold" : ""}>
                  {shipping === 0 ? "FREE" : formatPrice(shipping)}
                </span>
              </div>
              <div className="flex justify-between font-bold text-base border-t border-cream-300 pt-2">
                <span>Total</span>
                <span className="text-wood-600">{formatPrice(grandTotal)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
