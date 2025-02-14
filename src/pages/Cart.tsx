import React from "react";
import { Link } from "react-router-dom";
import { useCartStore } from "../stores/cartStore";
import { Trash2, Plus, Minus, ArrowRight } from "lucide-react";

export default function Cart() {
  const { items, removeItem, updateQuantity, total } = useCartStore();

  if (items.length === 0) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-semibold mb-4">Your cart is empty</h2>
        <Link
          to="/products"
          className="inline-flex items-center text-green-600 hover:text-green-700"
        >
          Continue shopping
          <ArrowRight className="ml-2 h-5 w-5" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex items-center py-4 border-b last:border-b-0"
          >
            <div className="flex-grow">
              <h3 className="text-lg font-semibold">{item.name}</h3>
              <p className="text-gray-600">${item.price.toFixed(2)}</p>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => {
                    if (item.quantity === 1) {
                      removeItem(item.id); // Remove item if quantity is 1
                    } else {
                      updateQuantity(item.id, item.quantity - 1);
                    }
                  }}
                  className="p-1 rounded-full hover:bg-gray-100"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="w-8 text-center">{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  className="p-1 rounded-full hover:bg-gray-100"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>

              <button
                onClick={() => removeItem(item.id)}
                className="text-red-500 hover:text-red-700"
              >
                <Trash2 className="h-5 w-5" />
              </button>
            </div>
          </div>
        ))}

        <div className="mt-6 pt-6 border-t">
          <div className="flex justify-between text-xl font-semibold">
            <span>Total:</span>
            <span>${total().toFixed(2)}</span>
          </div>

          <Link
            to="/checkout"
            className="mt-6 w-full inline-flex justify-center items-center px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors"
          >
            Proceed to Checkout
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
