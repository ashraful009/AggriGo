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
      case 1:
        validation = validateStep1({ ...formData, ...stepData });
        break;
      case 2:
        validation = validateStep2({ ...formData, ...stepData });
        break;
      case 3:
        validation = validateStep3({ ...formData, ...stepData });
        break;
      case 4:
        validation = validateStep4({ ...formData, ...stepData });
        break;
      case 5:
        validation = validateStep5({ ...formData, ...stepData });
        break;
      default:
        break;
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
      setTimeout(() => setSuccess(''), 2500);

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
    
    // Validate Step 6 consent and signature
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
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-green-50 via-white to-green-100">
      <style>{`
        .wizard-container input,
        .wizard-container textarea,
        .wizard-container select {
          width: 100%;
          padding: 0.75rem 1rem;
          border-radius: 0.75rem;
          border: 1px solid #d1fae5;
          background-color: #ffffff;
          color: #065f46;
          outline: none;
          transition: all 0.2s ease;
          margin-top: 0.25rem;
        }
        .wizard-container input:focus,
        .wizard-container textarea:focus {
          border-color: #22c55e;
          box-shadow: 0 0 0 4px rgba(34,197,94,0.15);
        }
        .wizard-container label {
          display: block;
          font-weight: 600;
          color: #065f46;
          font-size: 0.875rem;
          margin-top: 1rem;
        }
      `}</style>

      <Navbar />

      <div className="flex-1 container mx-auto px-4 py-12 max-w-5xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-green-700 mb-2">
            Business Registration
          </h1>
          <p className="text-green-600 font-medium">
            Step {currentStep} of {totalSteps} — {steps[currentStep - 1].name}
          </p>
        </div>

        {/* Stepper */}
        <div className="relative mb-14 max-w-4xl mx-auto">
          <div className="absolute top-1/2 left-0 w-full h-1 bg-green-100 -translate-y-1/2 rounded-full"></div>
          <div
            className="absolute top-1/2 left-0 h-1 bg-green-600 -translate-y-1/2 transition-all duration-500 rounded-full"
            style={{ width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%` }}
          />

          <div className="flex justify-between">
            {steps.map(step => (
              <div key={step.id} className="flex flex-col items-center">
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center border-2 font-bold transition
                  ${currentStep >= step.id
                    ? 'bg-green-600 border-green-600 text-white shadow-md'
                    : 'bg-white border-green-200 text-green-400'}`}>
                  {step.id}
                </div>
                <span className={`mt-2 text-[11px] font-semibold hidden md:block
                  ${currentStep >= step.id ? 'text-green-600' : 'text-green-300'}`}>
                  {step.name}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Alerts */}
        <div className="max-w-3xl mx-auto mb-6">
          {error && (
            <div className="bg-red-50 text-red-700 p-4 rounded-xl border border-red-200">
              {error}
            </div>
          )}
          {success && (
            <div className="bg-green-50 text-green-700 p-4 rounded-xl border border-green-200">
              {success}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-3xl shadow-xl border border-green-100 wizard-container">
            <div className="p-10 md:p-14">
              {renderStep()}
            </div>
          </div>

          {/* Progress dots */}
          <div className="mt-8 flex justify-center gap-2">
            {[...Array(totalSteps)].map((_, i) => (
              <div
                key={i}
                className={`h-1.5 rounded-full transition-all
                ${currentStep === i + 1 ? 'w-8 bg-green-600' : 'w-2 bg-green-200'}`}
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
