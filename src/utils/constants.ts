export const enum StatusCode {
  OK = 200,
  CREATED = 201,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  UNPROCESSABLE_ENTITY = 422,
  INTERNAL_SERVER_ERROR = 500,
}

export const enum StatusCodeClass {
  INFORMATIONAL_RESPONSE = "INFORMATIONAL_RESPONSE",
  SUCCESSFUL = "SUCCESSFUL",
  REDIRECTION = "REDIRECTION",
  CLIENT_ERROR = "CLIENT_ERROR",
  SERVER_ERROR = "SERVER_ERROR"
}

export const enum StatusCodeMessage {
  OK = "OK",
  CREATED = "Created",
  BAD_REQUEST = "Bad Request",
  UNAUTHORIZED = "Unauthorized",
  FORBIDDEN = "Forbidden",
  NOT_FOUND = "Not Found",
  UNPROCESSABLE_ENTITY = "Unprocessable Entity",
  INTERNAL_SERVER_ERROR = "Internal Server Error",
}

/* Constants for colors palette */
export const enum Colors {
  PURPLE = "#8245Ab",
  WHITE = "#DCE2f2",
  GREYLIGHT = "#c6ced5",
  GREY = "#707d85",
  BLUEGREY = "#36454f",
  BLUELIGHT = "#4981A6",
  BLUEMEDIUM = "#025373",
  BLUEGREEN = "#024959",
  BLACK = "#1B1212",
}

/* Constants for user roles */
export const enum UserRoles {
  SUPER_ADMIN = "SUPER_ADMIN",
  CITY_ADMIN = "CITY_ADMIN",
  CONTRIBUTOR = "CONTRIBUTOR",
  USER = "USER"
}

/* Constants for default tag icon */

export const enum DefaultIconsNames {
  TAG = "LocalOfferOutlined",
  TYPE = "ClassOutlined",
  CATEGORY = "CategoryOutlined",
  USER = "PersonOutlined",
  ROLE = "PermContactCalendarOutlined",
  POI = "InterestsOutlined",
  CIRCUIT = "TravelExploreOutlined"
}

/* Constants for default tag icon */
export const enum DefaultIconsColors {
  BLACK = "#1B1212",
}

export const tokenName = "city-guid_token";

export const poiDefaultImgUrl = "https://cnu.edu/_assets/img/news/2019/istock-1062586768.jpg";
export const cityDefaultImgUrl = "https://media.istockphoto.com/id/1152829376/fr/vectoriel/ville-intelligente-centre-ville-de-paysage-avec-beaucoup-de-b%C3%A2timent-avion-vole-dans-le.jpg?s=612x612&w=0&k=20&c=JKbEsUF2ewvj9wnYsqhvAays0bNvR-Leed04fk9-_fY=";
export const circuitDefaultImgUrl = "/images/circuit-default.jpg";