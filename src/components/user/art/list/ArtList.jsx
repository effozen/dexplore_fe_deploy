import InfoHeader from "@components/common/frame/InfoHeader";
import {useLocation} from "react-router-dom";
import {useEffect, useState} from "react";
import ProgressBar from "@components/user/art/list/ProgressBar";
import ArtListItems from "@components/user/art/list/ArtListItems";
import ToggleButton from "@components/common/gunwoo/ToggleButton";

const ArtList = () => {
  const location = useLocation();
  const [museumInfo, setMuseumInfo] = useState(false);

  useEffect(() => {
    setMuseumInfo(location.state.museumInfo);
  }, []);

  return (
    <div>
      <InfoHeader name={museumInfo ? museumInfo.museumName : '로딩중...'}></InfoHeader>
      <ProgressBar />
      <ArtListItems></ArtListItems>
        <ToggleButton/>
    </div>
  );
}

export default ArtList;