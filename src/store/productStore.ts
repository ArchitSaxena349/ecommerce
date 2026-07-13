import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import type { Product } from '../types';

interface ProductState {
  products: Product[];
  featuredProducts: Product[];
  categories: string[];
  isLoading: boolean;
  error: string | null;
  fetchProducts: () => Promise<void>;
  fetchProductsByCategory: (category: string) => Promise<Product[]>;
  fetchProductById: (id: string) => Promise<Product | null>;
}

export const useProductStore = create<ProductState>((set) => ({
  products: [],
  featuredProducts: [],
  categories: [],
  isLoading: false,
  error: null,

  fetchProducts: async () => {
    try {
      set({ isLoading: true, error: null });
      
      const { data, error } = await supabase
        .from('products')
        .select('*');
      
      if (error) throw error;
      
      const products = data as Product[];
      const featuredProducts = products.filter(product => product.featured);
      const categories = [...new Set(products.map(product => product.category))];
      
      set({ products, featuredProducts, categories });
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchProductsByCategory: async (category) => {
    try {
      set({ isLoading: true, error: null });
      
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('category', category);
      
      if (error) throw error;
      
      return data as Product[];
    } catch (error) {
      set({ error: (error as Error).message });
      return [];
    } finally {
      set({ isLoading: false });
    }
  },

  fetchProductById: async (id) => {
    try {
      set({ isLoading: true, error: null });
      
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      
      return data as Product;
    } catch (error) {
      set({ error: (error as Error).message });
      return null;
    } finally {
      set({ isLoading: false });
    }
  },
}));
