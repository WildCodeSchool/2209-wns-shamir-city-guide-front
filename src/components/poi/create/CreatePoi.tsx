// import "./createCategory.scss";
import { FormEvent, useState } from "react";
import { useMutation } from "@apollo/client";

import { CREATE_POI} from "../../../api/poi/mutations";
import { GET_ALL_POIS } from "../../../api/poi/queries";

import Loader from "../../loader/Loader";
import ErrorModal from "../../modal/serverError/ServerErrorModal";
import ImageLink from "../../imageLink";
import DynamicIcon from "../../dynamicIcon/DynamicIcon";

import { 
    validateName,
    validateAddress,
    validateLatitude,
    validateLongitude,
    validatePicture 
} from "../../../utils/validationForms/poiValidation";

import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import { TextField } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import Button from '@mui/material/Button';
import "react-color-palette/lib/css/styles.css";

import {
    textFielPropsStyle,
    labelTextFieldPropsStyle,
    formButtonStyle,
    disabledFormButtonStyle
} from "../../../style/customStyles";

import { ITag } from "../../../types/tag";
import { IType } from "../../../types/type";


type PoiFormProps = {
    tags: ITag[]
    types: IType
};

const CreatePoi: React.FC<PoiFormProps> = ({ tags, types }: PoiFormProps) => {
    const [poiName, setPoiName] = useState<string>("");
    const [poiAddress, setPoiAddress] = useState<string>("");
    const [poiLatitude, setPoiLatitude] = useState<string>("");
    const [poiLongitude, setPoiLongitude] = useState<string>("");
    const [poiPicture, setPoiPicture] = useState<string>("");
    
    const [nameError, setNameError] = useState<string>("");
    const [addressError, setAddressError] = useState<string>("");
    const [latitudeError, setLatitudeError] = useState<string>("");
    const [longitudeError, setLongitudeError] = useState<string>("");
    const [pictureError, setPictureError] = useState<string>("");

    const [onVisible, setOnVisible] = useState(false);
    const [loading, setLoading] = useState(false);

    const [openErrorModal, setOpenErrorModal] = useState<boolean>(false);
    const handleModalClose = () => setOpenErrorModal(false);

    // CREATE
    const [
        createPoi,
        {
            error: createdPoiError,
        }
    ] = useMutation(CREATE_POI, {
        refetchQueries: [
            { query: GET_ALL_POIS }
        ],
        onCompleted() {
            setLoading(false);
            handleStopOnVisible();
            setPoiName("");
        },
        onError() {
            setOpenErrorModal(true);
            setLoading(false);
        },
    });

    const handleOnCreate = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const errorName = await validateName({ name: poiName });
        const errorAddress = await validateAddress({ address: poiAddress });
        const errorLatitude = await validateLatitude({ latitude: poiLatitude });
        const errorLongitude = await validateLongitude({ longitude: poiLongitude });
        const errorPicture = await validatePicture({ picture: poiPicture });

        if (errorName)  setNameError(errorName);
        if (errorAddress)  setAddressError(errorAddress);
        if (errorLatitude)  setLatitudeError(errorLatitude);
        if (errorLongitude)  setLongitudeError(errorLongitude);
        if (errorPicture)  setPictureError(errorPicture);
        if (
            !errorName &&
            !errorAddress &&
            !errorLatitude &&
            !errorLongitude &&
            !errorPicture
        ) {
            setLoading(true);
            setTimeout(() => {
                createPoi(
                    {
                        variables: {
                            poi: {
                                name: poiName
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

    const handleOnVisible = () => setOnVisible(true);
    const handleStopOnVisible = () => setOnVisible(false);

    return (
        <div className="create-tag-block">
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

                        <div className="image_block">
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

                            <ImageLink link={poiPicture} defaultPath="/images/point-of-interest.jpg" alt="point d'intérêt" />
                        </div>
                    </div>
                
                    
                    <div className="create-btn-loading-block">
                        <Button
                            className="create-button"
                            style={(
                                nameError ||
                                addressError ||
                                latitudeError ||
                                longitudeError ||
                                pictureError
                            ) ? disabledFormButtonStyle : formButtonStyle}
                            type="submit"
                            variant="contained"
                            disabled={(
                                nameError || 
                                addressError ||
                                latitudeError ||
                                longitudeError ||
                                pictureError
                            ) ? true : false}
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
