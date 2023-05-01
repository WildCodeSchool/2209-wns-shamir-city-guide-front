import "./allTags.scss";
import { useState, useEffect } from "react";

import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import * as icons from "@mui/icons-material";

import { ITag } from "../../../../types/tag";
import { GetAllTags } from "../../../../services/tag";
import DynamicIcon from "../../../../components/dynamicIcon/DynamicIcon";

import UpdateTag from "../../../../components/tag/update/UpdateTag";
import CreateTag from "../../../../components/tag/create/CreateTag";

import Loader from "../../../../components/loader/Loader";
import ErrorModal from "../../../../components/modal/serverError/ServerErrorModal";
import UseFilteredSearch from "../../../../components/useFilteredSearch/UseFilteredSearch";
import { DefaultIconsNames, Colors } from "../../../../utils/constants";


const AllTags: React.FC = () => {
  // Accordion state
  const [expanded, setExpanded] = useState<string | false>(false);
  const [loading, setLoading] = useState(true);
  const [openErrorModal, setOpenErrorModal] = useState<boolean>(false);
  const handleModalClose = () => setOpenErrorModal(false);
  
  // GET ALL
  const { allTags, tagsError, tagsLoading } = GetAllTags();

  // Active tags Loader during 0.5 second
  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
      setExpanded(false);
    }, 600);
  }, [allTags]);

  const handleChange =
    (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
      setExpanded(isExpanded ? panel : false);
  };

  const resetExpanded = () => setExpanded(false);

  // Filtered search
  const [filteredTags, setFilteredTags] = useState<ITag[]>();
  const handleFilteredTags = (tags: ITag[]) => {
    setFilteredTags(tags);
  } 

  useEffect(() => {
    if (allTags?.getAllTags) {
      handleFilteredTags(allTags?.getAllTags);
    } 
  }, [allTags?.getAllTags]);
  
  if (tagsError) return <ErrorModal error={tagsError} onModalClose={handleModalClose} />
  
  const ActiveLoaderTags: React.FC = () => (
    <div className="page all-tags">
      <div className="loader-all-items">
        <Loader styleClass="loader" />
        <DynamicIcon iconName={DefaultIconsNames.TAG as keyof typeof icons} color='' />
        <h4>Chargement des tags...</h4> 
      </div>
    </div> 
  )

  if (tagsLoading) {
     return <ActiveLoaderTags />
  }

  return (
    <div className="page all-tags" >
      {loading ? (
        <ActiveLoaderTags />
      ) : (
        <div className="content">
          <h2 className="page-title">Les tags</h2>
          <div className="infos">
            <p><span>*</span>L'icône <DynamicIcon iconName={DefaultIconsNames.TAG} color={Colors.PURPLE} />est utilisée par défault lors de la création si l'icône a déjà été choisie pour un autre tag présent dans la liste ou que l'icône validée n'existe pas dans la liste des icônes diponibles.</p>
          </div>
          <CreateTag icons={icons} />
          <UseFilteredSearch dataToFilter={allTags.getAllTags} searchKey={"name"} setItems={handleFilteredTags} />
          {
            filteredTags && 
            filteredTags.map(
              (tag: ITag, index: number) => {
                return (
                  <div className="tag-section" key={tag.id}>
                    <Accordion expanded={expanded === "panel" + (index + 1)} onChange={handleChange("panel" + (index + 1))}>
                      <AccordionSummary
                        expandIcon={<ExpandMoreIcon className="icon-blue-light" />}
                        aria-controls={`panel${index + 1}bh-content`}
                      >
                      <Typography sx={{ width: '33%', flexShrink: 0 }}>
                        <DynamicIcon iconName={tag.icon} color='' />
                      </Typography>
                      <Typography className='name-section-color' sx={{ color: 'text.secondary' }}>{tag.name}</Typography>
                      </AccordionSummary>
                      <AccordionDetails id={`section-${index}`}>
                        <UpdateTag tag={tag} icons={icons} resetExpanded={resetExpanded} />
                      </AccordionDetails>
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
