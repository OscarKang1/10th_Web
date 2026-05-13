import { useState, useCallback } from 'react';

type ValidationRule<T> = {
  [K in keyof T]?: (value: string) => string;
};

type FormErrors<T> = {
  [K in keyof T]?: string;
};

function useForm<T extends Record<string, string>>(
  initialValues: T,
  validationRules: ValidationRule<T> = {}
) {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<FormErrors<T>>({});
  const [touched, setTouched] = useState<Partial<Record<keyof T, boolean>>>({});

  const validate = useCallback(
    (name: keyof T, value: string): string => {
      const rule = validationRules[name];
      if (rule) return rule(value);
      return '';
    },
    [validationRules]
  );

  const handleChange = useCallback(
    (name: keyof T, value: string) => {
      setValues((prev) => ({ ...prev, [name]: value }));
      if (touched[name]) {
        setErrors((prev) => ({ ...prev, [name]: validate(name, value) }));
      }
    },
    [touched, validate]
  );

  const handleBlur = useCallback(
    (name: keyof T) => {
      setTouched((prev) => ({ ...prev, [name]: true }));
      setErrors((prev) => ({ ...prev, [name]: validate(name, values[name]) }));
    },
    [validate, values]
  );

  const isValid = Object.keys(validationRules).every((key) => {
    const k = key as keyof T;
    return !validate(k, values[k]);
  });

  return { values, errors, touched, handleChange, handleBlur, isValid };
}

export default useForm;
