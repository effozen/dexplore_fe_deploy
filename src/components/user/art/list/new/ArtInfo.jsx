import InfoHeader from "@components/common/frame/InfoHeader";
import {useLocation} from "react-router-dom";
import {useEffect, useState} from "react";
import {requestGet} from "@lib/network/network";
import ArtMain from "@components/user/art/list/new/ArtMain";
import styled from "styled-components";

const StyledHeaderFrame = styled.div`
	min-width: 345px;
	display: flex;
	justify-content: space-between;
	align-items: center;
`;

const StyledHeader = styled.div`
  margin-left: 15px;
	margin-top: 30px;
    margin-bottom: 30px;
	font-weight: 600;
	color: #000000;
`;


const ArtInfo = () => {
  const location = useLocation();
  const [museumInfo, setMuseumInfo] = useState();

  useEffect(() => {
    setMuseumInfo(location.state.museumInfo);
  }, []);

  return (
    <div>
      <StyledHeaderFrame>
        <StyledHeader>회원님 근처의 작품을 모아봤어요</StyledHeader>
      </StyledHeaderFrame>
      <ArtMain museumInfo={museumInfo}></ArtMain>
    </div>
  );
}

export default ArtInfo;