import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Home() {
  const location = useLocation();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    if (queryParams.get('orderSuccess')) {
      toast.success('Order placed successfully!');
      queryParams.delete('orderSuccess'); // Remove the query param
      window.history.replaceState({}, '', location.pathname); // Clean URL
    }
  }, [location]);

  return (
    <div className="max-w-7xl mx-auto">
      {/* Hero Section */}
      <div className="relative">
        <div
          className="h-[500px] bg-cover bg-center"
          style={{
            backgroundImage:
              'url("https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80")',
          }}
        >
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="text-center text-white p-8">
              <h1 className="text-5xl font-bold mb-4 drop-shadow-lg">
                Fresh Groceries Delivered
              </h1>
              <p className="text-xl mb-8">From our store to your door</p>
              <Link
                to="/products"
                className="inline-flex items-center px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-all duration-300"
              >
                Shop Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12 px-4">
        {[
          {
            title: 'Fresh Products',
            description: 'Hand-picked fresh items from local suppliers.',
            icon: '🥦',
          },
          {
            title: 'Fast Delivery',
            description: 'Same-day delivery to your doorstep.',
            icon: '🚚',
          },
          {
            title: 'Easy Payment',
            description: 'Convenient cash on delivery option.',
            icon: '💳',
          },
        ].map((feature, index) => (
          <div
            key={index}
            className="text-center p-6 bg-white rounded-lg shadow-md transition-all hover:shadow-lg"
          >
            <span className="text-4xl">{feature.icon}</span>
            <h3 className="text-xl font-semibold mt-2">{feature.title}</h3>
            <p className="text-gray-600">{feature.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
