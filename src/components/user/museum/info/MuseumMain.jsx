import ContentCarousel from "@components/common/frame/ContentCarousel";
import styled from "styled-components";
import {useEffect, useState} from "react";
import {requestGet} from "@lib/network/network";

const StyledFrame = styled.div`
	min-height: 385px;
	min-width: 375px;
	display: flex;
	flex-direction: column;
	align-items: center;
`;

const StyledDescription = styled.div`
	font-size: 14px;
	font-weight: 400;
	color: black;
	line-height: 18px;
`;

const MuseumMain = ({museumInfo = false}) => {
  const [artList, setArtList] = useState();

  useEffect(() => {
    console.log(museumInfo);
    if (museumInfo) {
      requestGet('https://dexplore.info/api/v1/user/get-arts', {museumId: museumInfo.museumId}).then((v) => {
        setArtList(v.artList);
      });
    }
  }, [museumInfo]);

  useEffect(() => {
    console.log(artList);
  }, [artList])

  return (
    <div>
      <StyledFrame>
        <img src={museumInfo.imgUrl} alt="" className="w-full min-h-[385px] max-h-[600px] max-w-[800px]"/>
        <StyledDescription
          className="w-full max-w-[800px] mt-[18px] pl-[30px] pr-[30px]">{museumInfo.description}</StyledDescription>
      </StyledFrame>
      {artList && <ContentCarousel isAdmin={false} name={`${museumInfo.museumName}의 대표 작품`} isMuseum={false}
                                   chosenMuseum={museumInfo} itemInfo={artList}></ContentCarousel>}
    </div>
  );
};

export default MuseumMain;