import InfoHeader from "@components/common/frame/InfoHeader";
import {useLocation} from "react-router-dom";
import {useEffect, useState} from "react";
import ProgressBar from "@components/user/art/list/ProgressBar";
import ArtListItems from "@components/user/art/list/ArtListItems";
import ToggleButton from "@components/common/gunwoo/ToggleButton";
import Joyride, {ACTIONS, STATUS} from "react-joyride";

const ArtList = () => {
  const location = useLocation();
  const [museumInfo, setMuseumInfo] = useState(false);
    const [runTour, setRunTour] = useState(false);
    const [tourKey, setTourKey] = useState(0);

    const steps = [
        {
            target: '.ProgressBar',
            content: '여기에서 회원님이 이 박물관의 작품을 얼마나 감상했는지 확인할 수 있어요.',
            disableBeacon: true,
        },
        {
            target: '.list1',
            content: '여기에서 회원님 근처의 작품을 확인하세요.',
            disableBeacon: true,
        },
        {
            target: '.icon',
            content: '회원님이 이미 감상한 작품은 v로, 감상하지 않은 작품은 x로 표시돼요.',
            disableBeacon: true,
        },
        {
            target: '.list2',
            content: '여기에서 박물관의 모든 작품을 볼 수 있어요.',
            disableBeacon: true,
        },
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
    setMuseumInfo(location.state.museumInfo);
  }, []);

  return (
    <div>
        <Joyride
            key={tourKey}
            steps={steps}
            run={runTour}
            continuous
            showSkipButton
            callback={handleJoyrideCallback}
            spotlightClicks={true}
            styles={{
                options: {
                    zIndex: 10000,
                    arrowColor: '#e3ffeb',
                    backgroundColor: '#e3ffeb',
                    primaryColor: '#000000',
                    textColor: '#000000',
                    width: 900,
                    height: 900,
                },
            }}
        />
      <InfoHeader name={museumInfo ? museumInfo.museumName : '로딩중...'}></InfoHeader>
        <div className={"ProgressBar"}>
            <ProgressBar />
        </div>
      <ArtListItems></ArtListItems>
        <ToggleButton setRunTour={setRunTour}/>
    </div>
  );
}

export default ArtList;