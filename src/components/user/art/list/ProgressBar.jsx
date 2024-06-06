import {Progress} from "@components/common/shadcn/progress";
import styled from "styled-components";
import {useEffect, useState} from "react";
import {requestGet} from "@lib/network/network";
import {useLocation} from "react-router-dom";

const StyledFrame = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
	margin-top: 7px;
	margin-bottom: 7px;
`;

const StyledTitle = styled.div`
	font-weight: 700;
	font-size: 20px;
`;

const ProgressBar = () => {
  const [percentage, setPercentage] = useState(0);
  const location = useLocation();

  useEffect(() => {
    requestGet('https://dexplore.info/api/v1/user/get-viewing-rate', {museumId: location.state.museumInfo.museumId}).then(v => {
      setPercentage(v.percentage);
    });
  }, []);

  return (
    <StyledFrame>
      <StyledTitle>관람률</StyledTitle>
      <div className="w-[60%] mr-[10px] ml-[10px]">
        <Progress className="[&>*]:bg-green-500" value={percentage}/>
      </div>
      <StyledTitle>
        {`${percentage}%`}
      </StyledTitle>
    </StyledFrame>
  );
};

export default ProgressBar;