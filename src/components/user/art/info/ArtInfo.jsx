import InfoHeader from "@components/common/frame/InfoHeader";
import {useLocation} from "react-router-dom";
import {useEffect, useState} from "react";
import {requestGet} from "@lib/network/network";

const ArtInfo = () => {
  const location = useLocation();
  const [artId, setArtId] = useState(false);
  const [artInfo, setArtInfo] = useState(false);

  useEffect(() => {
    setArtId(location.state.artId);
  }, []);

  useEffect(() => {
    if (artId) {
      requestGet('https://dexplore.info/api/v1/user/get-art', {artId}).then(v => {
        setArtInfo(v.art);
      });
    }
  }, [artId]);

  return (
    <div>
      <InfoHeader name={artInfo ? artInfo.artName : '로딩중...'}></InfoHeader>
    </div>
  );
}

export default ArtInfo;