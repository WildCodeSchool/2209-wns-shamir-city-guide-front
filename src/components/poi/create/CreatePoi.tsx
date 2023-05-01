import "../style.scss";
import { ChangeEvent, FormEvent, useState } from "react";
import { useMutation } from "@apollo/client";

import { CREATE_POI } from "../../../api/poi/mutations";
import { GET_ALL_POIS } from "../../../api/poi/queries";

import Loader from "../../loader/Loader";
import ErrorModal from "../../modal/serverError/ServerErrorModal";
import CustomSelectMenu from "../../selectMenu";
import CustomCheckboxList from "../../../components/checkBoxList";
import ImageLink from "../../imageLink";

import { validateCommonId, validateIdsArray } from "../../../utils/validationForms/commonValidation";
import { 
    validateName,
    validateAddress,
    validateLatitude,
    validateLongitude,
    validatePicture 
} from "../../../utils/validationForms/poiValidation";

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

import { poiDefaultImgUrl, Colors } from "../../../utils/constants";
import { ITag } from "../../../types/tag";
import { IType } from "../../../types/type";
import { ICity } from "../../../types/city";


type PoiFormProps = {
    tags: ITag[]
    types: IType[],
    userCities: ICity[]
};

const CreatePoi: React.FC<PoiFormProps> = ({ tags, types, userCities }: PoiFormProps) => {
    const [poiName, setPoiName] = useState<string>("");
    const [poiAddress, setPoiAddress] = useState<string>("");
    const [poiLatitude, setPoiLatitude] = useState<string>("");
    const [poiLongitude, setPoiLongitude] = useState<string>("");
    const [poiPicture, setPoiPicture] = useState<string>("");

    const [selectedCity, setSelectedCity] = useState<number | null>(null);
    const [selectedType, setSelectedType] = useState<number | null>(null);
    const [selectedTags, setSelectedTags] = useState<number[]>([]);
    
    const [nameError, setNameError] = useState<string>("");
    const [addressError, setAddressError] = useState<string>("");
    const [latitudeError, setLatitudeError] = useState<string>("");
    const [longitudeError, setLongitudeError] = useState<string>("");
    const [pictureError, setPictureError] = useState<string>("");
    const [cityError, setCityError] = useState<string>("");
    const [typeError, setTypeError] = useState<string>("");
    const [tagsError, setTagsError] = useState<string>("");

    const [onVisible, setOnVisible] = useState(false);
    const [loading, setLoading] = useState(false);

    const [openErrorModal, setOpenErrorModal] = useState<boolean>(false);
    const handleModalClose = () => setOpenErrorModal(false);

    // CREATE
    const [createPoi, {error: createdPoiError}] = useMutation(
        CREATE_POI, {
        refetchQueries: [
            { query: GET_ALL_POIS }
        ],
        onCompleted() {
            setLoading(false);
            handleStopOnVisible();
            setPoiName("");
            setPoiAddress("");
            setPoiLatitude("");
            setPoiLongitude("");
            setPoiPicture("");
            setSelectedCity(null);
            setSelectedType(null);
            setSelectedTags([]);
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
                createPoi(
                    {
                        variables: {
                            poi: {
                                name: poiName,
                                address: poiAddress,
                                latitude: poiLatitude,
                                longitude: poiLongitude,
                                picture: poiPicture,
                                cityId: selectedCity,
                                typeId: selectedType,
                                tags: selectedTags
                            }
                        }
                    }
                );
            }, 500)
        } else return;
    }

    /***** Form validation *****/
    const changeName = async (value: string) => {
        setPoiName(value);
        const errorName = await validateName({ name: value });
        if (errorName) setNameError(errorName);
        else setNameError("");
    }

    const changeAddress = async (value: string) => {
        setPoiAddress(value);
        const errorAddress = await validateAddress({ address: value });
        if (errorAddress) setAddressError(errorAddress);
        else setAddressError("");
    }

    const changeLatitude = async (value: string) => {
        setPoiLatitude(value);
        const errorLatitude = await validateLatitude({ latitude: value });
        if (errorLatitude) setLatitudeError(errorLatitude);
        else setLatitudeError("");
    }

    const changeLongitude = async (value: string) => {
        setPoiLongitude(value);
        const errorLongitude = await validateLongitude({ longitude: value });
        if (errorLongitude) setLongitudeError(errorLongitude);
        else setLongitudeError("");
    }

    const changePicture = async (value: string) => {
        setPoiPicture(value);
        const errorPicture = await validatePicture({ picture: value });

        if (errorPicture) setPictureError(errorPicture);
        else setPictureError("");
    }

    const handleSelectedCityChange = async (event: SelectChangeEvent<number>) => {
        const cityId = parseInt(event.target.value as string);
        setSelectedCity(cityId);

        const cityError = await validateCommonId({ id: cityId ? cityId : 0 }); 
        if (cityError) setCityError(cityError);
        else setCityError("");
    };

    const handleSelectedTypeChange = async (event: SelectChangeEvent<number>) => {
        const typeId = parseInt(event.target.value as string);
        setSelectedType(typeId);

        const typeError = await validateCommonId({ id: typeId ? typeId : 0 });
        if (typeError) setTypeError(typeError);
        else setTypeError("");
    };

    const handleSelectedTags = async (stringId: ChangeEvent<HTMLInputElement>) => {
        if (typeof stringId === "string") {
            const tagId = parseInt(stringId);

            if (selectedTags.includes(tagId)) {
                setSelectedTags(selectedTags.filter((id) => id !== tagId));
            } else {
                setSelectedTags([...selectedTags, tagId]);
            }
        }
        const tagsArrayIsValid = await validateIdsArray(selectedTags);
        if (!tagsArrayIsValid) setTagsError("Il y a un problème dans la sélection des tags");
    };

    const isAnyInputError = () => (
        poiName.length === 0 ||
        poiAddress.length === 0 ||
        poiLatitude.length === 0 ||
        poiLongitude.length === 0 ||
        poiPicture.length === 0 ||
        !selectedCity ||
        (
            selectedCity && 
            typeof selectedCity === "number" && 
            selectedCity === 0
        ) ||
        !selectedType ||
        (
            selectedType && 
            typeof selectedType === "number" && 
            selectedType === 0
        ) ||
        nameError ||
        addressError ||
        latitudeError ||
        longitudeError ||
        pictureError ||
        cityError ||
        typeError ||
        tagsError
    );

    const handleOnVisible = () => setOnVisible(true);
    const handleStopOnVisible = () => setOnVisible(false);
    
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
                            value={poiName}
                            error={nameError?.length ? true : false}
                            helperText={nameError.length ? nameError : ""}
                        />
                        <TextField
                            label="Adresse"
                            variant="filled"
                            inputProps={{style: textFielPropsStyle}}
                            InputLabelProps={{style: labelTextFieldPropsStyle}}
                            onChange={(e) => changeAddress(e.target.value)}
                            className='text-field'
                            value={poiAddress}
                            error={addressError?.length ? true : false}
                            helperText={addressError.length ? addressError : ""}
                        />
                        <TextField
                            label="Latitude"
                            variant="filled"
                            inputProps={{style: textFielPropsStyle}}
                            InputLabelProps={{style: labelTextFieldPropsStyle}}
                            onChange={(e) => changeLatitude(e.target.value)}
                            className='text-field'
                            value={poiLatitude}
                            error={latitudeError?.length ? true : false}
                            helperText={latitudeError.length ? latitudeError : ""}
                        />
                        <TextField
                            label="Longitude"
                            variant="filled"
                            inputProps={{style: textFielPropsStyle}}
                            InputLabelProps={{style: labelTextFieldPropsStyle}}
                            onChange={(e) => changeLongitude(e.target.value)}
                            className='text-field'
                            value={poiLongitude}
                            error={longitudeError?.length ? true : false}
                            helperText={longitudeError.length ? longitudeError : ""}
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
                                    value={poiPicture}
                                    error={pictureError?.length ? true : false}
                                    helperText={pictureError.length ? pictureError : ""}
                                />
                                <div className="image_block">
                                    <ImageLink link={poiPicture} defaultPath={poiDefaultImgUrl} alt="point d'intérêt" />
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
                                <div className="types-select-menu">
                                    <CustomSelectMenu
                                        label="Type"
                                        menuSelectClassname="menu-select-types"
                                        selectValue={selectedType ?? 0}
                                        onChange={handleSelectedTypeChange}
                                        dataToList={types}
                                        menuItemClassname=""
                                        menuItemPropertyToDisplay="name"
                                        displayIcon={true}
                                        propertyImgToDisplay='logo'
                                    />
                                    <p>{typeError.length ? typeError : ""}</p> 
                                </div>
                            </div>
                        </div>
                        <h4>Tags</h4>
                        <CustomCheckboxList
                            checkboxListClassname="checkbox-list"
                            onChange={handleSelectedTags}
                            idsArray={selectedTags}
                            dataToList={tags}
                            menuItemPropertyToDisplay="name"
                            displayImg={false}
                            propertyImgToDisplay="icon"
                            displayIcon={true}
                            iconColor={Colors.PURPLE}
                        />
                        <p className="ids-error-msg">{tagsError.length ? tagsError : ""}</p> 
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
                
                {openErrorModal && <ErrorModal error={createdPoiError} onModalClose={handleModalClose} />}
            </div>
        </div>
    )
}

export default CreatePoi;
