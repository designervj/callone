"use client"

import GetAllBrands from "@/components/brands/GetAllBrands";
import BrandTable from "./Brandtable";

const BrandHome = () => {
    return (
        <>
        <GetAllBrands/>
            <BrandTable />
        </>
    );
}

export default BrandHome;