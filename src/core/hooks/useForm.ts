import { useState, useCallback } from "react";

type FormValues = {
  [key: string]: any;
};

type Errors = {
  [key: string]: string;
};

type UseFormReturn = {
  values: FormValues;
  errors: Errors;
  touched: { [key: string]: boolean };
  handleChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => void;
  handleBlur: (
    e: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => void;
  handleSubmit: (onSubmit: (values: FormValues) => Promise<void>) => (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
  setFieldValue: (field: string, value: any) => void;
  setFieldError: (field: string, error: string) => void;
  resetForm: () => void;
};

export const useForm = (
  initialValues: FormValues,
  onSubmit?: (values: FormValues) => Promise<void> | void,
  validate?: (values: FormValues) => Errors
): UseFormReturn => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState<Errors>({});
  const [touched, setTouched] = useState<{ [key: string]: boolean }>({});

  const handleChange = useCallback(
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
      >
    ) => {
      const { name, value, type } = e.target;
      const fieldValue =
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value;

      setValues((prev) => ({
        ...prev,
        [name]: fieldValue,
      }));

      // Clear error when user starts typing
      if (errors[name]) {
        setErrors((prev) => ({
          ...prev,
          [name]: "",
        }));
      }
    },
    [errors]
  );

  const handleBlur = useCallback(
    (
      e: React.FocusEvent<
        HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
      >
    ) => {
      const { name } = e.target;
      setTouched((prev) => ({
        ...prev,
        [name]: true,
      }));

      if (validate) {
        const newErrors = validate(values);
        if (newErrors[name]) {
          setErrors((prev) => ({
            ...prev,
            [name]: newErrors[name],
          }));
        }
      }
    },
    [values, validate]
  );

  const handleSubmit = useCallback(
    (onSubmitHandler: (values: FormValues) => Promise<void>) =>
      async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (validate) {
          const newErrors = validate(values);
          setErrors(newErrors);

          if (Object.keys(newErrors).length > 0) {
            return;
          }
        }

        try {
          await onSubmitHandler(values);
        } catch (error) {
          console.error("Form submission error:", error);
        }
      },
    [values, validate]
  );

  const setFieldValue = useCallback((field: string, value: any) => {
    setValues((prev) => ({
      ...prev,
      [field]: value,
    }));
  }, []);

  const setFieldError = useCallback((field: string, error: string) => {
    setErrors((prev) => ({
      ...prev,
      [field]: error,
    }));
  }, []);

  const resetForm = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
  }, [initialValues]);

  return {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    handleSubmit,
    setFieldValue,
    setFieldError,
    resetForm,
  };
};
