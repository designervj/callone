"use client";

import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import { fetchTravisSheet } from "@/store/slices/sheet/travismethew/TravisSheetThunks";

const GetAllTravisMEthewSheet = () => {
  const hasRequestedRef = useRef(false);
  const { isFetchedTravisSheet, isLoading } = useSelector((state: RootState) => state.travisSheet);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    if (!isFetchedTravisSheet && !isLoading && !hasRequestedRef.current) {
      hasRequestedRef.current = true;
      dispatch(fetchTravisSheet());
    }
  }, [dispatch, isFetchedTravisSheet, isLoading]);

  return null;
};

export default GetAllTravisMEthewSheet;
