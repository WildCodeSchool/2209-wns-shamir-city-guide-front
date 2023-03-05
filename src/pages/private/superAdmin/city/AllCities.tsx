import "../type/allTypes.scss";
import { useState, useEffect } from "react";

import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import * as icons from "@mui/icons-material";

import { ICity } from "../../../../types/city";
import { GetAllCities } from "../../../../services/city";
import DynamicIcon from "../../../../components/dynamicIcon/DynamicIcon";

// import UpdateCity from "../../../components/city/update/UpdateCity";
import CreateCity from "../../../../components/city/create/CreateCity";

import Loader from "../../../../components/loader/Loader";
import ErrorModal from "../../../../components/modal/serverError/ServerErrorModal";
import UseFilteredSearch from "../../../../components/useFilteredSearch/UseFilteredSearch";
import { DefaultIconsNames } from "../../../../utils/constants";

const AllCities = () => {
  // Accordion state
  const [expanded, setExpanded] = useState<string | false>(false);
  const [loading, setLoading] = useState(true);
  const [openErrorModal, setOpenErrorModal] = useState<boolean>(false);
  const handleModalClose = () => setOpenErrorModal(false);
  
  // GET ALL
  const { allCities, citiesError, citiesLoading } = GetAllCities();

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
        <DynamicIcon iconName={DefaultIconsNames.CITY as keyof typeof icons} color='' />
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
          <div className="infos">
            {/* <p><span>*</span>Le logo <DynamicIcon color='#000' iconName={DefaultIconsNames.CITY} />est utilisé par défaut lors de la création si la photo a déjà été choisie pour une autre ville présente dans la liste ou que la photo validée n'existe pas dans la liste des photos diponibles.</p> */}
          "Hello"
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
                        {/* <DynamicIcon iconName={city.logo} color={city.color} /> */}
                      </Typography>
                      <Typography sx={{ color: 'text.secondary' }}>{city.name}</Typography>
                      </AccordionSummary>
                      <AccordionDetails id={`section-${index}`}>
                        {/* <UpdateCity city={city} icons={icons} resetExpanded={resetExpanded} /> */}
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
