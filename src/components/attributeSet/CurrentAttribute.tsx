"use client";
import { AppDispatch, RootState } from "@/store";
import { setCurrentAttribute } from "@/store/slices/attributeSlice/attributeSlice";
import { usePathname } from "next/navigation";
import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";

const CurrentAttribute = () => {
  const { allAttribute } = useSelector((state: RootState) => state.attribute);
  const pathanme = usePathname();
  const brandName = pathanme.split("/")[4];
  const dispatch = useDispatch<AppDispatch>();
  const isApi = useRef<boolean>(false);
  useEffect(() => {
    if (allAttribute  && brandName) {
      if (brandName === "travis-mathew") {
        const attri = allAttribute.find(
          (attri) => attri?.name === "Travis Mathew",
        );
        if (attri) {
          dispatch(setCurrentAttribute(attri));
        }

        isApi.current = true;
      } else if (brandName === "ogio") {
        const brand = allAttribute.find((brand) => brand?.name === "Ogio");
        if (brand) {
          dispatch(setCurrentAttribute(brand));
        }

        isApi.current = true;
      } else if (brandName === "callaway-hardgoods") {
        const brand = allAttribute.find(
          (brand) => brand?.name === "Callaway Hardgoods",
        );
        if (brand) {
          dispatch(setCurrentAttribute(brand));
        }

        isApi.current = true;
      } else if (brandName === "callaway-softgoods") {
        const brand = allAttribute.find(
          (brand) => brand?.name === "Callaway Softgoods",
        );
        if (brand) {
          dispatch(setCurrentAttribute(brand));
        }

        isApi.current = true;
      }

      //   dispatch(updateBrand())
    } else {
      isApi.current = false;
    }
  }, [allAttribute, brandName, dispatch]);

  return null;
};

export default CurrentAttribute;
