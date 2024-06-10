import InfoHeader from "@components/common/frame/InfoHeader";
import {useLocation, useNavigate} from "react-router-dom";
import {useEffect, useState, useRef} from "react";
import {requestGet, requestPost} from "@lib/network/network";
import { AiFillSound } from "react-icons/ai";
import { BsBookmarkStarFill, BsBookmarkStar } from "react-icons/bs";
import styled from "styled-components";
import { useCookies } from "react-cookie";
import {jwtDecode} from "jwt-decode";
import Joyride, {ACTIONS, STATUS} from "react-joyride";
import ToggleButton from "@components/common/gunwoo/ToggleButton";

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
	margin-left: 22px;
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
    display: flex;
    justify-content: center;
    align-items: center;
`;

const ImageContainer = styled.div`
  width: 96vw;
  margin: auto;
  @media (min-width: 769px) {
    width: 36vw;
  }

  @media (min-width: 1024px) {
    width: 24vw;
  }
`

const ArtInfo = () => {
  const location = useLocation();
  const [artId, setArtId] = useState(false);
  const [artInfo, setArtInfo] = useState(false);
  const audioRef = useRef(null);
  const [ttsUrl, setTtsUrl] = useState('');
  const [isBookMarked, setIsBookMarked] = useState(false);
  const [cookie, setCookie, removeCookie] = useCookies();
  const navigate = useNavigate();
  const [runTour, setRunTour] = useState(false);
  const [tourKey, setTourKey] = useState(0);

  const steps = [
    {
      target: '.bookmark',
      content: '여기를 클릭해 마음에 드는 작품을 북마크하세요.',
      disableBeacon: true,
    },
    {
      target: '.sound',
      content: '여기를 클릭해 작품 설명을 오디오로 들어보세요.',
      disableBeacon: true,
    }
  ];

  const handleJoyrideCallback = (data) => {
    const { status, action } = data;
    const finishedStatuses = [STATUS.FINISHED, STATUS.SKIPPED];

    if (finishedStatuses.includes(status) || action === ACTIONS.CLOSE) {
      setRunTour(false);
      setTourKey((prevKey) => prevKey + 1); // Reset the Joyride instance
    }
  };

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

  // 사용자 정보 및 토큰 검사
  useEffect(() => {
    const token = cookie.accessToken;
    if (token) {
      const decodedToken = jwtDecode(token);
      const now = Date.now() / 1000;
      if (decodedToken.exp < now) {
        removeCookie('accessToken', { path: '/' });
        navigate("/auth/sign-in");
      }
    } else {
      navigate('/auth/sign-in');
    }
  }, [cookie, removeCookie]);

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
    requestPost('https://dexplore.info/api/v1/user/bookmarking', {artId}).then(v => {
      window.location.reload();
    });
  }

  return (
    <div><Joyride
        key={tourKey}
        steps={steps}
        run={runTour}
        continuous
        showSkipButton
        showProgress
        callback={handleJoyrideCallback}
        spotlightClicks={true}
        styles={{
          options: {
            zIndex: 10000,
            arrowColor: '#FFFFFF',
            backgroundColor: '#FFFFFF',
            primaryColor: '#000000',
            textColor: '#000000',
            width: 900,
            height: 900,
          },
        }}
    />

      <InfoHeader name={artInfo ? artInfo.artName : '로딩중...'}></InfoHeader>
      <div className="flex flex-col">
        <ImageContainer>
          <img src={artInfo.imgUrl} alt="imgUrl"/>
        </ImageContainer>
        <StyledBookMark className={"bookmark"} onClick={handleBookMark}>
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
                <AiFillSound className={"sound"} size='32px' style={{color: '#FFFFFF'}}/>
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
      <ToggleButton setRunTour={setRunTour} />
    </div>
  );
};

export default ArtInfo;
