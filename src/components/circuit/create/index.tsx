import "../style.scss";
import { 
  ChangeEvent, 
  FormEvent, 
  useState
} from "react";
import { useMutation } from "@apollo/client";

import { CREATE_CIRCUIT } from "../../../api/circuit/mutations";
import { GET_ALL_CIRCUITS } from "../../../api/circuit/queries";

import PoisByCity from "../../poisByCity";
import Loader from "../../loader/Loader";
import ErrorModal from "../../modal/serverError/ServerErrorModal";
import CustomSelectMenu from "../../selectMenu";
import ImageLink from "../../imageLink";

import { validateCommonId, validateIdsArray } from "../../../utils/validationForms/commonValidation";
import { validateName, validatePicture } from "../../../utils/validationForms/circuitValidation";

import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import {  
    TextField, 
    SelectChangeEvent, 
    Button 
} from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';

import {
    textFielPropsStyle,
    labelTextFieldPropsStyle,
    formButtonStyle,
    disabledFormButtonStyle
} from "../../../style/customStyles";

import { circuitDefaultImgUrl } from "../../../utils/constants";
import { ICity } from "../../../types/city";
import { ICategory } from "../../../types/category";


type CircuitFormProps = {
    categories: ICategory[],
    userCities: ICity[]
};

const CreateCircuit: React.FC<CircuitFormProps> = ({ categories, userCities }: CircuitFormProps) => {
  const [circuitName, setCircuitName] = useState<string>("");
  const [circuitDescription, setCircuitDescription] = useState<string>("");
  const [circuitPicture, setCircuitPicture] = useState<string>("");
    
  const [selectedCity, setSelectedCity] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [selectedPois, setSelectedPois] = useState<number[]>([]);
    
    const [nameError, setNameError] = useState<string>("");
    const [descriptionError, setDescriptionError] = useState<string>("");
    const [pictureError, setPictureError] = useState<string>("");
    const [cityError, setCityError] = useState<string>("");
    const [categoryError, setCategoryError] = useState<string>("");
    const [poisError, setPoisError] = useState<string>("");

    const [onVisible, setOnVisible] = useState(false);
    const [loading, setLoading] = useState(false);

    const [openErrorModal, setOpenErrorModal] = useState<boolean>(false);
    const handleModalClose = () => setOpenErrorModal(false);

    const handleOnVisible = () => setOnVisible(true);
    const handleStopOnVisible = () => setOnVisible(false);

    // CREATE
    const [CreateCircuit, {error: createdCircuitError}] = useMutation(
      CREATE_CIRCUIT, {
      refetchQueries: [
          { query: GET_ALL_CIRCUITS }
      ],
      onCompleted() {
        setLoading(false);
        handleStopOnVisible();
        setCircuitName("");
        setCircuitDescription("");
        setCircuitPicture("");
        setSelectedCity(null);
        setSelectedCategory(null);
        setSelectedPois([]);
      },
      onError() {
        setOpenErrorModal(true);
        setLoading(false);
      },
  });

  const handleOnCreate = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!isAnyInputError()) {
      setLoading(true);
      setTimeout(() => {
        CreateCircuit(
          {
            variables: {
              circuit: {
                name: circuitName,
                description: circuitDescription,
                picture: circuitPicture,
                cityId: selectedCity,
                categoryId: selectedCategory,
                pois: selectedPois
              }
            }
          }
        )
      }, 500)
    } else return;
  }

   /***** Form validation *****/
   const changeName = async (value: string) => {
    setCircuitName(value);
    const errorName = await validateName({ name: value });
    if (errorName) setNameError(errorName);
    else setNameError("");
  }

  const changeDescription = async (value: string) => {
    if (typeof value === "string") {
      setCircuitDescription(value);
      if (value.length < 50) {
        setDescriptionError("La description doit contenir au moins 50 caractères");
      } else setDescriptionError("");
    } else {
      setDescriptionError("La valeur doit être une chaîne de caractères");
    }
  }

  const changePicture = async (value: string) => {
    setCircuitPicture(value);
    const errorPicture = await validatePicture({ picture: value });

    if (errorPicture) setPictureError(errorPicture);
    else setPictureError("");
  }

  const handleSelectedCityChange = async (event: SelectChangeEvent<number>) => {
    const cityId = parseInt(event.target.value as string);
    setSelectedCity(cityId);

    const cityError = await validateCommonId({ id: cityId ? cityId : 0 }); 
    if (cityError) setCityError(cityError);
    else {
      setCityError("");
    } 
  };

  const handleSelectedCategoryChange = async (event: SelectChangeEvent<number>) => {
      const categoryId = parseInt(event.target.value as string);
      setSelectedCategory(categoryId);

      const categoryError = await validateCommonId({ id: categoryId ? categoryId : 0 });
      if (categoryError) setCategoryError(categoryError);
      else setCategoryError("");
  };

  const handleSelectedPoisChange = async (stringId: ChangeEvent<HTMLInputElement>) => {
    if (typeof stringId === "string") {
        const poiId = parseInt(stringId);

        if (selectedPois.includes(poiId)) {
            setSelectedPois(selectedPois.filter((id) => id !== poiId));
        } else {
            setSelectedPois([...selectedPois, poiId]);
        }
    }
    const poisArrayIsValid = await validateIdsArray(selectedPois);
    if (!poisArrayIsValid) setPoisError("Il y a un problème dans la sélection des points d'intérêt");
  };

  const isAnyInputError = () => (
    circuitName.length === 0 ||
    circuitDescription.length === 0 ||
    circuitPicture.length === 0 ||
    !selectedCity ||
    (
        selectedCity && 
        typeof selectedCity === "number" && 
        selectedCity === 0
    ) ||
    !selectedCategory ||
    (
        selectedCategory && 
        typeof selectedCategory === "number" && 
        selectedCategory === 0
    ) ||
    nameError ||
    descriptionError ||
    pictureError ||
    cityError ||
    categoryError ||
    poisError
  );

  return (
    <div className="form_block">
      <Button
        onClick={handleOnVisible}
        disabled={onVisible ? true : false}
      >
        <AddOutlinedIcon
          className={onVisible ? '' : 'icon-add'}
        />
      </Button>

      <Button
        className={onVisible ? "visible" : "not-visible"}
        onClick={handleStopOnVisible}
      >
        <CloseIcon className="close-icon-blue" />
      </Button>

      <div className={onVisible ? "form-appear create-form" : "form-not-visible create-form"} >
      <form
        autoComplete="off"
        onSubmit={e => handleOnCreate(e)}
      >
        <div className="fields">
          <TextField
            label="Nom"
            variant="filled"
            inputProps={{style: textFielPropsStyle}}
            InputLabelProps={{style: labelTextFieldPropsStyle}}
            onChange={(e) => changeName(e.target.value)}
            className='text-field'
            value={circuitName}
            error={nameError?.length ? true : false}
            helperText={nameError.length ? nameError : ""}
          />
        
          <TextField
            label="Description"
            variant="filled"
            multiline
            rows={2}
            inputProps={{style: textFielPropsStyle}}
            InputLabelProps={{style: labelTextFieldPropsStyle}}
            onChange={(e) => changeDescription(e.target.value)}
            className='text-field'
            value={circuitDescription}
            error={descriptionError?.length ? true : false}
            helperText={descriptionError.length ? descriptionError : ""}
          />

          <div className="container-select-image-checkbox">
            <div className="image-field_block">
              <TextField
                label="Image"
                variant="filled"
                inputProps={{style: textFielPropsStyle}}
                InputLabelProps={{style: labelTextFieldPropsStyle}}
                onChange={(e) => changePicture(e.target.value)}
                className='text-field'
                value={circuitPicture}
                error={pictureError?.length ? true : false}
                helperText={pictureError.length ? pictureError : ""}
              />
              <div className="image_block">
                <ImageLink link={circuitPicture} defaultPath={circuitDefaultImgUrl} 
                alt="point d'intérêt" />
              </div>
            </div>

            <div className="menu-select-block">
              <div className="cities-select-menu">
                <CustomSelectMenu
                  label="Ville"
                  menuSelectClassname="menu-select-cities"
                  selectValue={selectedCity ?? 0}
                  onChange={handleSelectedCityChange}
                  dataToList={userCities}
                  menuItemClassname=""
                  menuItemPropertyToDisplay="name"
                  displayImg={true}
                  propertyImgToDisplay='picture'
                />
                <p>{cityError.length ? cityError : ""}</p> 
              </div>
              <div className="categories-select-menu">
                <CustomSelectMenu
                  label="Category"
                  menuSelectClassname="menu-select-category"
                  selectValue={selectedCategory ?? 0}
                  onChange={handleSelectedCategoryChange}
                  dataToList={categories}
                  menuItemClassname=""
                  menuItemPropertyToDisplay="name"
                  displayIcon={true}
                  propertyImgToDisplay='icon'
                />
                <p>{categoryError.length ? categoryError : ""}</p> 
              </div>
            </div>
          </div>

          <h4>Points d'intérêt</h4>
          {
            selectedCity ? (
              <PoisByCity 
                cityId={selectedCity} 
                selectedPois={selectedPois}
                handleSelectedPois={handleSelectedPoisChange}
              />
            ) : (
              <p className="checkbox-list">Vous devez choisir une ville pour sélectionner les points d'intérêt</p>
            )
          }
        </div>

        <div className="create-btn-loading-block">
          <Button
            className="create-button"
            style={(isAnyInputError()) ? disabledFormButtonStyle : formButtonStyle}
            type="submit"
            variant="contained"
            disabled={(isAnyInputError()) ? true : false}
          >
            Créer
          </Button>

          {loading && <Loader styleClass='create-category-loader' />}
        </div>
      </form>

      {openErrorModal && <ErrorModal error={createdCircuitError} onModalClose={handleModalClose} />}
      </div>
    </div>
  )

}

export default CreateCircuit;