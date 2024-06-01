import {Fragment} from "react";
import Header from "@components/common/frame/Header";
import MuseumForm2 from "@components/common/frame/MuseumForm2";

const MuseumUpdate = () => {

  return (
    <>
      <Header name='박물관 정보 업데이트' height='100px' isDate={false}></Header>
      <MuseumForm2></MuseumForm2>
    </>
  );
};

export default MuseumUpdate;