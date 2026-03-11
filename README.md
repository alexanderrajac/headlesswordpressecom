# CarpenterBullet — Premium Wood Ecommerce

A full-featured Next.js 14 ecommerce frontend for CarpenterBullet, built with Amazon/Flipkart-level functionality and a luxury minimal wood-themed design.

## 🚀 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **State Management**: Zustand (with persistence)
- **Backend**: WooCommerce REST API
- **Payment**: UPI QR Code (no Razorpay)
- **Language**: TypeScript

## 📁 Project Structure

```
src/
├── app/
│   ├── layout.tsx           # Root layout with fonts, navbar, footer
│   ├── page.tsx             # Homepage
│   ├── globals.css          # Global styles + Tailwind
│   ├── products/
│   │   ├── page.tsx         # Product listing with filters
│   │   └── [slug]/page.tsx  # Product detail page
│   ├── cart/page.tsx        # Full cart page
│   ├── checkout/page.tsx    # Checkout with UPI QR
│   ├── order-success/       # Order confirmation
│   └── search/page.tsx      # Search results
├── components/
│   ├── layout/
│   │   ├── Navbar.tsx       # Sticky navbar with search
│   │   └── Footer.tsx       # Full footer
│   ├── home/
│   │   ├── HeroSection.tsx
│   │   ├── BenefitsStrip.tsx
│   │   ├── CategorySection.tsx
│   │   ├── FeaturedProducts.tsx
│   │   ├── TestimonialsSection.tsx
│   │   └── NewsletterSection.tsx
│   ├── product/
│   │   ├── ProductCard.tsx       # Card with quick-add
│   │   ├── ProductDetailClient.tsx  # Full product page
│   │   └── ProductListingClient.tsx # Filters + grid
│   ├── cart/
│   │   ├── CartDrawer.tsx    # Animated slide-out drawer
│   │   └── CartHydration.tsx # SSR hydration
│   └── ui/
│       ├── SearchAutocomplete.tsx  # Live search dropdown
│       └── ProductCardSkeleton.tsx
├── lib/
│   └── woocommerce.ts       # Full WC API client
├── store/
│   └── cartStore.ts         # Zustand cart state
└── types/
    └── index.ts             # TypeScript interfaces
```

## ⚡ Features

### Shopping
- ✅ Advanced search with autocomplete & recent searches
- ✅ Product filters: price, category, rating, stock
- ✅ Product cards with quick-add button
- ✅ Product gallery with zoom
- ✅ Product reviews & ratings
- ✅ Related products
- ✅ Sticky add-to-cart button
- ✅ Cart drawer with animations
- ✅ Full cart management

### Checkout
- ✅ Multi-step checkout (Address → Review → Payment)
- ✅ UPI QR Code generation
- ✅ Copy UPI ID button
- ✅ Deep link for mobile UPI apps
- ✅ Transaction ID verification
- ✅ Order placed via WooCommerce API
- ✅ Order success with confetti

### Design
- ✅ Wood Brown (#8B5E3C) + Cream (#F5F1E8) + Charcoal (#2F2F2F) palette
- ✅ Luxury minimal + Amazon usability
- ✅ Framer Motion animations throughout
- ✅ Mobile-first responsive design
- ✅ Next.js Image optimization
- ✅ Lazy loading

## 🛠️ Local Setup

```bash
# Clone and install
npm install

# Add environment variables
cp .env.local.example .env.local
# Edit .env.local with your credentials

# Start development
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 🌍 Deploy to Vercel

### Option 1: Vercel CLI (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variables
vercel env add NEXT_PUBLIC_WP_URL
vercel env add WC_KEY
vercel env add WC_SECRET
vercel env add NEXT_PUBLIC_UPI_ID
vercel env add NEXT_PUBLIC_UPI_NAME

# Deploy to production
vercel --prod
```

### Option 2: GitHub + Vercel Dashboard

1. Push code to GitHub
2. Go to [vercel.com](https://vercel.com) → New Project
3. Import your GitHub repository
4. Add Environment Variables in Vercel dashboard:
   - `NEXT_PUBLIC_WP_URL` = `https://carpeneterbullet.in.net`
   - `WC_KEY` = your consumer key
   - `WC_SECRET` = your consumer secret
   - `NEXT_PUBLIC_UPI_ID` = your UPI ID (e.g., `shop@upi`)
   - `NEXT_PUBLIC_UPI_NAME` = `CarpenterBullet`
5. Click Deploy

## 🔑 Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `NEXT_PUBLIC_WP_URL` | WordPress site URL | `https://carpeneterbullet.in.net` |
| `WC_KEY` | WooCommerce Consumer Key | `ck_xxxx...` |
| `WC_SECRET` | WooCommerce Consumer Secret | `cs_xxxx...` |
| `NEXT_PUBLIC_UPI_ID` | Your UPI ID | `carpenterbullet@upi` |
| `NEXT_PUBLIC_UPI_NAME` | Business name for UPI | `CarpenterBullet` |

## 🏪 WooCommerce Setup

1. In WordPress admin → WooCommerce → Settings → Advanced → REST API
2. Create API key with **Read/Write** permissions
3. Use the Consumer Key and Secret in `.env.local`
4. Ensure CORS is enabled (or use a proxy)
5. Mark some products as "Featured" to show on homepage

## 📱 UPI Payment Flow

1. Customer fills delivery address
2. Reviews order
3. Scans QR code or opens UPI app deep link
4. Pays exact amount
5. Copies Transaction/UTR ID
6. Pastes ID and clicks "Place Order"
7. Order created in WooCommerce with `pending` status
8. Admin verifies payment and updates status to `processing`

## 🎨 Customization

### Colors
Edit `tailwind.config.ts` to change the color palette:
```typescript
colors: {
  wood: { 600: "#8B5E3C" },  // Primary
  cream: { DEFAULT: "#F5F1E8" },  // Background
  charcoal: { DEFAULT: "#2F2F2F" },  // Text
}
```

### UPI QR
Update `NEXT_PUBLIC_UPI_ID` and `NEXT_PUBLIC_UPI_NAME` in env variables.

## 📦 Build

```bash
npm run build
npm start
```
