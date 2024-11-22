import styled from "styled-components";
// import {loadKakaoMap, Map} from "@components/common/KakaoMap/KakaoMap";
import {useEffect} from "react";
import { Map } from '@components/common/KakaoMap/KakaoMap';

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

const MuseumLoc = ({museumLocation}) => {

  useEffect(() => {
    // loadKakaoMap();
  }, []);

  return (
    <StyledFrame>
      <StyledHeaderFrame>
        <StyledHeader>박물관 위치 보기</StyledHeader>
      </StyledHeaderFrame>
      <div className='flex justify-center '>
        <Map museumLocation={museumLocation}></Map>
      </div>
    </StyledFrame>
  );
}

export default MuseumLoc;