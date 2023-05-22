import * as yup from "yup";

interface INameData {
  username: string;
}

interface IEmailData {
  email: string;
}

interface IPasswordData {
  password: string;
}

export const nameValidationSchema = yup.object().shape({
  username: yup
    .string()
    .required("Le nom est requis")
    .max(255, "Le nom ne peut pas faire plus de 255 caractères")
});

export const emailValidationSchema = yup.object().shape({
  email: yup
    .string()
    .required("L'email est requis")
    .matches(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/, "L'email n'est pas dans le bon format")
});

export const passwordValidationSchema =  yup.object().shape({
  password: yup
    .string()
    .required("Le mot de passe est requis")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[^\s]{8,}$/,
    "Le format du mot de passe est incorrect."
    )
    .max(255, "Le mot de passe ne peut pas faire plus de 255 caractères")
});


export const validateName = async (name: INameData) => {
  try {
    await nameValidationSchema.validate(name);
  } catch (e) {
    if (e instanceof Error) {
      return e.message;
    } 
  }
};

export const validateEmail = async (email: IEmailData) => {
  try {
    await emailValidationSchema.validate(email);
  } catch (e) {
    if (e instanceof Error) {
      return e.message;
    } 
  }
};

export const validatePassword = async (password: IPasswordData) => {
  try {
    await passwordValidationSchema.validate(password);
  } catch (e) {
    if (e instanceof Error) {
      return e.message;
    } 
  }
};
