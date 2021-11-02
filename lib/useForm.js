import { useEffect, useMemo, useState } from 'react';

export default function useForm(initState = {}, update = false) {
  const [inputs, setInputs] = useState(initState);

  useEffect(() => {
    if (update && !inputs.name && !inputs.price && !inputs.description) {
      setInputs(initState);
    }
  }, [initState, inputs, update]);

  const methods = useMemo(
    () => ({
      handleChange: (e) => {
        let { name, value, type } = e.target;

        if (type === 'number') {
          value = parseInt(value);
        }

        if (type === 'file') {
          [value] = e.target.files;
        }

        setInputs({
          ...inputs,
          [name]: value,
        });
      },

      resetForm: () => {
        setInputs(initState);
      },

      clearForm: () => {
        const blankState = Object.fromEntries(
          Object.entries(inputs).map(([key]) => [key, ''])
        );

        setInputs(blankState);
      },
    }),
    [initState, inputs]
  );

  return {
    inputs,
    ...methods,
  };
}
