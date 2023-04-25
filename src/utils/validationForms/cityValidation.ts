import * as yup from "yup";

interface INameData {
  name: string;
}

// interface ILogoData {
//   logo: string;
// }

interface IPictureData {
  picture: string;
}

interface ILatitudeData {
  latitude: string;
}

interface ILongitudeData {
  longitude: string;
}

export const nameValidationSchema = yup.object().shape({
  name: yup
    .string()
    .required("Le nom est requis")
    .min(1, "Le nom est trop court")
    .max(255, "Le nom est trop long")
});

// export const logoValidationSchema = yup.object().shape({
//   logo: yup
//     .string()
//     .required("Le logo est requis")
//     .max(255, "Le nom du logo est trop long")
// });

export const pictureValidationSchema = yup.object().shape({
  picture: yup
    .string()
    .matches(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/, "La photo est requise")
    .max(255,"Le nom de la photo est trop long")
});

export const latitudeValidationSchema = yup.object().shape({
  latitude: yup
    .string()
    .matches(/^-?([0-8]?[0-9]|90)(\.[0-9]{1,})$/, "La latitude est requise")
    .max(255,"La latitude est incorrecte")
});

export const longitudeValidationSchema = yup.object().shape({
  longitude: yup
    .string()
    .matches(/^-?([0-9]{1,2}|1[0-7][0-9]|180)(\.[0-9]{1,})$/, "La longitude est requise")
    .max(255,"La longitude est incorrecte")
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

// export const validateLogo = async (logo: ILogoData) => {
//   try {
//     await logoValidationSchema.validate(logo);
//   } catch (e) {
//     if (e instanceof Error) {
//       return e.message;
//     } 
//   }
// };

export const validatePicture = async (picture: IPictureData) => {
  try {
    await pictureValidationSchema.validate(picture);
  } catch (e) {
    if(e instanceof Error) {
      return e.message;
    }
  }
};

export const validateLatitude = async (latitude: ILatitudeData) => {
  try {
    await latitudeValidationSchema.validate(latitude);
  } catch (e) {
    if(e instanceof Error) {
      return e.message;
    }
  }
};

export const validateLongitude = async (longitude: ILongitudeData) => {
  try {
    await longitudeValidationSchema.validate(longitude);
  } catch (e) {
    if(e instanceof Error) {
      return e.message;
    }
  }
};
