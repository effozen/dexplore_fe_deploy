import InfoHeader from "@components/common/frame/InfoHeader";
import {useLocation} from "react-router-dom";
import {useEffect, useState} from "react";
import {requestGet} from "@lib/network/network";
import ArtMain from "@components/user/art/list/new/ArtMain";
import ArtLoc from "@components/user/art/list/new/ArtLoc";
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
  const [museumId, setMuseumId] = useState(false);
  const [museumInfo, setMuseumInfo] = useState(false);

  useEffect(() => {
    setMuseumId(location.state.museumId);
  }, []);

  useEffect(() => {
    if(museumId) {
      requestGet('https://dexplore.info/api/v1/user/get-museum', {museumId}).then((v) => {
        setMuseumInfo(v.museum);
      });
    }
  }, [museumId]);

  return (
    <div>
      <StyledHeaderFrame>
        <StyledHeader>회원님 근처의 작품을 모아봤어요</StyledHeader>
      </StyledHeaderFrame>
      <ArtMain museumInfo={museumInfo}></ArtMain>
      <ArtLoc></ArtLoc>
    </div>
  );
}

export default ArtInfo;