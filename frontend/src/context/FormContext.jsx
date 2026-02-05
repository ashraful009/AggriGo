import { createContext, useState, useContext, useEffect } from 'react';
import api from '../utils/api';

const FormContext = createContext();

export const useForm = () => {
  const context = useContext(FormContext);
  if (!context) {
    throw new Error('useForm must be used within a FormProvider');
  }
  return context;
};

export const FormProvider = ({ children }) => {
  const [formData, setFormData] = useState({
    // Step 1: Basic Info
    productType: '',
    category: '',
    brandName: '',
    registeredName: '',
    ownerName: '',
    gender: '',
    ownerAge: '',
    ownershipType: '',
    partnerName: '',
    mobileNumber: '',
    whatsappSameAsMobile: false,
    whatsappNumber: '',
    email: '',
    division: '',
    district: '',
    thana: '',
    postOffice: '',
    postCode: '',
    detailedAddress: '',
    
    // Step 2: Product Details
    productName: '',
    shortDescription: '',
    rawMaterialSource: '',
    productionType: '',
    productionPlace: '',
    costPerUnit: '',
    wholesalePrice: '',
    retailPrice: '',
    moq: '',
    bulkDiscount: '',
    productionCapacity: '',
    machineryUsed: '',
    maleWorkers: '',
    femaleWorkers: '',
    
    // Step 3: Market & Business
    targetMarket: '',
    buyerType: {
      individual: false,
      retailShop: false,
      corporate: false,
      exportBuyer: false
    },
    salesChannel: {
      online: false,
      offline: false,
      facebookLink: '',
      websiteLink: '',
      shopAddress: ''
    },
    totalCustomers: '',
    regularCustomers: '',
    monthlySales: '',
    businessAge: '',
    registrationDocuments: {
      tradeLicense: false,
      tradeLicenseFile: '',
      tin: false,
      tinFile: '',
      bsti: false,
      bstiFile: '',
      exportLicense: false,
      exportLicenseFile: '',
      other: false,
      otherFile: ''
    },
    hasBankAccount: '',
    bankName: '',
    bankBranch: '',
    accountHolder: '',
    accountNumber: '',
    mobileBanking: {
      bkash: false,
      bkashNumber: '',
      nagad: false,
      nagadNumber: '',
      rocket: false,
      rocketNumber: ''
    },
    
    // Step 4: Future Plans
    futureGoals: '',
    productionIncreasePlan: '',
    newProductsPlan: '',
    interestInOnlineExport: '',
    needFunding: false,
    needTraining: false,
    supportNeeds: {
      marketing: false,
      packaging: false,
      quality: false,
      financing: false,
      exportSupport: false,
      training: false
    },
    
    // Step 5: Media
    productImages: [],
    packagingImage: '',
    productionProcessImage: '',
    video: '',
    
    // Step 6: Review & Consent
    consentAccuracy: false,
    consentMarketing: false,
    digitalSignature: '',
    
    // Metadata
    currentStep: 1,
    submissionStatus: 'draft',
    businessDataId: null
  });

  const [loading, setLoading] = useState(false);

  // Initial state for resetting
  const initialFormState = {
    // Step 1: Basic Info
    productType: '',
    category: '',
    brandName: '',
    registeredName: '',
    ownerName: '',
    gender: '',
    ownerAge: '',
    ownershipType: '',
    partnerName: '',
    mobileNumber: '',
    whatsappSameAsMobile: false,
    whatsappNumber: '',
    email: '',
    division: '',
    district: '',
    thana: '',
    postOffice: '',
    postCode: '',
    detailedAddress: '',
    
    // Step 2: Product Details
    productName: '',
    shortDescription: '',
    rawMaterialSource: '',
    productionType: '',
    productionPlace: '',
    costPerUnit: '',
    wholesalePrice: '',
    retailPrice: '',
    moq: '',
    bulkDiscount: '',
    productionCapacity: '',
    machineryUsed: '',
    maleWorkers: '',
    femaleWorkers: '',
    
    // Step 3: Market & Business
    targetMarket: '',
    buyerType: {
      individual: false,
      retailShop: false,
      corporate: false,
      exportBuyer: false
    },
    salesChannel: {
      online: false,
      offline: false,
      facebookLink: '',
      websiteLink: '',
      shopAddress: ''
    },
    totalCustomers: '',
    regularCustomers: '',
    monthlySales: '',
    businessAge: '',
    registrationDocuments: {
      tradeLicense: false,
      tradeLicenseFile: '',
      tin: false,
      tinFile: '',
      bsti: false,
      bstiFile: '',
      exportLicense: false,
      exportLicenseFile: '',
      other: false,
      otherFile: ''
    },
    hasBankAccount: '',
    bankName: '',
    bankBranch: '',
    accountHolder: '',
    accountNumber: '',
    mobileBanking: {
      bkash: false,
      bkashNumber: '',
      nagad: false,
      nagadNumber: '',
      rocket: false,
      rocketNumber: ''
    },
    
    // Step 4: Future Plans
    futureGoals: '',
    productionIncreasePlan: '',
    newProductsPlan: '',
    interestInOnlineExport: '',
    needFunding: false,
    needTraining: false,
    supportNeeds: {
      marketing: false,
      packaging: false,
      quality: false,
      financing: false,
      exportSupport: false,
      training: false
    },
    
    // Step 5: Media
    productImages: [],
    packagingImage: '',
    productionProcessImage: '',
    video: '',
    
    // Step 6: Review & Consent
    consentAccuracy: false,
    consentMarketing: false,
    digitalSignature: '',
    
    // Metadata
    currentStep: 1,
    submissionStatus: 'draft',
    businessDataId: null
  };

  // Load existing data on mount
  useEffect(() => {
    loadExistingData();
  }, []);

  // Listen for auth changes to reset form data
  useEffect(() => {
    const handleAuthReset = () => {
      console.log('Auth token removed - resetting form data');
      setFormData(initialFormState);
    };

    const handleAuthReload = async () => {
      console.log('Auth reload - resetting and loading new user data');
      // First reset to initial state
      setFormData(initialFormState);
      // Then load the new user's data (will be empty for new users)
      await loadExistingData();
    };

    window.addEventListener('form-data-reset', handleAuthReset);
    window.addEventListener('form-data-reload', handleAuthReload);

    return () => {
      window.removeEventListener('form-data-reset', handleAuthReset);
      window.removeEventListener('form-data-reload', handleAuthReload);
    };
  }, []);

  const loadExistingData = async () => {
    try {
      setLoading(true);
      const response = await api.get('/business');
      if (response.data.success && response.data.data) {
        // User has existing data - load it completely
        setFormData({
          ...initialFormState,  // Start with initial state
          ...response.data.data,  // Override with user's data
          businessDataId: response.data.data._id
        });
      } else {
        // New user with no data - ensure clean slate
        console.log('New user - no existing data');
        setFormData(initialFormState);
      }
    } catch (error) {
      console.error('Error loading existing data:', error);
      // On error, reset to initial state to be safe
      setFormData(initialFormState);
    } finally {
      setLoading(false);
    }
  };

  const updateFormData = (data) => {
    setFormData(prev => ({
      ...prev,
      ...data
    }));
  };

  const saveDraft = async (stepData) => {
    try {
      setLoading(true);
      const dataToSave = {
        ...formData,
        ...stepData,
        submissionStatus: stepData.submissionStatus || formData.submissionStatus || 'draft'
      };

      let response;
      if (formData.businessDataId) {
        response = await api.put(`/business/${formData.businessDataId}`, dataToSave);
      } else {
        response = await api.post('/business', dataToSave);
      }

      if (response.data.success) {
        const updatedData = {
          ...formData,
          ...response.data.data,
          businessDataId: response.data.data._id
        };
        
        setFormData(updatedData);
        
        // Dispatch custom event for dashboard to listen to
        window.dispatchEvent(new CustomEvent('business-data-updated', {
          detail: updatedData
        }));
        
        return { success: true };
      }
    } catch (error) {
      console.error('Error saving draft:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to save draft'
      };
    } finally {
      setLoading(false);
    }
  };

  const submitFinal = async () => {
    try {
      setLoading(true);
      const dataToSave = {
        ...formData,
        submissionStatus: 'submitted',
        consentAccuracy: true
      };

      const response = await api.put(`/business/${formData.businessDataId}`, dataToSave);

      if (response.data.success) {
        const updatedData = {
          ...formData,
          ...response.data.data
        };
        
        setFormData(updatedData);
        
        // Dispatch custom event for dashboard to listen to
        window.dispatchEvent(new CustomEvent('business-data-updated', {
          detail: updatedData
        }));
        
        return { success: true };
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to submit form'
      };
    } finally {
      setLoading(false);
    }
  };

  const resetFormData = () => {
    setFormData(initialFormState);
  };

  const value = {
    formData,
    updateFormData,
    saveDraft,
    submitFinal,
    loading,
    loadExistingData,
    resetFormData
  };

  return <FormContext.Provider value={value}>{children}</FormContext.Provider>;
};
