import * as yup from "yup";
import { IRole } from "../../types/role";

interface IUsernameData {
  username: string;
}

interface IEmailData {
  email: string;
}

interface IRolesData {
  roles: IRole[];
}

export const usernameValidationSchema = yup.object().shape({
  username: yup
    .string()
    .required("Le username est requis")
    .max(255, "Le username est trop long")
});

export const emailValidationSchema = yup.object().shape({
  email: yup
    .string()
    .matches(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/, "L'email n'est pas au format attendu")
    .max(255, "L'email est trop long")
});

export const rolesArrayValidationSchema = yup.object().shape({
  roles: yup.array()
    .of(yup.string())
    .min(1, "Vous devez attribuer au moins un rôle à l'utilisateur")
});


export const validateUsername = async (username: IUsernameData) => {
  try {
    await usernameValidationSchema.validate(username);
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

export const validateRolesArray = async (roles: IRolesData) => {
  try {
    await rolesArrayValidationSchema.validate(roles);
  } catch (e) {
    if (e instanceof Error) {
      return e.message;
    } 
  }
};