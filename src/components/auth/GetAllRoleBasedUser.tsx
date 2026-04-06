"use client";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsersByRole } from "@/store/slices/users/userThunks";
import { AppDispatch, RootState } from "@/store";

const GetAllRoleBasedUser=()=> {
    const dispatch = useDispatch<AppDispatch>();
    const {allManager, allRetailer, allSaleRep, isFetchedAllManager, isFetchedAllRetailer, isFetchedAllSaleRep, user} = useSelector((state: RootState) => state.user);
   
     useEffect(()=>{
        const role = user?.role?.toLowerCase();
        const isManagerOrAdmin = role === "super_admin" || role === "manager" || role === "admin";
        
        if(!isFetchedAllManager && isManagerOrAdmin){
             console.log("Calling manager fetching")
            dispatch(fetchUsersByRole("manager"));
        }
        if(!isFetchedAllRetailer && isManagerOrAdmin){
            dispatch(fetchUsersByRole("retailer"));
        }
        if(!isFetchedAllSaleRep && isManagerOrAdmin){
            dispatch(fetchUsersByRole("sales_rep"));
        }
     },[dispatch, isFetchedAllManager, isFetchedAllRetailer, isFetchedAllSaleRep, user])
    return (
        null
    );
}

export default GetAllRoleBasedUser