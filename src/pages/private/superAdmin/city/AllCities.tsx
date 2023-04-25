import { useState, useEffect } from "react";

import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import * as icons from "@mui/icons-material";
import LocationCityOutlinedIcon from '@mui/icons-material/LocationCityOutlined';

import { ICity } from "../../../../types/city";
// import { IUser } from "../../../../types/user";
import { GetAllCities } from "../../../../services/city";
import { GetAllUsers } from "../../../../services/user";

import UpdateCity from "../../../../components/city/update/UpdateCity";
import CreateCity from "../../../../components/city/create/CreateCity";

import Loader from "../../../../components/loader/Loader";
import ErrorModal from "../../../../components/modal/serverError/ServerErrorModal";
import UseFilteredSearch from "../../../../components/useFilteredSearch/UseFilteredSearch";
// import { TextField } from "@mui/material";
// import DynamicIcon from "../../../../components/dynamicIcon/DynamicIcon";
// import { DefaultIconsNames } from "../../../../utils/constants";

const AllCities: React.FC = () => {
  // Accordion state
  const [expanded, setExpanded] = useState<string | false>(false);
  const [loading, setLoading] = useState(true);
  const [openErrorModal, setOpenErrorModal] = useState<boolean>(false);
  const handleModalClose = () => setOpenErrorModal(false);
  
  // GET ALL
  const { allCities, citiesError, citiesLoading } = GetAllCities();
  const { allUsers } = GetAllUsers();


  // Active cities Loader during 0.5 second
  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
      setExpanded(false);
    }, 600);
  }, [allCities]);

  const handleChange =
    (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
      setExpanded(isExpanded ? panel : false);
  };

  const resetExpanded = () => setExpanded(false);

  // Filtered search
  const [filteredCities, setFilteredCities] = useState<ICity[]>();
  const handleFilteredCities = (cities: ICity[]) => {
    setFilteredCities(cities);
  } 

  useEffect(() => {
    if (allCities?.getAllCities) {
      handleFilteredCities(allCities?.getAllCities);
    } 
  }, [allCities?.getAllCities]);
  
  if (citiesError) return <ErrorModal error={citiesError} onModalClose={handleModalClose} />

  const ActiveLoaderCities: React.FC = () => (
    <div className="page all-types">
      <div className="loader-all-items">
        <Loader styleClass="loader" />
        <LocationCityOutlinedIcon className='icon' />
        <h4>Chargement des villes...</h4> 
      </div>
    </div> 
  )

  if (citiesLoading) {
     return <ActiveLoaderCities />
  }

  return (
    <div className="page all-types" >
      {loading ? (
        <ActiveLoaderCities />
      ) : (
        <div className="content">
          <h2 className="page-title">Les villes</h2>
          <div className="infos">
            <p><span>*</span>L'icône <LocationCityOutlinedIcon className='icon' /> est utilisée par défault lors de la création des villes.</p>
          </div>
          <CreateCity icons={icons} />
          <UseFilteredSearch dataToFilter={allCities.getAllCities} searchKey={"name"} setItems={handleFilteredCities} />
          {
            filteredCities && 
            filteredCities.map(
              (city: ICity, index: number) => {
                return (
                  <div className="type-section" key={city.id}>
                    <Accordion expanded={expanded === "panel" + (index + 1)} onChange={handleChange("panel" + (index + 1))}>
                      <AccordionSummary
                        expandIcon={<ExpandMoreIcon className="icon-blue-light" />}
                        aria-controls={`panel${index + 1}bh-content`}
                      >
                      <Typography sx={{ width: '33%', flexShrink: 0 }}>
                        <LocationCityOutlinedIcon className='icon' />
                      </Typography>
                      <Typography sx={{ color: 'text.secondary' }}>{city.name}</Typography>
                      </AccordionSummary>
                      <AccordionDetails id={`section-${index}`}>
                        <UpdateCity city={city} user={allUsers.GetAllUsers} resetExpanded={resetExpanded} />
                      </AccordionDetails>
                    </Accordion>
                  </div>
                )
              }
            )
          }
          {openErrorModal && <ErrorModal error={citiesError} onModalClose={handleModalClose} />}
        </div>
      )}
    </div>
  )
}

export default AllCities;
