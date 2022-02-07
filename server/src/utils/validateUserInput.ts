import { RegisterInput, LoginInput, NoteInput, ProfileUpdateInput, UpdatePasswordInput, ForgotPasswordInput, EmailUpdateInput } from "./userInput";

// Register input
export const validateRegisterInput = (input: RegisterInput) => {
  // need more stuff
  let errors = [];

  if (!input.email.includes("@")) {
    errors.push(
      {
        field: "email",
        message: "invalid email",
      },
    );
  }

  if (input.username.length < 3) {
    errors.push(
      {
        field: "username",
        message: "Length must be 3 or higher",
      },
    );
  } else if (input.username.includes("@")) {
    errors.push(
      {
        field: "username",
        message: "Cannot include an @ sign",
      },
    );
  }

  if (input.password.length < 8) {
    errors.push(
      {
        field: "password",
        message: "Length must be 8 or higher",
      },
    );
  }

  if (errors.length){
    return errors
  }

  return null;
};

// Login Input
export const validateLoginInput = (input: LoginInput) => {
  let errors = [];
  // need more stuff

  if (input.password.length < 8) {
    errors.push(
      {
        field: "password",
        message: "Length must be 8 or higher",
      },
    );
  }

  if (errors.length){
    return errors
  }

  return null;
};

export const validateCommentInput = (text: string) => {
  if (text.length > 255) {
    return [
      {
        field: "text",
        message: "Comment length must not exceed 255 characters",
      },
    ];
  }

  if (text.length <= 0) {
    return [
      {
        field: "text",
        message: "Cannot post a blank comment (text length <= 0)",
      },
    ];
  }

  return null;
};

export const validateNoteInput = (input: NoteInput) => {
  if (input.title.length > 255) {
    return [
      {
        field: "title",
        message: "Title length must not exceed 255 characters",
      },
    ];
  }

  if (input.title.length <= 0) {
    return [
      {
        field: "title",
        message: "Must enter a title",
      },
    ];
  }

  // if (input.text.length > 1024) {
  //   return [
  //     {
  //       field:"text",
  //       message: "Comment length must not exceed 1024 characters"
  //     },
  //   ];
  // }

  if (input.text.length <= 0) {
    return [
      {
        field: "text",
        message: "Must enter text to save a note",
      },
    ];
  }

  return null;
};



export const validateProfileUpdateInput = (input: ProfileUpdateInput) => {
  let errors = [];
  
  if (input.bio.length > 200) {
    errors.push(
      {
        field: "bio",
        message: "Bio length must not exceed 255 characters",
      },
    );
  }

  if (input.color.length != 6) {
    errors.push(
      {
        field: "color",
        message: "Invalid color",
      },
    );
  }

  if (input.work.length > 100) {
    errors.push(
      {
        field: "work",
        message: "Work length must not exceed 100 characters",
      },
    );
  }

  if (input.education.length > 100) {
    errors.push(
      {
        field: "education",
        message: "Education length must not exceed 100 characters",
      },
    );
  }


  if (errors.length){
    return errors
  }

  return null;
};

// Update Email Input
export const validateEmailUpdateInput = (input: EmailUpdateInput) => {
  let errors = [];
  // need more stuff

  if (!input.email.includes("@")) {
    errors.push(
      {
        field: "email",
        message: "invalid email",
      },
    );
  }

  if (!input.newEmail.includes("@")) {
    errors.push(
      {
        field: "newEmail",
        message: "invalid email",
      },
    );
  }

  if (!input.confirmNewEmail.includes("@")) {
    errors.push(
      {
        field: "confirmNewEmail",
        message: "invalid email",
      },
    );
  }

  if (input.email === input.newEmail) {
    errors.push(
      {
        field: "newEmail",
        message: "this email is already in your records",
      },
    );
  }

  if (input.confirmNewEmail !== input.newEmail) {
    errors.push(
      {
        field: "confirmNewEmail",
        message: "does not match new email!",
      },
    );
  }

  if (errors.length){
    return errors
  }

  return null;
};

// Update Password Input
export const validateUpdatePasswordInput = (input: UpdatePasswordInput) => {
  let errors = [];
  // need more stuff

  if (input.password.length <= 1) {
    errors.push(
      {
        field: "password",
        message: "length must be greater than 3",
      },
    );
  }

  if (input.newPassword.length <= 3) {
    errors.push(
      {
        field: "newPassword",
        message: "length must be greater than 3",
      },
    );
  }

  if (input.confirmPassword.length <= 3) {
    errors.push(
      {
        field: "confirmPassword",
        message: "length must be greater than 3",
      },
    );
  }

  if (errors.length){
    return errors
  }

  return null;
};

// Update Password Input
export const validateForgotPasswordInput = (input: ForgotPasswordInput) => {
  let errors = [];
  // need more stuff
  if (input.newPassword.length <= 3) {
    errors.push(
      {
        field: "newPassword",
        message: "length must be greater than 3",
      },
    );
  }

  if (input.confirmPassword.length <= 3) {
    errors.push(
      {
        field: "confirmPassword",
        message: "length must be greater than 3",
      },
    );
  }

  if (errors.length){
    return errors
  }

  return null;
};