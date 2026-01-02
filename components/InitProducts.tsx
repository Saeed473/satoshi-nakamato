"use client";

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { fetchProducts } from "@/store/productsSlice";
import { AppDispatch } from "@/store";

export default function InitProducts() {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  return null;
}
