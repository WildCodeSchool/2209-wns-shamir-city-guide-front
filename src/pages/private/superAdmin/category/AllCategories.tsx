//import "./allCategories.scss";
import { useState, useEffect } from "react";

//Material UI Icons
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import * as icons from "@mui/icons-material";

//lien des icones de material UI de Category
import { ICategory } from "../../../../types/category";
import { GetAllCategories } from "../../../../services/category";
import DynamicIcon from "../../../../components/dynamicIcon/DynamicIcon";

import CreateCategory from "../../../../components/category/create/CreateCategory";
import UpdateCategory from "../../../../components/category/update/UpdateCategory";
import DeleteCategory from "../../../../components/category/delete/DeleteCategory";

import Loader from "../../../../components/loader/Loader";
import ErrorModal from "../../../../components/modal/serverError/ServerErrorModal";
import UseFilteredSearch from "../../../../components/useFilteredSearch/UseFilteredSearch";
import { DefaultIconsNames, Colors } from "../../../../utils/constants";


const AllCategories: React.FC = () => {
  // Accordion state
  const [expanded, setExpanded] = useState<string | false>(false);
  const [loading, setLoading] = useState(true);
  const [openErrorModal, setOpenErrorModal] = useState<boolean>(false);
  const handleModalClose = () => setOpenErrorModal(false);
  
  // GET ALL
  const { allCategories, categoriesError, categoriesLoading } = GetAllCategories();

  // Active categories Loader during 0.5 second
  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
      setExpanded(false);
    }, 600);
  }, [allCategories]);

  const handleChange =
    (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
      setExpanded(isExpanded ? panel : false);
  };

  // Filtered search
  const [filteredCategories, setFilteredCategories] = useState<ICategory[]>();
  const handleFilteredCategories = (categories: ICategory[]) => {
    setFilteredCategories(categories);
  } 

  useEffect(() => {
    if (allCategories?.getAllCategories) {
      handleFilteredCategories(allCategories?.getAllCategories);
    } 
  }, [allCategories?.getAllCategories]);
  
  if (categoriesError) return <ErrorModal error={categoriesError} onModalClose={handleModalClose} />
  
  const ActiveLoaderCategories: React.FC = () => (
    <div className="page all-tags">
      <div className="loader-all-items">
        <Loader styleClass="loader" />
        <DynamicIcon iconName={DefaultIconsNames.CATEGORY as keyof typeof icons} />
        <h4>Chargement des catégories...</h4> 
      </div>
    </div> 
  )

  if (categoriesLoading) {
     return <ActiveLoaderCategories/>
  }

  return (
    <div className="page all-tags" >
      {loading ? (
        <ActiveLoaderCategories />
      ) : (
        <div className="content">
          <div className="infos">
            <p><span>*</span>L'icône <DynamicIcon iconName={DefaultIconsNames.CATEGORY} />est utilisée par défault lors de la création si l'icône a déjà été choisie pour une autre catégorie présent dans la liste</p>
          </div>
          <CreateCategory icons={icons} />
          <UseFilteredSearch dataToFilter={allCategories.getAllCategoriess} searchKey={"name"} setItems={handleFilteredCategories} />
          {
            filteredCategories && 
            filteredCategories.map(
              (tag: ICategory, index: number) => {
                return (
                  <div className="tag-section" key={category.id}>
                    <Accordion expanded={expanded === "panel" + (index + 1)} onChange={handleChange("panel" + (index + 1))}>
                      <AccordionSummary
                        expandIcon={<ExpandMoreIcon className="icon-blue-light" />}
                        aria-controls={`panel${index + 1}bh-content`}
                      >
                      <Typography sx={{ width: '33%', flexShrink: 0 }}>
                        <DynamicIcon iconName={category.icon} />
                      </Typography>
                      <Typography sx={{ color: 'text.secondary' }}>{tag.name}</Typography>
                      </AccordionSummary>
                      <AccordionDetails id={`section-${index}`}>
                        <UpdateCategory category={category} icons={icons} />
                      </AccordionDetails>
                      <DeleteCategory id={Number(category.id)} />
                    </Accordion>
                  </div>
                )
              }
            )
          }
          {openErrorModal && <ErrorModal error={tagsError} onModalClose={handleModalClose} />}
        </div>
      )}
    </div>
  )
}

export default AllTags;
