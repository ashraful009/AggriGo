import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const BusinessAgreement = () => {
  const [hasScrolledToBottom, setHasScrolledToBottom] = useState(false);
  const [isAgreed, setIsAgreed] = useState(false);
  const { t, currentLanguage } = useLanguage();
  const navigate = useNavigate();
  const scrollContainerRef = useRef(null);

  // Scroll detection logic
  const handleScroll = () => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const scrollTop = container.scrollTop;
    const scrollHeight = container.scrollHeight;
    const clientHeight = container.clientHeight;

    // Check if scrolled to bottom (with 10px tolerance)
    if (scrollTop + clientHeight >= scrollHeight - 10) {
      setHasScrolledToBottom(true);
    }
  };

  const handleProceed = () => {
    // Store agreement acceptance in localStorage
    localStorage.setItem('agreementAccepted', 'true');
    navigate('/wizard');
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      <div className="flex-1 container mx-auto px-4 py-12 max-w-4xl">
        {/* Title */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
            {currentLanguage === 'bn' 
              ? 'উদ্যোক্তা অংশগ্রহণ চুক্তি' 
              : 'Entrepreneur Participation Agreement'}
          </h1>
          <p className="text-gray-600">
            {currentLanguage === 'bn'
              ? 'দয়া করে সম্পূর্ণ চুক্তিটি পড়ুন এবং সম্মত হন'
              : 'Please read the complete agreement and accept'}
          </p>
        </div>

        {/* Scrollable Agreement Container */}
        <div 
          ref={scrollContainerRef}
          onScroll={handleScroll}
          className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 overflow-y-scroll"
          style={{ height: '500px' }}
        >
          {/* Agreement Content - Dynamically rendered based on language */}
          {currentLanguage === 'bn' ? <BanglaAgreement /> : <EnglishAgreement />}
        </div>

        {/* Accept Section */}
        <div className="mt-6 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <label 
            className={`flex items-center gap-3 mb-4 ${
              !hasScrolledToBottom ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
            }`}
          >
            <input
              type="checkbox"
              checked={isAgreed}
              onChange={(e) => setIsAgreed(e.target.checked)}
              disabled={!hasScrolledToBottom}
              className="w-5 h-5 accent-emerald-600 rounded"
            />
            <span className="font-medium text-gray-700">
              {t('agreement.checkboxLabel')}
            </span>
          </label>

          <button
            onClick={handleProceed}
            disabled={!isAgreed}
            className={`w-full py-4 rounded-xl font-bold transition-all ${
              isAgreed
                ? 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-lg hover:shadow-emerald-500/30 cursor-pointer'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            {t('agreement.proceedButton')}
          </button>

          {!hasScrolledToBottom && (
            <p className="text-sm text-amber-600 mt-3 text-center font-medium">
              {t('agreement.scrollToEnableMessage')}
            </p>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

// English Agreement Content
const EnglishAgreement = () => (
  <div className="prose prose-slate max-w-none">
    <h2 className="text-2xl font-bold text-gray-800 mb-4">Entrepreneur Participation Agreement</h2>
    
    <h3 className="text-lg font-bold text-gray-700 mt-6 mb-2">1. Purpose of the Agreement</h3>
    <p className="text-gray-600 leading-relaxed">
      This agreement aims to onboard entrepreneurs under the SRIJON platform to promote, market, sell, network, and provide support services for their products/services.
    </p>

    <h3 className="text-lg font-bold text-gray-700 mt-6 mb-2">2. Responsibilities of SRIJON</h3>
    <p className="text-gray-600 leading-relaxed mb-2">SRIJON agrees to—</p>
    <ul className="list-disc pl-6 text-gray-600 space-y-1">
      <li>Promote products/services locally and internationally</li>
      <li>Support sales, marketing, fairs, exhibitions, advertising, and media coverage</li>
      <li>Feature entrepreneurs in newsletters, magazines, websites, and digital content</li>
      <li>Facilitate funding/investment connections when applicable</li>
    </ul>
    <p className="text-sm text-gray-500 italic mt-2">Note: Services are subject to policies and conditions.</p>

    <h3 className="text-lg font-bold text-gray-700 mt-6 mb-2">3. Responsibilities of the Entrepreneur</h3>
    <ul className="list-disc pl-6 text-gray-600 space-y-1">
      <li>Provide accurate and updated information</li>
      <li>Bear responsibility for product quality, production, and delivery</li>
      <li>Protect SRIJON brand image</li>
      <li>Avoid illegal or unethical products/services</li>
    </ul>

    <h3 className="text-lg font-bold text-gray-700 mt-6 mb-2">4. Financial Terms</h3>
    <ul className="list-disc pl-6 text-gray-600 space-y-1">
      <li>Service charges/commissions may apply</li>
      <li>Funding terms will be defined separately</li>
    </ul>

    <h3 className="text-lg font-bold text-gray-700 mt-6 mb-2">5. Intellectual Property & Branding</h3>
    <ul className="list-disc pl-6 text-gray-600 space-y-1">
      <li>Ownership remains with the entrepreneur</li>
      <li>SRIJON may use brand assets for promotion</li>
    </ul>

    <h3 className="text-lg font-bold text-gray-700 mt-6 mb-2">6. Duration & Termination</h3>
    <ul className="list-disc pl-6 text-gray-600 space-y-1">
      <li>Effective from signing date</li>
      <li>Terminable with 30 days written notice</li>
    </ul>

    <h3 className="text-lg font-bold text-gray-700 mt-6 mb-2">7. Dispute Resolution</h3>
    <ul className="list-disc pl-6 text-gray-600 space-y-1">
      <li>Mutual discussion first</li>
      <li>Governed by Bangladesh law if unresolved</li>
    </ul>

    <h3 className="text-lg font-bold text-gray-700 mt-6 mb-2">8. Final Clause</h3>
    <p className="text-gray-600 leading-relaxed">
      Constitutes full understanding between both parties
    </p>
  </div>
);

// Bangla Agreement Content
const BanglaAgreement = () => (
  <div className="prose prose-slate max-w-none">
    <h2 className="text-2xl font-bold text-gray-800 mb-4">উদ্যোক্তা অংশগ্রহণ চুক্তি</h2>
    <p className="text-sm text-gray-500 italic mb-4">(Entrepreneur Participation Agreement)</p>
    
    <h3 className="text-lg font-bold text-gray-700 mt-6 mb-2">১. চুক্তির উদ্দেশ্য</h3>
    <p className="text-gray-600 leading-relaxed">
      এই চুক্তির উদ্দেশ্য হলো উদ্যোক্তাকে SRIJON প্ল্যাটফর্মের আওতায় অন্তর্ভুক্ত করে তার পণ্য ও/অথবা সেবা প্রচার, বিপণন, বিক্রয় সহায়তা, নেটওয়ার্কিং এবং প্রয়োজন অনুযায়ী অন্যান্য সহায়ক সেবা প্রদান করা।
    </p>

    <h3 className="text-lg font-bold text-gray-700 mt-6 mb-2">২. SRIJON-এর দায়িত্ব</h3>
    <p className="text-gray-600 leading-relaxed mb-2">SRIJON নিম্নলিখিত বিষয়ে সম্মত হলো—</p>
    <ul className="list-disc pl-6 text-gray-600 space-y-1">
      <li>উদ্যোক্তার পণ্য/সেবা দেশীয় ও আন্তর্জাতিক বাজারে প্রচারের উদ্যোগ গ্রহণ করবে</li>
      <li>বিক্রয়, মার্কেটিং, মেলা, প্রদর্শনী, বিজ্ঞাপন ও মিডিয়া কাভারেজে সহযোগিতা প্রদান করবে</li>
      <li>নিউজলেটার, ম্যাগাজিন, ওয়েবসাইট বা অন্যান্য ডিজিটাল কনটেন্টে উদ্যোক্তাকে অন্তর্ভুক্ত করতে পারবে</li>
      <li>প্রয়োজনে অর্থায়ন, বিনিয়োগ সংযোগ বা অন্যান্য সহায়ক সেবা প্রদানের প্রচেষ্টা চালাবে</li>
    </ul>
    <p className="text-sm text-gray-500 italic mt-2">বি.দ্র.: সকল সেবা নীতিমালা ও শর্তসাপেক্ষ</p>

    <h3 className="text-lg font-bold text-gray-700 mt-6 mb-2">৩. উদ্যোক্তার দায়িত্ব</h3>
    <ul className="list-disc pl-6 text-gray-600 space-y-1">
      <li>সকল তথ্য সঠিক ও হালনাগাদ রাখবে</li>
      <li>পণ্যের মান, উৎপাদন, সরবরাহ ও ডেলিভারির দায়ভার বহন করবে</li>
      <li>SRIJON-এর ব্র্যান্ড ইমেজ ক্ষুণ্ন করবে না</li>
      <li>আইনবিরোধী পণ্য/সেবা প্রচার করবে না</li>
    </ul>

    <h3 className="text-lg font-bold text-gray-700 mt-6 mb-2">৪. আর্থিক বিষয়</h3>
    <ul className="list-disc pl-6 text-gray-600 space-y-1">
      <li>সার্ভিস চার্জ / কমিশন প্রযোজ্য হতে পারে</li>
      <li>বিনিয়োগ সুবিধা পৃথক চুক্তিতে নির্ধারিত হবে</li>
    </ul>

    <h3 className="text-lg font-bold text-gray-700 mt-6 mb-2">৫. মেধাস্বত্ব ও ব্র্যান্ড ব্যবহার</h3>
    <ul className="list-disc pl-6 text-gray-600 space-y-1">
      <li>উদ্যোক্তা নিজস্ব মালিক থাকবে</li>
      <li>SRIJON প্রচারের উদ্দেশ্যে ব্র্যান্ড ব্যবহার করতে পারবে</li>
    </ul>

    <h3 className="text-lg font-bold text-gray-700 mt-6 mb-2">৬. চুক্তির মেয়াদ ও বাতিল</h3>
    <ul className="list-disc pl-6 text-gray-600 space-y-1">
      <li>স্বাক্ষরের তারিখ হতে কার্যকর</li>
      <li>৩০ দিনের নোটিশে বাতিলযোগ্য</li>
    </ul>

    <h3 className="text-lg font-bold text-gray-700 mt-6 mb-2">৭. বিরোধ নিষ্পত্তি</h3>
    <ul className="list-disc pl-6 text-gray-600 space-y-1">
      <li>পারস্পরিক আলোচনায় সমাধান</li>
      <li>প্রয়োজনে বাংলাদেশের আইন প্রযোজ্য</li>
    </ul>

    <h3 className="text-lg font-bold text-gray-700 mt-6 mb-2">৮. চূড়ান্ত শর্ত</h3>
    <p className="text-gray-600 leading-relaxed">
      এটি পূর্ণাঙ্গ সমঝোতা হিসেবে বিবেচিত হবে
    </p>
  </div>
);

export default BusinessAgreement;
