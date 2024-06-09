import styled from "styled-components";
import { useEffect, useState, useRef } from "react";
import { requestGet } from "@lib/network/network";
import { useNavigate } from "react-router-dom";
import { getLocation } from "@lib/gps/gps";
import Cookies from 'js-cookie';
import { FaCheck, FaTimes } from 'react-icons/fa';

const StyledFrame = styled.div`
  margin: auto;
  width:100%;
  @media (min-width: 769px) {
    width: 600px;
  }

  @media (min-width: 1024px) {
    width: 800px;
  }
`;

const StyledTitle = styled.div`
  font-weight: 600;
  font-size: 18px;
  margin: 10px 0px 10px 10px;
`;

const StyledList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 20px 0;
  overflow-y: auto;
  max-height: 500px;
`;

const StyledListItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  background: #f9f9f9;
  padding: 15px;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  position: relative;
`;

const StyledImageContainer = styled.div`
  position: relative;
  width: 100%;
`;

const StyledImage = styled.img`
  width: 100%;
  height: auto;
  max-height: 200px;
  object-fit: contain;
  border-radius: 10px;
`;

const StyledIcon = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
  color: ${(props) => (props.isVisited ? 'green' : 'red')};
  font-size: 24px;
  background-color: white;
  border-radius: 50%;
  padding: 2px;
`;

const StyledDescription = styled.div`
  font-size: 14px;
  font-weight: 400;
  color: #666;
  text-align: left;
`;

const StyledArtTitle = styled.div`
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin-bottom: 5px;
`;

const StyledAuthor = styled.div`
  font-size: 14px;
  font-weight: 500;
  color: #333;
  margin-bottom: 5px;
`;

const StyledYear = styled.div`
  font-size: 14px;
  font-weight: 400;
  color: #888;
  margin-bottom: 5px;
`;

const ArtMain = ({ museumInfo = false }) => {
  const [artList, setArtList] = useState([]);
  const [gpsArtList, setGPSArtList] = useState([]);
  const [visitedState, setVisitedState] = useState({});
  const [gps, setGps] = useState({ latitude: 127.1, longitude: 31.5 });
  const navigate = useNavigate();
  const listRef = useRef();

  const fetchArts = async () => {
    if (museumInfo) {
      const accessToken = Cookies.get('accessToken');

      const headers = {
        Authorization: `Bearer ${accessToken}`,
      };

      const artsResponse = await requestGet('https://dexplore.info/api/v1/user/get-arts', { museumId: museumInfo.museumId }, headers);
      const gpsArtsResponse = await requestGet('https://dexplore.info/api/v1/user/get-nearest-n-arts', { museumId: museumInfo.museumId, latitude: gps.latitude, longitude: gps.longitude, amount: 10 }, headers);

      setArtList(artsResponse.artList);
      setGPSArtList(gpsArtsResponse.artList);

      // Check visited state for each art
      const visitedStatus = {};
      const allArts = [...artsResponse.artList, ...gpsArtsResponse.artList];
      const promises = allArts.map(async (art) => {
        const footprintResponse = await requestGet('https://dexplore.info/api/v1/user/get-footprint-state', { artId: art.artId }, headers);
        visitedStatus[art.artId] = footprintResponse.visited;
      });

      await Promise.all(promises);
      setVisitedState(visitedStatus);
    }
  };

  useEffect(() => {
    if (Object.keys(gps).length === 0) {
      getLocation().then(v => {
        setGps(v);
      });
    }
  }, []);

  useEffect(() => {
    if (museumInfo) {
      fetchArts();
    }
  }, [museumInfo, gps]);

  const handleScroll = () => {
    if (listRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = listRef.current;
      if (scrollTop + clientHeight >= scrollHeight) {
        getLocation().then(v => {
          setGps(v);
          fetchArts();
        });
      }
    }
  };

  const handleClick = () => {
    navigate('/user/art', { state: { museumInfo } });
  };

  const handleImageClick = (artId) => {
    navigate("/user/art/info", { state: { artId } });
  };

  return (
      <StyledFrame>
        <StyledTitle>회원님 근처의 작품을 모아봤어요</StyledTitle>
        <StyledList ref={listRef} onScroll={handleScroll} className={"list1"}>
          {gpsArtList.map((art, index) => (
              <StyledListItem key={index} onClick={() => handleImageClick(art.artId)} isVisited={visitedState[art.artId]}>
                <StyledImageContainer>
                  <StyledImage src={art.imgUrl} alt={art.artName} />
                  <StyledIcon isVisited={visitedState[art.artId]} className={"icon"}>
                    {visitedState[art.artId] ? <FaCheck /> : <FaTimes />}
                  </StyledIcon>
                </StyledImageContainer>
                <StyledArtTitle>{art.artName}</StyledArtTitle>
                <StyledAuthor>{art.authName}</StyledAuthor>
                <StyledYear>{art.artYear}</StyledYear>
                <StyledDescription>
                  {art.artDescription.length > 60 ? `${art.artDescription.substring(0, 160)}...` : art.artDescription}
                </StyledDescription>
              </StyledListItem>
          ))}
        </StyledList>
        <hr />
        <StyledTitle>{museumInfo.museumName}의 작품을 모아봤어요</StyledTitle>
        <StyledList className={"list2"}>
          {artList.map((art, index) => (
              <StyledListItem key={index} onClick={() => handleImageClick(art.artId)} isVisited={visitedState[art.artId]}>
                <StyledImageContainer>
                  <StyledImage src={art.imgUrl} alt={art.artName} />
                  <StyledIcon isVisited={visitedState[art.artId]}>
                    {visitedState[art.artId] ? <FaCheck /> : <FaTimes />}
                  </StyledIcon>
                </StyledImageContainer>
                <StyledArtTitle>{art.artName}</StyledArtTitle>
                <StyledAuthor>{art.authName}</StyledAuthor>
                <StyledYear>{art.artYear}</StyledYear>
                <StyledDescription>
                  {art.artDescription.length > 60 ? `${art.artDescription.substring(0, 160)}...` : art.artDescription}
                </StyledDescription>
              </StyledListItem>
          ))}
        </StyledList>
      </StyledFrame>
  );
};

export default ArtMain;
