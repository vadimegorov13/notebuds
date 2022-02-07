import {
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
  Textarea,
} from "@chakra-ui/react";
import { useField } from "formik";
import React from "react";

type InputFieldProps = React.InputHTMLAttributes<HTMLInputElement> & {
  name: string;
  label?: string;
  textarea?: boolean;
  placeholder: string;
};

// Input field for note
const InputField: React.FC<InputFieldProps> = ({
  label,
  textarea,
  size: _,
  ...props
}) => {
  let InputOrTextarea: any = Input;

  if (textarea) {
    InputOrTextarea = Textarea;
  }

  const [field, { error }] = useField(props);
  return (
    <FormControl mt={4} isInvalid={!!error}>
      {label ? (
        <FormLabel htmlFor={field.name} fontSize="xl">
          {label}
        </FormLabel>
      ) : null}
      <InputOrTextarea {...field} {...props} id={field.name} />
      {error ? <FormErrorMessage>{error}</FormErrorMessage> : null}
    </FormControl>
  );
};

export default InputField;
