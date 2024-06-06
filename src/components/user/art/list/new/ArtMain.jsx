import ContentCarousel, {VerticalContentCarousel} from "@components/common/frame/ContentCarousel";
import styled from "styled-components";
import {useEffect, useState} from "react";
import {requestGet} from "@lib/network/network";
import {useNavigate} from "react-router-dom";
import {getLocation} from "@lib/gps/gps";

const StyledFrame = styled.div`
	min-height: 385px;
	min-width: 375px;
	display: flex;
	flex-direction: column;
	align-items: center;
`;

const StyledDescription = styled.div`
	font-size: 16px;
	font-weight: 400;
	color: #909090;
	line-height: 18px;
`;

const StyledFrame2 = styled.div`
	min-width: 375px;
	margin-left:auto;
  margin-top: 20px;
`;

const StyledButton = styled.button`
  z-index: 3;
  margin-left: auto;
  margin-right: auto;
  margin-top: -70px;
  margin-bottom: 20px;
  color: white;
  font-weight: 400;
  font-size: 20px;
  background-color: black;
  width: 160px;
  height: 45px;
  border-radius: 40px;
  border: white solid 1px;
`;

const ArtMain = ({museumInfo = false}) => {
  const [artList, setArtList] = useState();
  const navigate = useNavigate();
  const [gps, setGps] = useState({latitude: 127.1, longitude:31.5});
  const [gpsArtList, setGPSArtList] = useState();

  useEffect(() => {
    if (Object.keys(gps).length === 0) {
      getLocation().then(v => {
        const tmp = {...v};
        setGps(tmp);
      });
    }
  }, []);

  useEffect(() => {
    if (museumInfo) {
      requestGet('https://dexplore.info/api/v1/user/get-arts', {museumId: museumInfo.museumId}).then((v) => {
        setArtList(v.artList);
      });
      requestGet('https://dexplore.info/api/v1/user/get-arts', {museumId: museumInfo.museumId, latitude:gps.latitude, longitude:gps.longitude, amount:10}).then((v) => {
        // console.log(v);
        setGPSArtList(v.artList);
      });
    }
  }, [museumInfo]);

  const handleClick = () => {
    navigate('/user/art', {state:{museumInfo}});
  }

  return (
      <StyledFrame2>
        {artList && <VerticalContentCarousel isAdmin={false} name={`${museumInfo.museumName}의 대표 작품`} isMuseum={false}
                                     chosenMuseum={museumInfo} itemInfo={artList}></VerticalContentCarousel>}
      </StyledFrame2>
  );
};

export default ArtMain;