import {
  Checkbox,
  FormControl,
  FormErrorMessage,
  Input,
  Textarea,
} from "@chakra-ui/react";
import { useField } from "formik";
import React from "react";

type InputFieldProps = React.InputHTMLAttributes<HTMLInputElement> & {
  name: string;
  label?: string;
  textarea?: boolean;
  placeholder?: string;
};

type SearchInputFieldProps = React.InputHTMLAttributes<HTMLInputElement> & {
  name: string;
  placeholder?: string;
};

// Input field for note
export const NoteTitle: React.FC<InputFieldProps> = ({ size: _, ...props }) => {
  const [field, { error }] = useField(props);
  return (
    <FormControl mt={4} isInvalid={!!error}>
      <Input
        {...field}
        {...props}
        id={field.name}
        variant="unstyled"
        size="lg"
        fontWeight="bold"
        fontSize="xxx-large"
        _placeholder={{ color: "#6D9886" }}
      />
      {error ? <FormErrorMessage>{error}</FormErrorMessage> : null}
    </FormControl>
  );
};

export const CommentContent: React.FC<InputFieldProps> = ({
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
    <FormControl isInvalid={!!error}>
      <InputOrTextarea
        {...field}
        {...props}
        variant="unstyled"
        size="lg"
        fontSize="md"
        _placeholder={{ color: "#6D9886" }}
      />
      {error ? <FormErrorMessage>{error}</FormErrorMessage> : null}
    </FormControl>
  );
};

export const NoteContent: React.FC<InputFieldProps> = ({
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
      <InputOrTextarea
        {...field}
        {...props}
        id={field.name}
        variant="unstyled"
        height="400px"
        fontSize="x-large"
        _placeholder={{ color: "#6D9886" }}
        color="#212121"
      />
      {error ? <FormErrorMessage>{error}</FormErrorMessage> : null}
    </FormControl>
  );
};

export const NoteTags: React.FC<InputFieldProps> = ({ size: _, ...props }) => {
  const [field, { error }] = useField(props);
  return (
    <FormControl mt={4} isInvalid={!!error}>
      <Input
        {...field}
        {...props}
        id={field.name}
        variant="unstyled"
        fontSize="medium"
        _placeholder={{ color: "#6D9886" }}
        color="#212121"
      />
      {error ? <FormErrorMessage>{error}</FormErrorMessage> : null}
    </FormControl>
  );
};

export const NoteSwitch: React.FC<InputFieldProps> = ({
  size: _,
  ...props
}) => {
  const [field, { error }] = useField(props);

  return (
    <FormControl isInvalid={!!error} display="flex" alignItems="center">
      <Checkbox
        {...field}
        id={field.name}
        size="lg"
        colorScheme="black"
        borderColor="#6D9886"
      />
      {error ? <FormErrorMessage>{error}</FormErrorMessage> : null}
    </FormControl>
  );
};

export const SearchInput: React.FC<SearchInputFieldProps> = ({
  size: _,
  ...props
}) => {
  const [field] = useField(props);

  return (
    <FormControl>
      <Input
        {...field}
        {...props}
        id={field.name}
        // variant="unstyled"
        // fontSize="medium"
        // _placeholder={{ color: "#6D9886" }}
        // color="#212121"
      />
    </FormControl>
  );
};
