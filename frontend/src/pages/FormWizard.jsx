import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from '../context/FormContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Step1BasicInfo from '../components/wizard/Step1BasicInfo';
import Step2ProductDetails from '../components/wizard/Step2ProductDetails';
import Step3MarketBusiness from '../components/wizard/Step3MarketBusiness';
import Step4FuturePlans from '../components/wizard/Step4FuturePlans';
import Step5MediaUpload from '../components/wizard/Step5MediaUpload';
import Step6Review from '../components/wizard/Step6Review';
import { FaCheck, FaBuilding } from 'react-icons/fa';
import {
  validateStep1,
  validateStep2,
  validateStep3,
  validateStep4,
  validateStep5,
  validateStep6
} from '../utils/formValidation';

const FormWizard = () => {
  const { formData, saveDraft, submitFinal } = useForm();
  const [currentStep, setCurrentStep] = useState(formData.currentStep || 1);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const totalSteps = 6;
  const steps = [
    { id: 1, name: 'Basic Info' },
    { id: 2, name: 'Product' },
    { id: 3, name: 'Market' },
    { id: 4, name: 'Future Plans' },
    { id: 5, name: 'Media' },
    { id: 6, name: 'Review' },
  ];

  const handleNext = async (stepData) => {
    setError('');
    setSuccess('');

    // Validate current step before proceeding
    let validation = { isValid: true, errors: {} };

    switch (currentStep) {
      case 1: validation = validateStep1({ ...formData, ...stepData }); break;
      case 2: validation = validateStep2({ ...formData, ...stepData }); break;
      case 3: validation = validateStep3({ ...formData, ...stepData }); break;
      case 4: validation = validateStep4({ ...formData, ...stepData }); break;
      case 5: validation = validateStep5({ ...formData, ...stepData }); break;
      default: break;
    }

    if (!validation.isValid) {
      const errorMessages = Object.values(validation.errors).join('. ');
      setError(`Please fix the following errors: ${errorMessages}`);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    const result = await saveDraft({
      ...stepData,
      currentStep: currentStep + 1
    });

    if (result?.success) {
      setSuccess('Progress saved successfully');
      setTimeout(() => setSuccess(''), 2000);

      if (currentStep < totalSteps) {
        setCurrentStep(currentStep + 1);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } else {
      setError(result?.message || 'Failed to save progress');
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleFinalSubmit = async (stepData) => {
    setError('');
    const validation = validateStep6({ ...formData, ...stepData });

    if (!validation.isValid) {
      const errorMessages = Object.values(validation.errors).join('. ');
      setError(`Please fix the following errors: ${errorMessages}`);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    const result = await submitFinal();
    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.message);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1: return <Step1BasicInfo onNext={handleNext} />;
      case 2: return <Step2ProductDetails onNext={handleNext} onBack={handleBack} />;
      case 3: return <Step3MarketBusiness onNext={handleNext} onBack={handleBack} />;
      case 4: return <Step4FuturePlans onNext={handleNext} onBack={handleBack} />;
      case 5: return <Step5MediaUpload onNext={handleNext} onBack={handleBack} />;
      case 6: return <Step6Review onSubmit={handleFinalSubmit} onBack={handleBack} />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans text-slate-800">

      {/* CSS Styles for Input Fields (Global for Wizard) */}
      <style>{`
        .wizard-container input,
        .wizard-container textarea,
        .wizard-container select {
          width: 100%;
          padding: 0.875rem 1rem;
          border-radius: 0.5rem;
          border: 1px solid #e2e8f0; /* slate-200 */
          background-color: #ffffff;
          color: #1e293b; /* slate-800 */
          outline: none;
          transition: all 0.2s ease;
          font-size: 0.95rem;
        }
        .wizard-container input:focus,
        .wizard-container textarea:focus,
        .wizard-container select:focus {
          border-color: #3b82f6; /* blue-500 */
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }
        .wizard-container label {
          display: block;
          font-weight: 600;
          color: #475569; /* slate-600 */
          font-size: 0.875rem;
          margin-bottom: 0.5rem;
          margin-top: 1.25rem;
          text-transform: uppercase;
          letter-spacing: 0.025em;
        }
        /* Style for placeholder */
        .wizard-container input::placeholder,
        .wizard-container textarea::placeholder {
          color: #94a3b8; /* slate-400 */
        }
      `}</style>

      <Navbar />

      <div className="flex-1 container mx-auto px-4 py-16 max-w-6xl relative">

        {/* Background Decor */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/5 rounded-full blur-3xl -z-10"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-amber-500/5 rounded-full blur-3xl -z-10"></div>

        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center p-3 mb-4 bg-white rounded-xl shadow-sm border border-slate-100">
            <FaBuilding className="text-2xl text-blue-600" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3 tracking-tight">
            Business Registration
          </h1>
          <p className="text-slate-500 font-medium">
            Step <span className="text-blue-600 font-bold">{currentStep}</span> of {totalSteps} — {steps[currentStep - 1].name}
          </p>
        </div>

        {/* Modern Stepper */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="relative">
            {/* Connecting Line */}
            <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-200 -translate-y-1/2 rounded-full z-0"></div>
            <div
              className="absolute top-1/2 left-0 h-1 bg-blue-600 -translate-y-1/2 transition-all duration-500 rounded-full z-0"
              style={{ width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%` }}
            ></div>

            <div className="flex justify-between relative z-10">
              {steps.map((step) => {
                const isCompleted = currentStep > step.id;
                const isCurrent = currentStep === step.id;

                return (
                  <div key={step.id} className="flex flex-col items-center group cursor-default">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center border-4 transition-all duration-300 shadow-sm
                        ${isCompleted
                          ? 'bg-blue-600 border-blue-600 text-white'
                          : isCurrent
                            ? 'bg-amber-500 border-amber-500 text-white scale-110 shadow-amber-500/30'
                            : 'bg-white border-slate-200 text-slate-300'
                        }`}
                    >
                      {isCompleted ? <FaCheck size={14} /> : <span className="text-sm font-bold">{step.id}</span>}
                    </div>

                    {/* Step Label (Desktop) */}
                    <span
                      className={`absolute top-12 text-xs font-bold uppercase tracking-wider transition-all duration-300 whitespace-nowrap hidden md:block
                        ${isCurrent ? 'text-amber-600 -translate-y-1' : isCompleted ? 'text-blue-600' : 'text-slate-300'}
                      `}
                    >
                      {step.name}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Alerts */}
        <div className="max-w-4xl mx-auto mb-8">
          {error && (
            <div className="bg-red-50 text-red-700 p-4 rounded-lg border border-red-200 text-sm font-medium flex items-center shadow-sm animate-fade-in">
              <span className="w-2 h-2 bg-red-500 rounded-full mr-3"></span>
              {error}
            </div>
          )}
          {success && (
            <div className="bg-emerald-50 text-emerald-700 p-4 rounded-lg border border-emerald-200 text-sm font-medium flex items-center shadow-sm animate-fade-in">
              <span className="w-2 h-2 bg-emerald-500 rounded-full mr-3"></span>
              {success}
            </div>
          )}
        </div>

        {/* Main Form Content */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 wizard-container relative overflow-hidden">
            {/* Top accent line */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-blue-500"></div>

            <div className="p-8 md:p-12">
              {renderStep()}
            </div>
          </div>

          {/* Bottom Progress Indicator (Dots) */}
          <div className="mt-8 flex justify-center gap-2">
            {[...Array(totalSteps)].map((_, i) => (
              <div
                key={i}
                className={`h-1.5 rounded-full transition-all duration-300
                  ${currentStep === i + 1 ? 'w-8 bg-amber-500' : currentStep > i + 1 ? 'w-2 bg-blue-500' : 'w-2 bg-slate-200'}
                `}
              />
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default FormWizard;