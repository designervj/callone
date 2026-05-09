"use client"

import { Suspense, lazy, memo } from "react"

// Lazy load all components for code splitting
const GetAllAtributeSet = lazy(() => import("../attributeSet/GetAllAtributeSet"))
const GetAllBrands = lazy(() => import("../brands/GetAllBrands"))
const GetAllTravisMethew = lazy(() => import("./travismethew/GetAllTravisMethew"))
const GetAllOgio = lazy(() => import("./Ogio/GetAllOgio"))
const GetAllHardGood = lazy(() => import("./HardGood/GetAllHardGood"))
const GetAllRoleBasedUser = lazy(() => import("../auth/GetAllRoleBasedUser"))
const GetAllOrders = lazy(() => import("../order/GetAllOrders"))
const GetAllSoftGood = lazy(() => import("./callaway-softgoods/GetAllSoftGood"))
const GetAllWareHouse = lazy(() => import("../warehouse/GetAllWareHouse"))



const GetAllProducts = memo(() => {
   
    return (
        <>
            {/* Configuration & Master Data */}
            <Suspense >
                <GetAllAtributeSet/>
            </Suspense>
            <Suspense>
                <GetAllBrands/>
            </Suspense>

            {/* Products */}
            <Suspense >
                <GetAllTravisMethew/>
            </Suspense>
            <Suspense >
                <GetAllOgio/>
            </Suspense>
            <Suspense >
                <GetAllHardGood/>
            </Suspense>
            <Suspense >
                <GetAllSoftGood/>
            </Suspense>

            {/* Admin & Operations */}
            <Suspense>
                <GetAllRoleBasedUser/>
            </Suspense>
            <Suspense>
                <GetAllOrders/>
            </Suspense>
            <Suspense>
                <GetAllWareHouse/>
            </Suspense>
        </>
    )
});

export default GetAllProducts;