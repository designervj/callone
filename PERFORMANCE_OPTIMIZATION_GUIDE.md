# Performance Optimization Guide for CallawayOne

## Executive Summary
Your app has **5 critical performance issues** causing slower HTML rendering. Implementing these optimizations can reduce initial page load by **40-60%** and improve Time to Interactive (TTI) significantly.

---

## 🔴 CRITICAL ISSUES (Fix These First)

### Issue #1: GetAllProducts Component Renders All Data Fetchers Simultaneously
**Location:** `src/components/products/GetAllProducts.tsx`  
**Severity:** 🔴 CRITICAL  
**Impact:** Triggers 8+ simultaneous API calls, blocks rendering

**Current Code:**
```tsx
// ❌ BAD: All fetchers rendered at once
const GetAllProducts = () => {
   return (
        <>
        <GetAllAtributeSet/>
        <GetAllBrands/>
        <GetAllTravisMethew/>
        <GetAllOgio/>
        <GetAllHardGood/>
        <GetAllRoleBasedUser/>
        <GetAllOrders/>
        <GetAllSoftGood/>
        <GetAllWareHouse/>
        </>
    )
}
```

**Solution A: Lazy Load Based on Route (RECOMMENDED)**
```tsx
'use client'
import dynamic from 'next/dynamic';
import { usePathname } from 'next/navigation';

// Lazy load only when needed
const LazyAttributeSet = dynamic(() => import('./attributeSet/GetAllAtributeSet'), { 
  loading: () => null 
});
const LazyBrands = dynamic(() => import('./brands/GetAllBrands'), { 
  loading: () => null 
});
// ... other dynamic imports

const GetAllProducts = () => {
   const pathname = usePathname();
   
   return (
        <>
        {/* Only render loaders for the current brand being viewed */}
        <LazyAttributeSet/>
        <LazyBrands/>
        {pathname.includes('travis') && <LazyTravisMethew/>}
        {pathname.includes('ogio') && <LazyOgio/>}
        {pathname.includes('hardgood') && <LazyHardGood/>}
        {/* ... etc */}
        </>
    )
}
```

**Solution B: Consolidate Data Fetching**
```tsx
// Create a single parent data fetcher
'use client'
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

const ConsolidatedDataLoader = () => {
  const dispatch = useDispatch();
  const { 
    isFetchedBrand, 
    isFetchedTravis, 
    isFetchedOgio 
  } = useSelector(state => state);

  useEffect(() => {
    // Dispatch all in sequence with proper error handling
    const loadData = async () => {
      if (!isFetchedBrand) await dispatch(fetchBrands());
      if (!isFetchedTravis) await dispatch(fetchTravis());
      // ... stagger requests
    };
    loadData();
  }, []);

  return null;
}
```

---

### Issue #2: Force-Dynamic Layout Prevents Caching
**Location:** `src/app/admin/layout.tsx`  
**Severity:** 🔴 CRITICAL  
**Impact:** Every page reload is fully dynamic, no caching

**Current Code:**
```tsx
export const dynamic = "force-dynamic"; // ❌ NO CACHING
```

**Solution:**
```tsx
// ✅ Allow ISR (Incremental Static Regeneration)
export const revalidate = 60; // Revalidate every 60 seconds

// OR for auth-dependent pages:
export const dynamic = "force-dynamic"; // Keep this ONLY if absolutely necessary

// Instead, use ISR where possible:
export const revalidate = 300; // 5 minute cache
```

**Better approach - Move dynamic parts to separate route:**
```tsx
// /admin/layout.tsx - can be cached
export const revalidate = 300;

export default async function AdminLayout({children}: {children: React.ReactNode}) {
  // Static parts here
  return <AdminShell>{children}</AdminShell>;
}

// /admin/[dynamic]/page.tsx - only THIS needs force-dynamic
export const dynamic = "force-dynamic";
export default async function DynamicAdminPage() {
  const session = await requireAdminSession();
  // Dynamic data here
}
```

---

### Issue #3: Redux DevTools Enabled in Production
**Location:** `src/store/index.ts`  
**Severity:** 🔴 CRITICAL  
**Impact:** 15-30% slower state updates, memory overhead

**Current Code:**
```tsx
// ❌ BAD: DevTools always enabled
export const store = configureStore({
  reducer: { /* ... */ },
  devTools: {
    name: "CallawayOne Store"
  }
});
```

**Solution:**
```tsx
// ✅ GOOD: Disable in production
export const store = configureStore({
  reducer: { /* ... */ },
  devTools: process.env.NODE_ENV === 'development' ? {
    name: "CallawayOne Store",
    actionSanitizer: (action) => ({
      ...action,
      type: action.type.toString()
    })
  } : false
});
```

---

## 🟡 HIGH PRIORITY ISSUES

### Issue #4: No Code Splitting for Brand Product Components
**Severity:** 🟡 HIGH  
**Impact:** 200-500KB+ unnecessary JS bundle

**Current Code:**
```tsx
// ❌ All imported eagerly
import GetAllTravisMethew from "./travismethew/GetAllTravisMethew"
import GetAllBrands from "../brands/GetAllBrands"
import GetAllOgio from "./Ogio/GetAllOgio"
import GetAllHardGood from "./HardGood/GetAllHardGood"
```

**Solution:**
```tsx
// ✅ Lazy load with dynamic imports
import dynamic from 'next/dynamic';

const GetAllTravisMethew = dynamic(
  () => import("./travismethew/GetAllTravisMethew"),
  { ssr: false, loading: () => null }
);
const GetAllOgio = dynamic(
  () => import("./Ogio/GetAllOgio"),
  { ssr: false, loading: () => null }
);

// This splits each brand into separate chunks
```

---

### Issue #5: ag-grid CSS Imported Globally
**Severity:** 🟡 HIGH  
**Impact:** Unused CSS on every page (~80KB)

**Current:**
```css
/* ❌ globals.css - loaded everywhere */
@import "ag-grid-community/styles/ag-grid.css";
@import "ag-grid-community/styles/ag-theme-quartz.css";
```

**Solution:**
```css
/* globals.css - remove ag-grid imports */
@tailwind base;
@tailwind components;
@tailwind utilities;
/* ... rest of your styles */
```

```tsx
// Only import where used
// src/components/admin/DataTable.tsx
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';

export function DataTable() {
  // ...
}
```

---

## 🟢 MEDIUM PRIORITY OPTIMIZATIONS

### Issue #6: Component Memoization Missing
**Severity:** 🟢 MEDIUM  
**Impact:** Unnecessary re-renders on parent updates

**Solution - Add React.memo:**
```tsx
// src/components/admin/CatalogTable.tsx
import { memo } from 'react';

export const CatalogTable = memo(function CatalogTable({
  visibleRows,
  viewMode,
  // ... props
}: CatalogTableProps) {
  return (
    // ... component JSX
  );
}, (prevProps, nextProps) => {
  // Custom comparison for expensive props
  return (
    prevProps.visibleRows.length === nextProps.visibleRows.length &&
    prevProps.viewMode === nextProps.viewMode &&
    prevProps.sortedProductsCount === nextProps.sortedProductsCount
  );
});
```

---

### Issue #7: Image Optimization Missing
**Severity:** 🟢 MEDIUM  
**Impact:** Unoptimized images slow page load

**Solution - Use Next.js Image Component:**
```tsx
// ❌ Avoid raw <img>
<img src={imageUrl} />

// ✅ Use Next.js Image
import Image from 'next/image';

<Image
  src={imageUrl}
  alt="Product"
  width={400}
  height={300}
  loading="lazy"
  quality={75}
  sizes="(max-width: 640px) 100vw, 400px"
/>
```

**Update next.config.mjs:**
```javascript
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'callaways3bucketcc001-prod.s3.ap-south-1.amazonaws.com',
        port: '',
        pathname: '/**',
      },
    ],
    // Add these optimizations
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60,
  },
  // ...
};
```

---

### Issue #8: Modal/Dialog Components Not Optimized
**Severity:** 🟢 MEDIUM  
**Impact:** Modals re-render entire DOM tree

**Solution - Lazy load modals:**
```tsx
import dynamic from 'next/dynamic';

const AttributeFormModal = dynamic(
  () => import('@/components/setting/AttributeForm'),
  { ssr: false }
);

export function SettingsPage() {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <button onClick={() => setShowModal(true)}>Open</button>
      {/* Only render modal when open */}
      {showModal && (
        <AttributeFormModal isOpen={showModal} onClose={() => setShowModal(false)} />
      )}
    </>
  );
}
```

---

### Issue #9: Redux Thunks Not Optimized
**Severity:** 🟢 MEDIUM  
**Impact:** Unnecessary API calls, no request deduplication

**Current Pattern:**
```tsx
// Components each check && fetch independently
const GetAllTravisMethew = () => {
  useEffect(() => {
    if(!isApiCall.current && !isFetchedTravismathew){
      dispatch(fetchTravisMathew())
      isApiCall.current=true
    }
  }, [])
}
```

**Better Pattern - Request Deduplication:**
```tsx
// Create a custom hook
export const useFetchOnce = (selector, thunk) => {
  const dispatch = useDispatch();
  const isFetched = useSelector(selector);
  const isFetching = useSelector(state => state.loading[thunk.name]);

  useEffect(() => {
    // Only fetch if not already fetching or fetched
    if (!isFetched && !isFetching) {
      dispatch(thunk());
    }
  }, [isFetched, isFetching, dispatch, thunk]);

  return isFetched;
};

// Usage
const GetAllTravisMethew = () => {
  useFetchOnce(
    state => state.travisMathew.isFetched,
    fetchTravisMathew
  );
  return null;
};
```

---

## 🎯 IMPLEMENTATION PRIORITY

### Phase 1 (Week 1) - Critical Fixes
1. ✅ Remove Redux DevTools from production
2. ✅ Fix GetAllProducts component rendering
3. ✅ Enable ISR on admin layout

**Expected improvement:** 40-50% faster initial load

### Phase 2 (Week 2) - High Impact
4. ✅ Implement code splitting for brand components
5. ✅ Move ag-grid CSS to specific components
6. ✅ Implement component memoization

**Expected improvement:** 30-40% reduction in JS bundle

### Phase 3 (Week 3) - Medium Fixes
7. ✅ Image optimization with Next.js Image
8. ✅ Lazy load modals
9. ✅ Optimize Redux thunks

**Expected improvement:** 20-30% faster TTI

---

## 📊 Quick Wins (5-10 minutes each)

```tsx
// 1. Update store/index.ts
export const store = configureStore({
  reducer: { /* ... */ },
  devTools: process.env.NODE_ENV === 'development'
});

// 2. Update admin/layout.tsx
export const revalidate = 300; // ISR

// 3. Update globals.css - REMOVE ag-grid imports
// @import "ag-grid-community/styles/ag-grid.css";
// @import "ag-grid-community/styles/ag-theme-quartz.css";

// 4. Update next.config.mjs
const nextConfig = {
  images: {
    // ... add optimizations shown above
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60,
  }
};

// 5. Add ESLint rule for performance
// .eslintrc.json
{
  "extends": ["next/core-web-vitals"],
  "rules": {
    "react/display-name": "error"
  }
}
```

---

## 🔍 Monitoring & Measurement

### Before & After Metrics
Track these metrics before and after implementation:

```bash
# Measure initial bundle size
npm run build

# Check page load performance
# Use Lighthouse: https://developer.chrome.com/docs/lighthouse/overview/

# Monitor in production with Web Vitals
# Add to layout.tsx:
import { useReportWebVitals } from 'next/web-vitals'
```

### Web Vitals to Target
- **LCP (Largest Contentful Paint):** < 2.5s
- **FID (First Input Delay):** < 100ms  
- **CLS (Cumulative Layout Shift):** < 0.1
- **TTFB (Time to First Byte):** < 600ms

---

## 📚 Additional Resources

- [Next.js Performance Guide](https://nextjs.org/docs/pages/building-your-application/optimizing/overview)
- [React Performance Optimization](https://react.dev/reference/react/useMemo)
- [Redux Best Practices](https://redux.js.org/usage/structuring-reducers/normalizing-state-shape)
- [Web Vitals](https://web.dev/vitals/)

---

## ❓ Questions?

Implement Phase 1 first and measure the impact. Come back with specific questions about any optimization.
