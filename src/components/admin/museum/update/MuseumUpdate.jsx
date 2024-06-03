import {Fragment} from "react";
import Header from "@components/common/frame/Header";
import MuseumUpdateForm from "@components/admin/museum/update/MuseumUpdateForm";
import {useLocation} from "react-router-dom";

const MuseumUpdate = () => {
  const location = useLocation();

  return (
    <>
      <Header name='박물관 정보 업데이트' height='100px' isDate={false}></Header>
      <MuseumUpdateForm id={location.state.id}></MuseumUpdateForm>
    </>
  );
};

export default MuseumUpdate;