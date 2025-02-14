import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Mail, LogOut } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Account() {
  const [email, setEmail] = useState('');
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true); // Loading state for auth check
  const [loggingOut, setLoggingOut] = useState(false); // Loading state for logout
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (data?.user) {
        setUser(data.user);
      }
      setLoading(false); // Stop loading after auth check
    };

    fetchUser();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: "https://student-cart-ten.vercel.app/",
        },
      });

      if (error) throw error;

      toast.success('Check your email for the login link!');
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to send login email');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    setLoggingOut(true);
    await supabase.auth.signOut();
    setUser(null);
    toast.success('Logged out successfully');
    navigate('/');
    setLoggingOut(false);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-gray-700 text-lg">Checking authentication...</p>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto">
      <div className="bg-white rounded-lg shadow-md p-8">
        {user ? (
          <>
            <h1 className="text-2xl font-bold mb-4 text-center">Welcome, {user.email}</h1>
            <button
              onClick={handleLogout}
              disabled={loggingOut}
              className="w-full bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center disabled:opacity-50"
            >
              <LogOut className="w-5 h-5 mr-2" />
              {loggingOut ? 'Logging out...' : 'Logout'}
            </button>
          </>
        ) : (
          <>
            <h1 className="text-2xl font-bold mb-6 text-center">Login to GroceryGo</h1>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email address
                </label>
                <div className="relative">
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Enter your email"
                    required
                  />
                  <Mail className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
                </div>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
              >
                {loading ? 'Sending...' : 'Send Magic Link'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
