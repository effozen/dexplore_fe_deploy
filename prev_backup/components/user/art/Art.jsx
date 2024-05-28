import './Art.scss';
import Frame from "../../frames/Frame";
import Header from "../../frames/Header";
import {useLocation, useNavigate} from "react-router-dom";
import { useEffect, useState } from "react";
import Line from "../../frames/Line";
import ArtList from "./ArtList";

const Art = () => {
  const location = useLocation();
  const { museumId } = location.state || {};

  const [isOn, setIsOn] = useState(true); // true === 읽기


  const toggleHandler = () => {
    setIsOn(prev => !prev);
  };

  useEffect(() => {
    if (museumId) {
      // museumId를 사용하여 필요한 작업 수행
      console.log('Received museumId:', museumId);
    }
  }, [museumId]);

  return (
    <Frame>
      <Header>
        작품 목록
      </Header>
      <Line />
      <ArtList museumId={museumId} isOn={isOn}/>
    </Frame>
  );
}

export default Art;
