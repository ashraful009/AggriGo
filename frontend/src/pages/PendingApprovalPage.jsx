import React from 'react';
import { useAuth } from '../context/AuthContext';

export default function PendingApprovalPage() {
  const { user } = useAuth();

  // Temporary test UI (Checklist Item 4)
  // return <h1>Pending Page Working</h1>;

  if (!user || user.sellerStatus !== 'pending') {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center">
        <div className="max-w-md w-full p-8">
          <h2 className="text-xl text-gray-600 mb-2">No pending requests found</h2>
          <p className="text-sm text-gray-400">You do not have any pending seller applications.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center">
      <div className="bg-yellow-50 p-8 rounded-xl shadow-lg border border-yellow-200 max-w-md w-full">
        <div className="text-yellow-500 text-6xl mb-4 flex justify-center">⏳</div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Approval Pending</h1>
        <p className="text-gray-600 mb-6">
          Your request to become a seller is currently pending approval. 
          Please check back later or wait for our team to review your application.
        </p>
      </div>
    </div>
  );
}
