import { ChangeEvent, useState } from 'react';
import { 
  FormGroup,
  FormControlLabel, 
  Checkbox,
  Avatar,
  Box,
  SelectChangeEvent
} from "@mui/material";
import DynamicIcon from '../dynamicIcon/DynamicIcon';

export const StyleAvatar = {
  padding: '0px',
  width: '100px',
  height: '50px',
  marginLeft: '32px',
  borderRadius: 5
}

interface CheckboxListProps <T> {
  checkboxListClassname: string
  onChange: (event: ChangeEvent<HTMLInputElement>) => void
  idsArray: (number | undefined)[]
  dataToList: T[]
  menuItemPropertyToDisplay: string
  displayImg: boolean
  propertyImgToDisplay: string | null
  displayIcon: boolean,
  iconColor: string
}

function CustomCheckboxList<T>(props: CheckboxListProps<T>) {
  const {
    checkboxListClassname, 
    onChange,
    idsArray,
    dataToList,
    menuItemPropertyToDisplay,
    displayImg,
    propertyImgToDisplay,
    displayIcon,
    iconColor,
  } = props;
  
  return (
    <FormGroup className={checkboxListClassname} >
      {dataToList.map((item: any) => (
        <FormControlLabel
          key={item.id}
          control={
            <Checkbox
              checked={idsArray.includes(parseInt(item.id)) || false}
              onChange={() => onChange(item.id)}
              color="primary"
            />
          }
          label={
            <div style={{ display: "flex", alignItems: "center" }}>
              <p> {item[menuItemPropertyToDisplay]} </p>
              {displayIcon && propertyImgToDisplay &&
                <DynamicIcon iconName={item[propertyImgToDisplay]} color={item?.color ?? iconColor} />
              }
            </div>
          }
        />
      ))}
    </FormGroup>
  );
};

export default CustomCheckboxList;
