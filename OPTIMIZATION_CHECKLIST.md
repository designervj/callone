# Performance Optimization Checklist

## Phase 1: Critical Fixes (Start Here) ⚡

### Fix 1: Disable Redux DevTools in Production
- [ ] File: `src/store/index.ts`
- [ ] Change: Add environment check for DevTools
- [ ] Time: 2 minutes
- [ ] Impact: 15-30% state update improvement

### Fix 2: Fix GetAllProducts Rendering
- [ ] File: `src/components/products/GetAllProducts.tsx`
- [ ] Change: Use dynamic imports + route-based rendering
- [ ] Time: 15 minutes
- [ ] Impact: Reduce API calls from 8+ simultaneous to sequential

### Fix 3: Enable ISR on Admin Layout
- [ ] File: `src/app/admin/layout.tsx`
- [ ] Change: Replace `force-dynamic` with `revalidate: 300`
- [ ] Time: 2 minutes
- [ ] Impact: Enable caching for admin pages

### Fix 4: Move ag-grid CSS to Components
- [ ] File: `src/app/globals.css`
- [ ] Change: Remove ag-grid imports from global
- [ ] File: `src/components/admin/DataTable.tsx`
- [ ] Change: Import ag-grid CSS locally
- [ ] Time: 5 minutes
- [ ] Impact: Save 80KB from global CSS

---

## Phase 2: High Impact Optimizations

### Fix 5: Implement Code Splitting
- [ ] File: `src/components/products/GetAllProducts.tsx`
- [ ] Change: Convert all brand components to dynamic imports
- [ ] Time: 20 minutes
- [ ] Impact: Reduce JS bundle by 200-500KB

### Fix 6: Add Component Memoization
- [ ] File: `src/components/admin/CatalogTable.tsx`
- [ ] Change: Wrap with React.memo()
- [ ] Apply to: ProductTable, SkuTable, other heavy components
- [ ] Time: 15 minutes
- [ ] Impact: Prevent unnecessary re-renders

### Fix 7: Optimize Image Component
- [ ] File: `src/components/admin/ProductImage.tsx`
- [ ] Change: Use Next.js Image instead of <img>
- [ ] Update: `next.config.mjs` with image formats
- [ ] Time: 20 minutes
- [ ] Impact: 30-50% faster image load

---

## Phase 3: Medium Priority

### Fix 8: Lazy Load Modals
- [ ] Files: All modal/dialog components
- [ ] Change: Use dynamic() for modals
- [ ] Time: 15 minutes
- [ ] Impact: Reduce initial bundle size

### Fix 9: Optimize Redux Thunks
- [ ] Create: `src/hooks/useFetchOnce.ts`
- [ ] Update: All GetAll* components
- [ ] Time: 30 minutes
- [ ] Impact: Prevent duplicate API calls

---

## Measurement & Testing

### Before Implementation
```bash
npm run build
# Note bundle size output

# Test with Lighthouse
# Chrome DevTools > Lighthouse > Generate Report
```

### After Implementation
```bash
npm run build
# Compare bundle sizes

# Re-run Lighthouse
# Compare metrics (LCP, FID, CLS)
```

### Target Metrics
- [ ] Bundle size reduced by 20-30%
- [ ] LCP < 2.5s (currently likely > 3s)
- [ ] FID < 100ms (currently likely > 200ms)
- [ ] CLS < 0.1

---

## Questions During Implementation

**Q: Should I do all phases at once?**  
A: No! Do Phase 1 first (1 hour), test, then Phase 2 (1-2 hours).

**Q: Which fix will have the most impact?**  
A: Fix #2 (GetAllProducts) - reduces API calls and renders from 8+ simultaneous to sequential.

**Q: Is ISR safe for auth-dependent pages?**  
A: Use `revalidate` with 5-minute intervals. User-specific data should be fetched client-side.

**Q: Will lazy loading break SSR?**  
A: Add `ssr: false` to `dynamic()` to prevent server rendering of client components.

---

## File References for Implementation

**Critical Changes Required:**
1. `src/store/index.ts` - DevTools
2. `src/components/products/GetAllProducts.tsx` - Rendering
3. `src/app/admin/layout.tsx` - Force-dynamic
4. `src/app/globals.css` - ag-grid CSS
5. `next.config.mjs` - Image optimization

**Each change is independent - can be done in any order.**

---

## Success Indicators ✅

When optimizations are working:
- [ ] Initial page load is noticeably faster
- [ ] No console warnings about prop drilling
- [ ] Lighthouse score improves by 20+ points
- [ ] API calls are sequential, not parallel
- [ ] Bundle size decreases by 100KB+
- [ ] No visual layout shifts during load

---

## Troubleshooting

**Problem: Page loads slower after changes**
- Check browser cache - hard refresh (Cmd+Shift+R / Ctrl+Shift+R)
- Verify build: `npm run build` should show smaller bundle
- Check Network tab for duplicate API calls

**Problem: Components not rendering after lazy load**
- Add `loading: () => null` to dynamic()
- Check browser console for errors
- Verify import paths are correct

**Problem: Images not optimizing**
- Ensure using `<Image>` from `next/image`
- Check `remotePatterns` in next.config.mjs
- Verify image dimensions are set

---

## Resources
- Full guide: `PERFORMANCE_OPTIMIZATION_GUIDE.md`
- Next.js Docs: https://nextjs.org/docs/pages/building-your-application/optimizing
- React.dev: https://react.dev/reference/react
