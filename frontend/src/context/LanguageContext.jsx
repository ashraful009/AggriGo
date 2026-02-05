import { createContext, useState, useContext, useEffect } from 'react';

// Import translations directly
const en = {
  "nav": {
    "home": "Home",
    "about": "About Us",
    "dashboard": "Dashboard",
    "login": "Login",
    "logout": "Logout",
    "register": "Register"
  },
  "home": {
    "hero": {
      "title": "Grow Your Business with AggriGo",
      "subtitle": "Join thousands of businesses reaching more customers. Register your business today and unlock new opportunities!",
      "cta": "Register Now"
    },
    "features": {
      "title": "Why Choose AggriGo?",
      "easy": {
        "title": "Easy Registration",
        "desc": "Simple 6-step process to register your business"
      },
      "growth": {
        "title": "Business Growth",
        "desc": "Showcase your products and reach more customers"
      },
      "support": {
        "title": "Support & Training",
        "desc": "Access training and business support services"
      },
      "market": {
        "title": "Market Access",
        "desc": "Connect with local and international buyers"
      }
    },
    "cta": {
      "title": "Ready to take your business to the next level?",
      "subtitle": "Join AggriGo today and start your growth journey",
      "button": "Get Started Now"
    }
  },
  "auth": {
    "login": {
      "title": "Login to Your Account",
      "email": "Email Address",
      "password": "Password",
      "button": "Login",
      "noAccount": "Don't have an account?",
      "registerLink": "Register here",
      "forgotPassword": "Forgot Password?"
    },
    "register": {
      "title": "Create Your Account",
      "name": "Full Name",
      "email": "Email Address",
      "password": "Password",
      "button": "Register",
      "hasAccount": "Already have an account?",
      "loginLink": "Login here"
    },
    "verifyOTP": {
      "title": "Verify OTP",
      "subtitle": "Enter the 6-digit code sent to your email",
      "placeholder": "Enter OTP",
      "button": "Verify",
      "resend": "Resend OTP"
    },
    "forgot": {
      "title": "Forgot Password",
      "subtitle": "Enter your email to reset password",
      "email": "Email Address",
      "button": "Send Reset Link",
      "backToLogin": "Back to Login"
    },
    "reset": {
      "title": "Reset Password",
      "newPassword": "New Password",
      "confirmPassword": "Confirm Password",
      "button": "Reset Password"
    }
  },
  "form": {
    "step1": {
      "title": "Step 1: Basic Info & Contact"
    },
    "buttons": {
      "next": "Save & Next",
      "back": "Back",
      "submit": "Submit"
    }
  },
  "common": {
    "loading": "Loading...",
    "error": "Error",
    "success": "Success"
  }
};

const bn = {
  "nav": {
    "home": "হোম",
    "about": "আমাদের সম্পর্কে",
    "dashboard": "ড্যাশবোর্ড",
    "login": "লগইন",
    "logout": "লগআউট",
    "register": "নিবন্ধন"
  },
  "home": {
    "hero": {
      "title": "AggriGo-এর সঙ্গে আপনার ব্যবসা বৃদ্ধি করুন",
      "subtitle": "হাজার হাজার ব্যবসায়ীর সঙ্গে যুক্ত হন, যারা তাদের পণ্য আরও বেশি দর্শকের কাছে পৌঁছে দিচ্ছেন। আজই আপনার ব্যবসা নিবন্ধন করুন এবং নতুন সুযোগের দ্বার খুলুন!",
      "cta": "এখনই নিবন্ধন করুন"
    },
    "features": {
      "title": "কেন AggriGo নির্বাচন করবেন?",
      "easy": {
        "title": "সহজ নিবন্ধন",
        "desc": "আপনার ব্যবসা নিবন্ধনের জন্য সহজ ৬-ধাপ প্রক্রিয়া"
      },
      "growth": {
        "title": "ব্যবসার বৃদ্ধি",
        "desc": "আপনার পণ্য প্রদর্শন করুন এবং আরও বেশি গ্রাহকের কাছে পৌঁছান"
      },
      "support": {
        "title": "সমর্থন ও প্রশিক্ষণ",
        "desc": "প্রশিক্ষণ এবং ব্যবসায়িক সহায়তা সেবা গ্রহণ করুন"
      },
      "market": {
        "title": "বাজারে প্রবেশাধিকার",
        "desc": "স্থানীয় এবং আন্তর্জাতিক ক্রেতাদের সঙ্গে সংযুক্ত হোন"
      }
    },
    "cta": {
      "title": "আপনার ব্যবসাকে পরবর্তী স্তরে নিয়ে যেতে প্রস্তুত?",
      "subtitle": "আজই AggriGo-তে যোগ দিন এবং ব্যবসার বৃদ্ধির যাত্রা শুরু করুন",
      "button": "এখনই শুরু করুন"
    }
  },
  "auth": {
    "login": {
      "title": "আপনার অ্যাকাউন্টে লগইন করুন",
      "email": "ইমেইল ঠিকানা",
      "password": "পাসওয়ার্ড",
      "button": "লগইন",
      "noAccount": "অ্যাকাউন্ট নেই?",
      "registerLink": "এখানে নিবন্ধন করুন",
      "forgotPassword": "পাসওয়ার্ড ভুলে গেছেন?"
    },
    "register": {
      "title": "আপনার অ্যাকাউন্ট তৈরি করুন",
      "name": "পূর্ণ নাম",
      "email": "ইমেইল ঠিকানা",
      "password": "পাসওয়ার্ড",
      "button": "নিবন্ধন করুন",
      "hasAccount": "ইতিমধ্যে অ্যাকাউন্ট আছে?",
      "loginLink": "এখানে লগইন করুন"
    },
    "verifyOTP": {
      "title": "OTP যাচাই করুন",
      "subtitle": "আপনার ইমেইলে পাঠানো ৬ সংখ্যার কোড লিখুন",
      "placeholder": "OTP লিখুন",
      "button": "যাচাই করুন",
      "resend": "পুনরায় OTP পাঠান"
    },
    "forgot": {
      "title": "পাসওয়ার্ড ভুলে গেছেন",
      "subtitle": "পাসওয়ার্ড রিসেট করতে আপনার ইমেইল লিখুন",
      "email": "ইমেইল ঠিকানা",
      "button": "রিসেট লিংক পাঠান",
      "backToLogin": "লগইনে ফিরে যান"
    },
    "reset": {
      "title": "পাসওয়ার্ড রিসেট করুন",
      "newPassword": "নতুন পাসওয়ার্ড",
      "confirmPassword": "পাসওয়ার্ড নিশ্চিত করুন",
      "button": "পাসওয়ার্ড রিসেট করুন"
    }
  },
  "form": {
    "step1": {
      "title": "ধাপ ১: মৌলিক তথ্য এবং যোগাযোগ"
    },
    "buttons": {
      "next": "সংরক্ষণ এবং পরবর্তী",
      "back": "পিছনে",
      "submit": "জমা দিন"
    }
  },
  "common": {
    "loading": "লোড হচ্ছে...",
    "error": "ত্রুটি",
    "success": "সফল"
  }
};

const translations = { en, bn };

export const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState(() => {
    try {
      return localStorage.getItem('language') ||'en';
    } catch {
      return 'en';
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('language', currentLanguage);
    } catch {
      // Silently fail if localStorage is not available
    }
  }, [currentLanguage]);

  const t = (key) => {
    const keys = key.split('.');
    let value = translations[currentLanguage];
    
    for (const k of keys) {
      value = value?.[k];
    }
    
    return value || key;
  };

  const value = {
    currentLanguage,
    setLanguage: setCurrentLanguage,
    t
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
};
