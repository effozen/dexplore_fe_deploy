import InfoHeader from "@components/common/frame/InfoHeader";
import {useLocation} from "react-router-dom";
import {useEffect, useState} from "react";
import ProgressBar from "@components/user/art/list/ProgressBar";
import ArtInfo from "@components/user/art/list/new/ArtInfo";

const ArtInfo = () => {
  const location = useLocation();
  const [museumInfo, setMuseumInfo] = useState(false);

  useEffect(() => {
    setMuseumInfo(location.state.museumInfo);
  }, []);

  return (
    <div>
      <InfoHeader name={museumInfo ? museumInfo.museumName : '로딩중...'}></InfoHeader>
    </div>
  );
}

export default ArtInfo;