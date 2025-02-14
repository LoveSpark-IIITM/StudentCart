import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCartStore } from '../stores/cartStore';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

export default function Checkout() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [hostel, setHostel] = useState('');
  const [location, setLocation] = useState('');
  const [room, setRoom] = useState('');
  const [loading, setLoading] = useState(false);
  const { items, total, clearCart } = useCartStore();
  const navigate = useNavigate();

  const handleSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    setLoading(true);

    const formattedAddress = `Hostel ${hostel}, ${location}, Room ${room}`;

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: user.id,
          customer_name: name,
          phone_number: phone,
          total_amount: total(),
          delivery_address: formattedAddress,
          status: 'pending'
        })
        .select()
        .single();

      if (orderError) throw orderError;

      const orderItems = items.map(item => ({
        order_id: order.id,
        product_id: item.id,
        quantity: item.quantity,
        price: item.price
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) throw itemsError;

      clearCart();
      navigate('/?orderSuccess=true');
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
        {items.map((item) => (
          <div key={item.id} className="flex justify-between py-2">
            <span>{item.name} x {item.quantity}</span>
            <span>${(item.price * item.quantity).toFixed(2)}</span>
          </div>
        ))}
        <div className="border-t mt-4 pt-4">
          <div className="flex justify-between font-semibold">
            <span>Total:</span>
            <span>${total().toFixed(2)}</span>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Delivery Details</h2>

        {/* Name Field */}
        <div className="mb-4">
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Full Name
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            required
          />
        </div>

        {/* Phone Number Field */}
        <div className="mb-4">
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
            Phone Number
          </label>
          <input
            id="phone"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            pattern="[0-9]{10}"
            title="Enter a valid 10-digit phone number"
            required
          />
        </div>

        {/* Hostel Selection */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Select Hostel</label>
          <select
            value={hostel}
            onChange={(e) => setHostel(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            required
          >
            <option value="">Select Hostel</option>
            <option value="1">Hostel 1</option>
            <option value="2">Hostel 2</option>
            <option value="3">Hostel 3</option>
          </select>
        </div>

        {/* Location Selection */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Select Location</label>
          <select
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            required
          >
            <option value="">Select Location</option>
            <option value="Loc1">Loc1</option>
            <option value="Loc2">Loc2</option>
            <option value="Loc3">Loc3</option>
          </select>
        </div>

        {/* Room Number Input */}
        <div className="mb-4">
          <label htmlFor="room" className="block text-sm font-medium text-gray-700 mb-1">
            Room Number
          </label>
          <input
            id="room"
            type="number"
            value={room}
            onChange={(e) => setRoom(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            required
          />
        </div>

        {/* Payment Method */}
        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-2">Payment Method</h3>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-gray-600">Cash on Delivery</p>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
        >
          {loading ? 'Processing...' : 'Place Order'}
        </button>
      </form>
    </div>
  );
}
