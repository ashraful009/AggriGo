import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';

export default function BecomeSellerPage() {
  const { user, refreshUser } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Already approved seller হলে dashboard এ নিয়ে যাও
  useEffect(() => {
    if (user?.sellerStatus === 'approved') {
      navigate('/seller/dashboard');
    }
  }, [user]);

  const handleApply = async () => {
    setLoading(true);
    setError('');
    try {
      await api.post('/seller/apply');
      await refreshUser(); // AuthContext এ user refresh করো
      navigate('/seller/application-status');
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  // Already pending
  if (user?.sellerStatus === 'pending') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-10 max-w-md w-full text-center">
          <div className="text-5xl mb-4">⏳</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Application Under Review</h2>
          <p className="text-gray-500 mb-6">
            Your seller application is being reviewed by our admin team. You will be notified once approved.
          </p>
          <Link to="/" className="text-green-600 hover:text-green-700 font-medium">
            ← Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white">
      <div className="max-w-4xl mx-auto px-4 py-16">

        {/* Hero */}
        <div className="text-center mb-12">
          <span className="inline-block bg-green-100 text-green-700 font-semibold text-sm px-4 py-1.5 rounded-full mb-4">
            Sell on SRIJON
          </span>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Start Selling Your Products
          </h1>
          <p className="text-lg text-gray-500 max-w-xl mx-auto">
            Join thousands of sellers and reach buyers across Bangladesh. Fill in your business details and start earning today.
          </p>
        </div>

        {/* Steps overview */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-12">
          {[
            { step: '01', title: 'Basic Info', desc: 'Your personal & business details' },
            { step: '02', title: 'Product Details', desc: 'What products you sell' },
            { step: '03', title: 'Market & Business', desc: 'Your market reach' },
            { step: '04', title: 'Future Plans', desc: 'Your growth plans' },
            { step: '05', title: 'Media Upload', desc: 'Photos & documents' },
            { step: '06', title: 'Review & Submit', desc: 'Final review' },
          ].map((s) => (
            <div key={s.step} className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
              <span className="text-xs font-bold text-green-600 mb-1 block">STEP {s.step}</span>
              <p className="font-semibold text-gray-800 text-sm">{s.title}</p>
              <p className="text-xs text-gray-400 mt-0.5">{s.desc}</p>
            </div>
          ))}
        </div>

        {/* Benefits */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 mb-8">
          <h3 className="text-lg font-bold text-gray-800 mb-5">Why sell on SRIJON?</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { icon: '🌱', title: 'Reach more buyers', desc: 'Access thousands of buyers across Bangladesh' },
              { icon: '💰', title: 'Earn more', desc: 'Set your own prices and discount offers' },
              { icon: '📦', title: 'Easy management', desc: 'Manage products and orders from one dashboard' },
              { icon: '⚡', title: 'Fast onboarding', desc: 'Get approved and start selling within 24 hours' },
            ].map((b) => (
              <div key={b.title} className="flex items-start gap-3">
                <span className="text-2xl">{b.icon}</span>
                <div>
                  <p className="font-semibold text-gray-800 text-sm">{b.title}</p>
                  <p className="text-xs text-gray-500">{b.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 text-red-700 text-sm">
            {error}
          </div>
        )}

        {/* CTA */}
        <div className="text-center">
          {user ? (
            <button
              onClick={handleApply}
              disabled={loading}
              className="bg-green-600 hover:bg-green-700 disabled:bg-green-300 text-white font-bold px-10 py-4 rounded-xl text-lg transition-colors shadow-lg shadow-green-200"
            >
              {loading ? 'Submitting...' : 'Start Registration →'}
            </button>
          ) : (
            <div>
              <p className="text-gray-500 mb-4">You need to be logged in to apply</p>
              <Link
                to="/login"
                className="bg-green-600 hover:bg-green-700 text-white font-bold px-10 py-4 rounded-xl text-lg transition-colors inline-block"
              >
                Login to Continue
              </Link>
            </div>
          )}
          <p className="text-xs text-gray-400 mt-4">
            By registering, you agree to our Terms of Service and Seller Policy
          </p>
        </div>
      </div>
    </div>
  );
}
