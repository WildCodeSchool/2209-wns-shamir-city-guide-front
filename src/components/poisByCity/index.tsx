import React, { ChangeEvent, useEffect, useState } from 'react'

import Loader from '../loader/Loader';
import ErrorModal from "../../components/modal/serverError/ServerErrorModal";
import CustomCheckboxList from "../../components/checkBoxList";
import { GetPoisByCity } from '../../services/poi';

interface IProps {
  cityId: number
  selectedPois: (number | undefined)[]
  handleSelectedPois: (stringId: ChangeEvent<HTMLInputElement>) => Promise<void>
}

const PoisByCity: React.FC<IProps> = ({ 
  cityId, 
  selectedPois, 
  handleSelectedPois 
}: IProps) => {
  const [loading, setLoading] = useState(true);
  const [openErrorModal, setOpenErrorModal] = useState<boolean>(false);
  const handleModalClose = () => setOpenErrorModal(false);
  const { poisByCity, poisByCityError, poisByCityLoading } = GetPoisByCity(cityId);

  // Active categories Loader during 0.5 second
  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 300);
  }, [cityId]);

  if (poisByCityError) return <ErrorModal error={poisByCityError} onModalClose={handleModalClose} />

  const ActiveLoaderPois: React.FC = () => (
    <div className='checkbox-list'><Loader styleClass="" /></div>
  ) 
  

  return (
    <>
      {loading || poisByCityLoading ? (
        <ActiveLoaderPois />
      ) : (
        <>
          {poisByCity?.getPoisByCity && poisByCity?.getPoisByCity.length > 0 ? (
            <>
              <CustomCheckboxList
                checkboxListClassname="checkbox-list poi-by-city-checkbox-list"
                onChange={handleSelectedPois}
                idsArray={selectedPois}
                dataToList={poisByCity.getPoisByCity}
                menuItemPropertyToDisplay="name"
                displayImg={true}
                propertyImgToDisplay="picture"
                displayIcon={false}
                iconColor=""
                labelId='poi-by-city-label'
              />
            </>
          ) : (
            <p className='checkbox-list'>Il n'existe encore aucun points d'intérêt pour cette ville</p>
          )}
        </>
      )}
      {openErrorModal && <ErrorModal error={poisByCityError} onModalClose={handleModalClose} />}
    </>
  )
}

export default PoisByCity
