import ContentCarousel from "@components/common/frame/ContentCarousel";
import styled from "styled-components";
import { useEffect, useState, useMemo } from "react";
import { requestGet } from "@lib/network/network";
import { useNavigate } from "react-router-dom";

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
  margin-left: auto;
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

const MuseumMain = ({ museumInfo = false }) => {
  const [artList, setArtList] = useState([]);
  const navigate = useNavigate();

  const memoizedMuseumInfo = useMemo(() => museumInfo, [museumInfo]);

  useEffect(() => {
    console.log(memoizedMuseumInfo);
    if (memoizedMuseumInfo) {
      requestGet('https://dexplore.info/api/v1/user/get-arts', { museumId: memoizedMuseumInfo.museumId }).then((v) => {
        setArtList(v.artList);
      });
    }
  }, [memoizedMuseumInfo]);

  const handleClick = () => {
    navigate('/user/art', { state: { museumInfo: memoizedMuseumInfo } });
  };

  return (
      <div>
        <StyledFrame>
          <img src={memoizedMuseumInfo.imgUrl} alt="" className="w-full min-h-[330px] max-h-[500px] max-w-[800px]" />
          <div className={"startButton"}><StyledButton onClick={handleClick}>관람 시작하기</StyledButton></div>
          <StyledDescription className="w-full max-w-[800px] mt-[20px] pl-[40px] pr-[40px]">
            {memoizedMuseumInfo.description && memoizedMuseumInfo.description.length > 500
                ? memoizedMuseumInfo.description.substring(0, 500)
                : memoizedMuseumInfo.description}
          </StyledDescription>
        </StyledFrame>
        <StyledFrame2>
          {artList && (
              <div className={"artList"}>
                  <ContentCarousel
                      isAdmin={false}
                      name={`${memoizedMuseumInfo.museumName}의 대표 작품`}
                      isMuseum={false}
                      chosenMuseum={memoizedMuseumInfo}
                      itemInfo={artList}
                  />
              </div>
          )}
        </StyledFrame2>
      </div>
  );
};

export default MuseumMain;
