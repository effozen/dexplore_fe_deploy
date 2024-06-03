import {Fragment} from "react";
import Header from "@components/common/frame/Header";
import ArtUpdateForm from "@components/admin/art/update/ArtUpdateForm";

const ArtUpdate = () => {
  return (
    <>
      <Header name='새로운 작품을 등록하세요' height='100px' isDate={false}></Header>
      <ArtUpdateForm></ArtUpdateForm>
    </>
  );
}

export default ArtUpdate;