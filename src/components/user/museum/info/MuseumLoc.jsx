import styled from "styled-components";
import {loadKakaoMap, Map} from "@components/common/KakaoMap/KakaoMap";
import {useEffect} from "react";

const StyledFrame = styled.div`
	min-width: 375px;
	display: flex;
	flex-direction: column;
  margin-left: 20px;
  margin-right:20px;
`;

const StyledHeaderFrame = styled.div`
	min-width: 345px;
	display: flex;
	justify-content: space-between;
	align-items: center;
`;

const StyledHeader = styled.div`
	margin-top: 20px;
	font-weight: 600;
	color: #000000;
`;

const MuseumLoc = () => {

  useEffect(() => {
    loadKakaoMap();
  }, []);

  return (
    <StyledFrame>
      <StyledHeaderFrame>
        <StyledHeader>박물관 위치 보기</StyledHeader>
      </StyledHeaderFrame>
        <Map></Map>
    </StyledFrame>
  );
}

export default MuseumLoc;