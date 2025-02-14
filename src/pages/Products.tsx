import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useCartStore } from '../stores/cartStore';
import { ShoppingCart, Plus } from 'lucide-react';
import toast from 'react-hot-toast';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  image_url: string;
}

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { addItem, items } = useCartStore();

  useEffect(() => {
    async function fetchProducts() {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .order('category');
        
        if (error) throw error;
        setProducts(data || []);
      } catch (error) {
        console.error('Error fetching products:', error);
        toast.error('Failed to load products');
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  const getItemQuantity = (productId: string) => {
    const item = items.find(item => item.id === productId);
    return item?.quantity || 0;
  };

  const handleAddToCart = (product: Product) => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price
    });
    toast.success(`Added ${product.name} to cart`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Our Products</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <img
              src={product.image_url || 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80'}
              alt={product.name}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
              <p className="text-gray-600 text-sm mb-2">{product.description}</p>
              <div className="flex justify-between items-center">
                <span className="text-green-600 font-bold">${product.price.toFixed(2)}</span>
                <button
                  onClick={() => handleAddToCart(product)}
                  className="flex items-center space-x-1 bg-green-600 text-white px-3 py-1 rounded-lg hover:bg-green-700 transition-colors relative"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add</span>
                  {getItemQuantity(product.id) > 0 && (
                    <span className="absolute -top-2 -right-2 bg-white text-green-600 text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center border-2 border-green-600">
                      {getItemQuantity(product.id)}
                    </span>
                  )}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}