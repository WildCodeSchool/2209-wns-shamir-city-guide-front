import { ChangeEvent } from 'react';
import { 
  FormGroup,
  FormControlLabel, 
  Checkbox,
  Avatar
} from "@mui/material";
import DynamicIcon from '../dynamicIcon/DynamicIcon';

export const StyleAvatar = {
  padding: '0px',
  width: '80px',
  height: '40px',
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
  labelId?: string
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
    labelId
  } = props;
  
  return (
    <FormGroup className={checkboxListClassname} >
      {dataToList.map((item: any) => (
        <FormControlLabel
          key={item.id}
          id={labelId}
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
              {displayImg && propertyImgToDisplay &&
                <Avatar
                alt={`${item[menuItemPropertyToDisplay]}-img-alt`}
                src={item[propertyImgToDisplay]}
                style={StyleAvatar}
              />
              }
            </div>
          }
        />
      ))}
    </FormGroup>
  );
};

export default CustomCheckboxList;
