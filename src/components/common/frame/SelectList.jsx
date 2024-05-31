import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@components/common/shadcn/select";
import styled from "styled-components";

// Styled Components
const StyledSelectTrigger = styled(SelectTrigger)`
	width: 120px;
	height: 21px;
	display: flex;
	align-items: center;
	margin-right: 30px;
	font-size: 12px;
	border-color: black;
`;

const SelectList = ({selectItems, setChosenMuseum}) => {
  const handleChange = (e) => {
    let chosenMuseumInfo;
    selectItems.forEach((obj) => {
      if (obj.museumName === e) {
        chosenMuseumInfo = obj;
      }
    })
    setChosenMuseum(chosenMuseumInfo);
  };

  return (
    <Select onValueChange={handleChange}>
      <StyledSelectTrigger>
        <SelectValue placeholder={selectItems.length > 0 ? selectItems[0].museumName : "museumInfo"} />
      </StyledSelectTrigger>
      <SelectContent>
        {selectItems.map(item => (
          <SelectItem key={item.museumId} value={item.museumName}>
            {item.museumName}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default SelectList;
