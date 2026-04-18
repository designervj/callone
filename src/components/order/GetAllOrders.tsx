
"use client"
import { AppDispatch, RootState } from '@/store'
import { fetchOrders } from '@/store/slices/order/orderThunks'
import React, { useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'

const GetAllOrders = () => {
    
    const dispatch= useDispatch<AppDispatch>()

    const {allOrders,isFetchedOrders}=useSelector((state:RootState)=>state.order)
     const{user}=useSelector((state:RootState)=>state.user)
     const isApiCall= useRef<boolean>(false)
    useEffect(() => {
        if(!isFetchedOrders && 
            user && 
            user?.role == "super_admin" &&
        !isApiCall.current
        ){
            isApiCall.current= true
            dispatch(fetchOrders())
        }else{
            isApiCall.current= false
        }
    }, [isFetchedOrders, user, dispatch])


  return (
 null
  )
}

export default GetAllOrders