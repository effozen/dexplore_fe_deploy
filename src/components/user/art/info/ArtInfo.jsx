import InfoHeader from "@components/common/frame/InfoHeader";
import {useLocation} from "react-router-dom";
import {useEffect, useState, useRef} from "react";
import {requestGet} from "@lib/network/network";
import { AiFillSound } from "react-icons/ai";
import { BsBookmarkStarFill, BsBookmarkStar } from "react-icons/bs";
import styled from "styled-components";

const StyledName = styled.div`
	font-weight: 700;
	font-size: 24px;
	margin-top: 15px;
	margin-left: 22px;
`;
const StyledSubName = styled.div`
	font-weight: 400;
	font-size: 20px;
	margin-left: 22px;
	font-color:#C8C8C8;
`;
const StyledAuthName = styled.div`
	font-weight: 400;
	font-size: 20px;
	margin-left: 17px;
	font-color:black;
`;
const StyledDescription = styled.div`
	font-weight: 400;
	font-size: 16px;
	margin-top:30px;
	margin-left: 22px;
	margin-right: 22px;
	font-color:#909090;
`;
const StyledBookMark = styled.div`
	position: absolute;
	z-index: 3;
	top: 70px;
	right: 20px;
	background-color:black;
	width:40px;
	height:45px;
	border-radius:8px;
	opacity: 0.6;
`;

const ArtInfo = () => {
  const location = useLocation();
  const [artId, setArtId] = useState(false);
  const [artInfo, setArtInfo] = useState(false);
  const audioRef = useRef(null);
  const [ttsUrl, setTtsUrl] = useState('');
  const [isBookMarked, setIsBookMarked] = useState(false);

  useEffect(() => {
    setArtId(location.state.artId);
  }, []);

  useEffect(() => {
    if (artId) {
      requestGet('https://dexplore.info/api/v1/user/get-art', {artId}).then(v => {
        setArtInfo(v.art);
      });
      requestGet('https://dexplore.info/api/v1/user/check-bookmark', {artId}).then((v) => {
        setIsBookMarked(v.bookmark);
      });
    }
  }, [artId]);

  useEffect(() => {
    if(artInfo) {
      requestGet('https://dexplore.info/api/v1/user/get-tts', {ttsId:artInfo.ttsId}).then(v => {
        setTtsUrl(v.tts.bucketUrl);
      });
    }
  }, [artInfo]);

  const getTtsUrl = async (ttsId) => {
    const token = cookies.accessToken;

    if (!token) {
      console.error('Access token is not available.');
      return;
    }

    const headers = {
      Authorization: `Bearer ${token}`
    };

    let params = {ttsId};

    const result = await axios.get('https://dexplore.info/api/v1/user/get-tts', {headers, params});

    console.log(result);

    const ttsUrl = result.data.tts.bucketUrl;

    setTtsUrl(ttsUrl);
  };

  const handleTTSClick = () => {
    if (audioRef.current) {
      if (audioRef.current.paused) {
        audioRef.current.play();
      } else {
        audioRef.current.pause();
      }
    }
  };

  const handleBookMark = () => {
    requestGet('https://dexplore.info/api/v1/user/bookmarking', {artId}).then(v => {
      window.location.reload();
    });
  }

  return (
    <div>
      <InfoHeader name={artInfo ? artInfo.artName : '로딩중...'}></InfoHeader>
      <div className="flex flex-col">
        <div className="m-0 p-0 w-full max-h-[380px]">
          <img src={artInfo.imgUrl} alt="imgUrl" className="w-full max-h-[380px] object-cover"/>
        </div>
        <StyledBookMark className='flex justify-center items-center' onClick={handleBookMark}>
          <div>
           {isBookMarked ? <BsBookmarkStarFill size='33px' className='text-yellow-400'/> : <BsBookmarkStar size='33px' className='text-yellow-400'/>}
          </div>
        </StyledBookMark>
        <div className='grid grid-cols-2'>
          <div>
            <StyledName>
              {artInfo.artName}
            </StyledName>
            <StyledSubName>
              {artInfo.artYear}
            </StyledSubName>
            <StyledAuthName>
              {artInfo.authName}
            </StyledAuthName>
          </div>
          <div className="flex justify-end items-center pt-[23px] pr-[22px]">
            <div className='flex flex-col justify-center items-center'>
              <div className='flex justify-center items-center w-[44px] h-[44px] bg-black rounded-[8px]'
                   onClick={handleTTSClick}>
                <AiFillSound className='text-white' size='32px'/>
              </div>
              {/* <div>음성 큐레이션</div> */}
            </div>
          </div>
        </div>
        <StyledDescription>
          {artInfo.artDescription}
        </StyledDescription>
      </div>

      <audio ref={audioRef} src={ttsUrl}/>
    </div>
  );
};

export default ArtInfo;
