// import './deleteType.scss';
import { useState } from "react";
import { useMutation } from "@apollo/client";
import DeleteIcon from '@mui/icons-material/Delete';
import Button from '@mui/material/Button';
import { GET_ALL_CITIES } from "../../../api/city/queries";
import { DELETE_CITY } from "../../../api/city/mutations";
import ErrorModal from "../../modal/serverError/ServerErrorModal";
import Loader from "../../loader/Loader";

type CityByIdProps = {
  id: number
  resetExpanded: () => void
};

const DeleteCity: React.FC<CityByIdProps> = ({ id, resetExpanded }: CityByIdProps) => {
  const [loading, setLoading] = useState(false);
  const [openErrorModal, setOpenErrorModal] = useState<boolean>(false);
  const handleModalClose = () => setOpenErrorModal(false);

  // DELETE
  const [
    deleteCity, { 
      error: deleteCityError,  
    }
  ] = useMutation(DELETE_CITY, {
    onCompleted() {
      setLoading(false);
    },
    refetchQueries: [
      { query: GET_ALL_CITIES }
    ],
    onError() {
      setOpenErrorModal(true);
      setLoading(false);
    },
  });

  const handleOnDelete= (id: number) => {
    setLoading(true);
      setTimeout(() => {
        deleteCity({
          variables: { deleteCityId: id }, 
        })
        resetExpanded();
        window.scrollTo({
          top: 0,
          behavior: "smooth"
        });
      }, 500)
  }

  return (
    <div className="delete-block">
      {loading && <Loader styleClass='delete-type-loader' />}
      <Button onClick={() => handleOnDelete(id)}>
        <DeleteIcon className="icon-delete"  />
      </Button>
      {openErrorModal && <ErrorModal error={deleteCityError} onModalClose={handleModalClose} />}
    </div>
  )
}

export default DeleteCity
