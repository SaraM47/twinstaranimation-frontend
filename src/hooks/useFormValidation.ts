import { useState } from "react";

export function useFormValidation<T>() {
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});

  const validate = (
    values: T,
    rules: Partial<Record<keyof T, (value: any) => string | null>>
  ) => {
    const newErrors: typeof errors = {};

    for (const key in rules) {
      const rule = rules[key];
      if (!rule) continue;

      const error = rule(values[key]);
      if (error) {
        newErrors[key] = error;
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  return {
    errors,
    setErrors,
    validate,
  };
}