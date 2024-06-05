import styled from "styled-components";
import {loadKakaoMap, Map} from "@components/common/KakaoMap/KakaoMap";
import {useEffect} from "react";

const StyledFrame = styled.div`
	min-width: 300px;
	display: flex;
	flex-direction: column;
  margin-left: 10px;
  margin-right:10px;
`;

const StyledHeaderFrame = styled.div`
	min-width: 345px;
	display: flex;
	justify-content: space-between;
	align-items: center;
`;

const StyledHeader = styled.div`
  margin-left: 7px;
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
      <div className='flex justify-center '>
        <Map></Map>
      </div>
    </StyledFrame>
  );
}

export default MuseumLoc;