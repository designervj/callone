"use client"
import { useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '@/store'
import { fetchHardGoods } from '@/store/slices/hardgoodSlice/hardgoodThunks'

const GetAllHardGood = () => {
    const dispatch = useDispatch<AppDispatch>()
    const isApiCall = useRef<boolean>(false)

    const { isFetchedHardGoods } = useSelector((state: RootState) => state.hardgoods)

    useEffect(() => {
      if (!isApiCall.current && !isFetchedHardGoods) {
        dispatch(fetchHardGoods())
        isApiCall.current = true
      } else {
        isApiCall.current = false
      }
    }, [dispatch, isFetchedHardGoods])

    return null
}

export default GetAllHardGood
