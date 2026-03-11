"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { User, Mail, Lock, Phone, ArrowRight, Loader2, LogIn, UserPlus, Eye, EyeOff } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { registerCustomer, findCustomerByEmail } from "@/lib/auth";
import toast from "react-hot-toast";

export default function AccountPage() {
  const router = useRouter();
  const { isLoggedIn, login } = useAuthStore();
  const [mounted, setMounted] = useState(false);
  const [tab, setTab] = useState<"login" | "register">("login");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Login form
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  // Register form
  const [regForm, setRegForm] = useState({
    first_name: "", last_name: "", email: "", phone: "", username: "", password: "", confirmPassword: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (mounted && isLoggedIn) {
      router.push("/account/profile");
    }
  }, [mounted, isLoggedIn, router]);

  if (!mounted) return null;
  if (isLoggedIn) return null;

  const validateLogin = () => {
    const e: Record<string, string> = {};
    if (!loginForm.email.includes("@")) e.email = "Valid email required";
    if (loginForm.password.length < 1) e.password = "Password required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const validateRegister = () => {
    const e: Record<string, string> = {};
    if (!regForm.first_name.trim()) e.first_name = "Required";
    if (!regForm.last_name.trim()) e.last_name = "Required";
    if (!regForm.email.includes("@")) e.email = "Valid email required";
    if (regForm.phone.length < 10) e.phone = "Valid phone required";
    if (!regForm.username.trim()) e.username = "Required";
    if (regForm.password.length < 6) e.password = "Min 6 characters";
    if (regForm.password !== regForm.confirmPassword) e.confirmPassword = "Passwords don't match";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleLogin = async () => {
    if (!validateLogin()) return;
    setLoading(true);
    try {
      const customer = await findCustomerByEmail(loginForm.email);
      if (!customer) {
        toast.error("No account found with this email. Please register.");
        setLoading(false);
        return;
      }
      login({
        id: customer.id,
        email: customer.email,
        firstName: customer.first_name,
        lastName: customer.last_name,
        phone: customer.billing?.phone || "",
      });
      toast.success(`Welcome back, ${customer.first_name}!`);
      router.push("/account/profile");
    } catch (err: unknown) {
      console.error(err);
      toast.error("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    if (!validateRegister()) return;
    setLoading(true);
    try {
      const customer = await registerCustomer({
        email: regForm.email,
        first_name: regForm.first_name,
        last_name: regForm.last_name,
        username: regForm.username,
        password: regForm.password,
        phone: regForm.phone,
      });
      login({
        id: customer.id,
        email: customer.email,
        firstName: customer.first_name,
        lastName: customer.last_name,
        phone: regForm.phone,
      });
      toast.success("Account created successfully! Welcome to CarpenterBullet!");
      router.push("/account/profile");
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      const msg = error.response?.data?.message || "Registration failed. Please try again.";
      toast.error(msg.replace(/<[^>]*>/g, ""));
    } finally {
      setLoading(false);
    }
  };

  const InputField = ({ label, icon: Icon, type = "text", value, onChange, error, placeholder, name }: {
    label: string; icon: typeof User; type?: string; value: string;
    onChange: (v: string) => void; error?: string; placeholder: string; name: string;
  }) => (
    <div>
      <label className="block text-sm font-medium text-charcoal mb-1">{label}</label>
      <div className="relative">
        <Icon size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-charcoal/40" />
        <input
          type={type === "password" && showPassword ? "text" : type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={`input-field pl-10 ${type === "password" ? "pr-10" : ""} ${error ? "border-red-500" : ""}`}
        />
        {type === "password" && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-charcoal/40 hover:text-charcoal"
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        )}
      </div>
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );

  return (
    <div className="max-w-md mx-auto px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <div className="w-16 h-16 bg-wood-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <User size={28} className="text-cream" />
        </div>
        <h1 className="font-display text-3xl font-bold text-charcoal">My Account</h1>
        <p className="text-charcoal/50 mt-2">Sign in or create a new account</p>
      </motion.div>

      {/* Tabs */}
      <div className="flex bg-cream-200 rounded-xl p-1 mb-6">
        {(["login", "register"] as const).map((t) => (
          <button
            key={t}
            onClick={() => { setTab(t); setErrors({}); }}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-all ${
              tab === t ? "bg-white text-charcoal shadow-sm" : "text-charcoal/50 hover:text-charcoal"
            }`}
          >
            {t === "login" ? <LogIn size={16} /> : <UserPlus size={16} />}
            {t === "login" ? "Sign In" : "Register"}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {tab === "login" ? (
          <motion.div
            key="login"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="bg-white rounded-2xl p-6 shadow-card"
          >
            <div className="space-y-4">
              <InputField
                label="Email" icon={Mail} type="email" name="email"
                value={loginForm.email}
                onChange={(v) => setLoginForm((p) => ({ ...p, email: v }))}
                error={errors.email} placeholder="your@email.com"
              />
              <InputField
                label="Password" icon={Lock} type="password" name="password"
                value={loginForm.password}
                onChange={(v) => setLoginForm((p) => ({ ...p, password: v }))}
                error={errors.password} placeholder="Enter your password"
              />
            </div>
            <button
              onClick={handleLogin}
              disabled={loading}
              className="btn-primary w-full mt-6 flex items-center justify-center gap-2 py-3"
            >
              {loading ? <Loader2 size={18} className="animate-spin" /> : <LogIn size={18} />}
              {loading ? "Signing in..." : "Sign In"}
            </button>
            <p className="text-center text-sm text-charcoal/50 mt-4">
              Don&apos;t have an account?{" "}
              <button onClick={() => setTab("register")} className="text-wood-600 font-semibold hover:underline">
                Register
              </button>
            </p>
          </motion.div>
        ) : (
          <motion.div
            key="register"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="bg-white rounded-2xl p-6 shadow-card"
          >
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <InputField
                  label="First Name" icon={User} name="first_name"
                  value={regForm.first_name}
                  onChange={(v) => setRegForm((p) => ({ ...p, first_name: v }))}
                  error={errors.first_name} placeholder="Rahul"
                />
                <InputField
                  label="Last Name" icon={User} name="last_name"
                  value={regForm.last_name}
                  onChange={(v) => setRegForm((p) => ({ ...p, last_name: v }))}
                  error={errors.last_name} placeholder="Kumar"
                />
              </div>
              <InputField
                label="Email" icon={Mail} type="email" name="email"
                value={regForm.email}
                onChange={(v) => setRegForm((p) => ({ ...p, email: v }))}
                error={errors.email} placeholder="your@email.com"
              />
              <InputField
                label="Phone" icon={Phone} type="tel" name="phone"
                value={regForm.phone}
                onChange={(v) => setRegForm((p) => ({ ...p, phone: v }))}
                error={errors.phone} placeholder="+91 98765 43210"
              />
              <InputField
                label="Username" icon={User} name="username"
                value={regForm.username}
                onChange={(v) => setRegForm((p) => ({ ...p, username: v }))}
                error={errors.username} placeholder="rahulkumar"
              />
              <InputField
                label="Password" icon={Lock} type="password" name="password"
                value={regForm.password}
                onChange={(v) => setRegForm((p) => ({ ...p, password: v }))}
                error={errors.password} placeholder="Min 6 characters"
              />
              <InputField
                label="Confirm Password" icon={Lock} type="password" name="confirmPassword"
                value={regForm.confirmPassword}
                onChange={(v) => setRegForm((p) => ({ ...p, confirmPassword: v }))}
                error={errors.confirmPassword} placeholder="Re-enter password"
              />
            </div>
            <button
              onClick={handleRegister}
              disabled={loading}
              className="btn-primary w-full mt-6 flex items-center justify-center gap-2 py-3"
            >
              {loading ? <Loader2 size={18} className="animate-spin" /> : <UserPlus size={18} />}
              {loading ? "Creating account..." : "Create Account"}
            </button>
            <p className="text-center text-sm text-charcoal/50 mt-4">
              Already have an account?{" "}
              <button onClick={() => setTab("login")} className="text-wood-600 font-semibold hover:underline">
                Sign In
              </button>
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
