import { useState, useMemo, useEffect, ChangeEvent } from 'react';
import { UseFormReturn, FormValidation, FormValidationRules } from '../types';

export const useForm = <T extends Record<string, any>>(
  initialForm: T = {} as T,
  formValidations: FormValidationRules<T> = {}
): UseFormReturn<T> => {
  const [formState, setFormState] = useState<T>(initialForm);
  const [formValidation, setFormValidation] = useState<FormValidation>({});

  useEffect(() => {
    if (Object.keys(formValidations).length === 0) return;
    
    const formCheckedValues: FormValidation = {};
    
    for (const formField of Object.keys(formValidations)) {
      const validation = formValidations[formField as keyof T];
      if (validation) {
        const [fn, errorMessage] = validation;
        formCheckedValues[formField] = fn(formState[formField], formState) ? null : errorMessage;
      }
    }

    setFormValidation(formCheckedValues);
  }, [formState, formValidations]);

  const onInputChange = (event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>): void => {
    const { name, value } = event.target;
    setFormState(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const onResetForm = (): void => {
    setFormState(initialForm);
  };

  const isFormValid = useMemo(() => {
    return Object.values(formValidation).every(value => value === null);
  }, [formValidation]);

  return {
    formState,
    formValidation,
    onInputChange,
    onResetForm,
    isFormValid,
    setFormState
  };
};
