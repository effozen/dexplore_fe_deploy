import './AdminMuseum.scss';
import Frame from "../../frames/Frame";
import Header from "../../frames/Header";
import Line from "../../frames/Line";
import ToggleButton from "../../frames/ToggleButton";
import MuseumList from "./MuseumList";
import { useState } from 'react';

const AdminMuseum = () => {
  const [isOn, setIsOn] = useState(true); // true === 읽기

  const toggleHandler = () => {
    setIsOn((prev) => !prev);
    console.log(isOn);
  };

  return (
    <Frame>
      <Header>
        나의 박물관
      </Header>
      <ToggleButton isOn={isOn} toggleHandler={toggleHandler} />
      <Line/>
      <MuseumList isOn={isOn}>
      </MuseumList>
    </Frame>
  );
}

export default AdminMuseum;
