import { createContext, useState, useContext, useEffect } from 'react';
import api from '../utils/api';
import { INITIAL_FORM_STATE } from '../data/formConstants';
import { validateStep } from '../utils/formSchemas';

const FormContext = createContext();

export const useForm = () => {
  const context = useContext(FormContext);
  if (!context) {
    throw new Error('useForm must be used within a FormProvider');
  }
  return context;
};

export const FormProvider = ({ children }) => {
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);
  const [loading, setLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Load existing data on mount
  useEffect(() => {
    loadExistingData();
  }, []);

  // Listen for auth changes to reset form data
  useEffect(() => {
    const handleAuthReset = () => {
      console.log('Auth token removed - resetting form data');
      setFormData(INITIAL_FORM_STATE);
    };

    const handleAuthReload = async () => {
      console.log('Auth reload - resetting and loading new user data');
      setFormData(INITIAL_FORM_STATE);
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
        setFormData({
          ...INITIAL_FORM_STATE,
          ...response.data.data,
          businessDataId: response.data.data._id
        });
      } else {
        console.log('New user - no existing data');
        setFormData(INITIAL_FORM_STATE);
      }
    } catch (error) {
      console.error('Error loading existing data:', error);
      setFormData(INITIAL_FORM_STATE);
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
      setIsSaving(true);
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
      setIsSaving(false);
    }
  };

  const submitFinal = async () => {
    try {
      setLoading(true);
      setIsSaving(true);
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
      setIsSaving(false);
    }
  };

  const resetFormData = () => {
    setFormData(INITIAL_FORM_STATE);
  };

  const value = {
    formData,
    updateFormData,
    saveDraft,
    submitFinal,
    loading,
    isSaving,
    isUpdating: isSaving && Boolean(formData.businessDataId), // true = update, false = create
    loadExistingData,
    resetFormData,
    validateStep   // ✅ expose Zod validateStep for use in each wizard step
  };

  return <FormContext.Provider value={value}>{children}</FormContext.Provider>;
};
