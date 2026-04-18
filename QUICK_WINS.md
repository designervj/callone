# Quick Wins: Copy-Paste Code Fixes

## 1. Fix Redux DevTools (2 minutes) ⚡

**File: `src/store/index.ts`**

Replace:
```typescript
export const store = configureStore({
  reducer: {
    brand: brandReducer,
    attribute: attributeReducer,
    travisMathew: travisMathewReducer,
    ogio: ogioReducer,
    hardgoods: hardgoodReducer,
    cart: cartReducer,
    user: userReducer,
    order: orderReducer,
    softgoods: softgoodsReducer,
    travisSheet: travisSheetReducer,
    warehouse: warehouseReducer,
  },
  devTools: {
    name: "CallawayOne Store"
  }
});
```

With:
```typescript
export const store = configureStore({
  reducer: {
    brand: brandReducer,
    attribute: attributeReducer,
    travisMathew: travisMathewReducer,
    ogio: ogioReducer,
    hardgoods: hardgoodReducer,
    cart: cartReducer,
    user: userReducer,
    order: orderReducer,
    softgoods: softgoodsReducer,
    travisSheet: travisSheetReducer,
    warehouse: warehouseReducer,
  },
  devTools: process.env.NODE_ENV === 'development' ? {
    name: "CallawayOne Store",
    actionSanitizer: (action) => ({
      ...action,
      type: action.type.toString(),
    }),
  } : false,
});
```

---

## 2. Enable ISR Caching (2 minutes) ⚡

**File: `src/app/admin/layout.tsx`**

Replace:
```typescript
export const dynamic = "force-dynamic";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
```

With:
```typescript
// Enable ISR caching (revalidate every 5 minutes)
export const revalidate = 300;

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
```

---

## 3. Move ag-grid CSS (5 minutes) ⚡

**Step 1: Remove from globals**

**File: `src/app/globals.css`**

Replace:
```css
@import "ag-grid-community/styles/ag-grid.css";
@import "ag-grid-community/styles/ag-theme-quartz.css";

@tailwind base;
```

With:
```css
@tailwind base;
```

**Step 2: Add to component**

**File: `src/components/admin/DataTable.tsx`** (or wherever ag-grid is used)

Add at the top of the file:
```typescript
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';
```

---

## 4. Fix Image Optimization (10 minutes) ⚡

**Step 1: Update next.config.mjs**

Replace current `images` config:
```javascript
images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'callaways3bucketcc001-prod.s3.ap-south-1.amazonaws.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
```

With:
```javascript
images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'callaways3bucketcc001-prod.s3.ap-south-1.amazonaws.com',
        port: '',
        pathname: '/**',
      },
    ],
    // Add optimizations
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60 * 60 * 24 * 365, // 1 year
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
```

**Step 2: Replace <img> with <Image>**

Replace:
```tsx
import Image from 'next/image';

<img src={imageUrl} alt="Product" />
```

With:
```tsx
import Image from 'next/image';

<Image
  src={imageUrl}
  alt="Product"
  width={400}
  height={300}
  loading="lazy"
  quality={75}
  sizes="(max-width: 640px) 100vw, (max-width: 1080px) 80vw, 400px"
  placeholder="blur"
  blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=="
/>
```

---

## 5. Add Component Memoization (5 minutes per component) ⚡

**File: `src/components/admin/CatalogTable.tsx`**

Replace:
```tsx
export function CatalogTable({
  visibleRows,
  viewMode,
  // ... other props
}: CatalogTableProps) {
  return (
    // JSX
  );
}
```

With:
```tsx
import { memo } from 'react';

export const CatalogTable = memo(function CatalogTable({
  visibleRows,
  viewMode,
  // ... other props
}: CatalogTableProps) {
  return (
    // JSX
  );
}, (prevProps, nextProps) => {
  // Return true if props are equal (skip render)
  return (
    prevProps.visibleRows === nextProps.visibleRows &&
    prevProps.viewMode === nextProps.viewMode &&
    prevProps.selectedIds === nextProps.selectedIds &&
    prevProps.sortedProductsCount === nextProps.sortedProductsCount &&
    prevProps.appliedFilters === nextProps.appliedFilters
  );
});
```

---

## 6. Create useFetchOnce Hook (10 minutes) ⚡

**Create: `src/hooks/useFetchOnce.ts`**

```typescript
import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '@/store';

interface UseFetchOnceOptions {
  force?: boolean;
}

export const useFetchOnce = (
  selector: (state: RootState) => boolean,
  thunk: any,
  options: UseFetchOnceOptions = {}
) => {
  const dispatch = useDispatch<AppDispatch>();
  const isFetched = useSelector(selector);
  const isDispatched = useRef(false);

  useEffect(() => {
    if (!isFetched && !isDispatched.current && !options.force) {
      isDispatched.current = true;
      dispatch(thunk());
    }
  }, [dispatch, isFetched, options.force, thunk]);

  return isFetched;
};
```

**Update: `src/components/products/travismethew/GetAllTravisMethew.tsx`**

Replace:
```tsx
const GetAllTravisMethew = () => {
  const dispatch= useDispatch<AppDispatch>()
  const isApiCall= useRef<boolean>(false)

  const {isFetchedTravismathew}=useSelector((state:RootState)=>state.travisMathew)
  useEffect(() => {
    if(!isApiCall.current && !isFetchedTravismathew){
      dispatch(fetchTravisMathew())
      isApiCall.current=true
    }else{
      isApiCall.current=false
    }
  }, [dispatch, isFetchedTravismathew])
  return null
}
```

With:
```tsx
const GetAllTravisMethew = () => {
  useFetchOnce(
    (state: RootState) => state.travisMathew.isFetchedTravismathew,
    fetchTravisMathew()
  );
  return null;
};
```

---

## 7. Lazy Load Modals (10 minutes) ⚡

**File: `src/components/setting/rightSection/attribute/AttributeForm.tsx`**

In parent component, replace:
```tsx
import AttributeForm from '@/components/setting/rightSection/attribute/AttributeForm';

export function AttributeSettings() {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <button onClick={() => setShowModal(true)}>Add Attribute</button>
      {/* Modal always rendered - SLOW */}
      <AttributeForm isOpen={showModal} onClose={() => setShowModal(false)} />
    </>
  );
}
```

With:
```tsx
import dynamic from 'next/dynamic';

const AttributeForm = dynamic(
  () => import('@/components/setting/rightSection/attribute/AttributeForm'),
  { ssr: false, loading: () => null }
);

export function AttributeSettings() {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <button onClick={() => setShowModal(true)}>Add Attribute</button>
      {/* Modal only rendered when open - FAST */}
      {showModal && (
        <AttributeForm isOpen={showModal} onClose={() => setShowModal(false)} />
      )}
    </>
  );
}
```

---

## 8. Route-Based Product Loading (20 minutes) ⚡

**File: `src/components/products/GetAllProducts.tsx`**

Replace entire file:
```tsx
'use client'

import dynamic from 'next/dynamic';
import { usePathname } from 'next/navigation';
import { useFetchOnce } from '@/hooks/useFetchOnce';
import { useSelector } from 'react-redux';
import { RootState, AppDispatch } from '@/store';
import {
  fetchBrands,
  fetchTravisMathew,
  fetchOgio,
  fetchHardGood,
  fetchRoleBasedUsers,
  fetchOrders,
  fetchSoftGood,
  fetchWareHouse,
  fetchAttributeSet
} from '@/store/slices';

// Lazy load brand components
const LazyAttributeSet = dynamic(
  () => import('../attributeSet/GetAllAtributeSet'),
  { ssr: false, loading: () => null }
);

const LazyBrands = dynamic(
  () => import('../brands/GetAllBrands'),
  { ssr: false, loading: () => null }
);

const LazyTravisMethew = dynamic(
  () => import('./travismethew/GetAllTravisMethew'),
  { ssr: false, loading: () => null }
);

const LazyOgio = dynamic(
  () => import('./Ogio/GetAllOgio'),
  { ssr: false, loading: () => null }
);

const LazyHardGood = dynamic(
  () => import('./HardGood/GetAllHardGood'),
  { ssr: false, loading: () => null }
);

const LazyRoleBasedUser = dynamic(
  () => import('../auth/GetAllRoleBasedUser'),
  { ssr: false, loading: () => null }
);

const LazyOrders = dynamic(
  () => import('../order/GetAllOrders'),
  { ssr: false, loading: () => null }
);

const LazySoftGood = dynamic(
  () => import('./callaway-softgoods/GetAllSoftGood'),
  { ssr: false, loading: () => null }
);

const LazyWareHouse = dynamic(
  () => import('../warehouse/GetAllWareHouse'),
  { ssr: false, loading: () => null }
);

const GetAllProducts = () => {
  const pathname = usePathname();

  // Only load the data for the current brand being viewed
  const isTravis = pathname.includes('travis');
  const isOgio = pathname.includes('ogio');
  const isHardGood = pathname.includes('hardgood');
  const isSoftGood = pathname.includes('softgood');
  const isOrders = pathname.includes('orders');
  const isUsers = pathname.includes('users');

  // Always load base data
  useFetchOnce(
    (state: RootState) => state.brand.isFetchedBrand,
    fetchBrands()
  );

  // Load conditionally based on route
  if (isTravis) {
    useFetchOnce(
      (state: RootState) => state.travisMathew.isFetchedTravismathew,
      fetchTravisMathew()
    );
  }

  if (isOgio) {
    useFetchOnce(
      (state: RootState) => state.ogio.isFetchedOgio,
      fetchOgio()
    );
  }

  if (isHardGood) {
    useFetchOnce(
      (state: RootState) => state.hardgoods.isFetchedHardGood,
      fetchHardGood()
    );
  }

  if (isSoftGood) {
    useFetchOnce(
      (state: RootState) => state.softgoods.isFetchedSoftGood,
      fetchSoftGood()
    );
  }

  if (isOrders) {
    useFetchOnce(
      (state: RootState) => state.order.isFetchedOrders,
      fetchOrders()
    );
  }

  if (isUsers) {
    useFetchOnce(
      (state: RootState) => state.user.isFetchedUsers,
      fetchRoleBasedUsers()
    );
  }

  return (
    <>
      <LazyAttributeSet />
      <LazyBrands />
      {isTravis && <LazyTravisMethew />}
      {isOgio && <LazyOgio />}
      {isHardGood && <LazyHardGood />}
      {isSoftGood && <LazySoftGood />}
      {isOrders && <LazyOrders />}
      {isUsers && <LazyRoleBasedUser />}
      <LazyWareHouse />
    </>
  );
};

export default GetAllProducts;
```

---

## Testing & Verification

After each fix, run:

```bash
# Check bundle size
npm run build

# Run Lighthouse
# Open Chrome DevTools > Lighthouse > Generate Report

# Check for console errors
# Open browser console and refresh
```

---

## Implementation Order

1. **First** (5 mins): Fix #1 (DevTools) + Fix #2 (ISR) + Fix #3 (ag-grid CSS)
2. **Then** (15 mins): Fix #4 (Images) + Fix #6 (useFetchOnce hook)
3. **Finally** (20 mins): Fix #5 (Memoization) + Fix #8 (Route-based loading)

**Total Time: ~50 minutes for 40-60% performance improvement**
