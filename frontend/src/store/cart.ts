"use client";

import { create } from "zustand";
import api from "@/lib/api";
import { Cart } from "@/types";

interface CartStore {
  cart: Cart | null;
  loading: boolean;
  fetch: () => Promise<void>;
  addItem: (productId: number, quantity: number) => Promise<void>;
  updateItem: (productId: number, quantity: number) => Promise<void>;
  removeItem: (productId: number) => Promise<void>;
  clear: () => Promise<void>;
  applyVoucher: (code: string) => Promise<void>;
  removeVoucher: () => Promise<void>;
}

export const useCartStore = create<CartStore>((set) => ({
  cart: null,
  loading: false,

  fetch: async () => {
    set({ loading: true });
    try {
      const { data } = await api.get("/cart");
      set({ cart: data.data });
    } finally {
      set({ loading: false });
    }
  },

  addItem: async (productId, quantity) => {
    const { data } = await api.post("/cart/items", { product_id: productId, quantity });
    set({ cart: data.data });
  },

  updateItem: async (productId, quantity) => {
    const { data } = await api.put(`/cart/items/${productId}`, { quantity });
    set({ cart: data.data });
  },

  removeItem: async (productId) => {
    const { data } = await api.delete(`/cart/items/${productId}`);
    set({ cart: data.data });
  },

  clear: async () => {
    await api.delete("/cart");
    set({ cart: null });
  },

  applyVoucher: async (code) => {
    const { data } = await api.post("/cart/apply-voucher", { code });
    set({ cart: data.data });
  },

  removeVoucher: async () => {
    const { data } = await api.post("/cart/remove-voucher");
    set({ cart: data.data });
  },
}));
