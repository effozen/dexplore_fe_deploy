import {Fragment} from "react";
import Header from "@components/common/frame/Header";
import ArtCreateForm from "@components/admin/art/create/ArtCreateForm";

const ArtCreate = () => {
  return (
    <>
      <Header name='새로운 작품을 등록하세요' height='100px' isDate={false}></Header>
      <ArtCreateForm></ArtCreateForm>
    </>
  );
}

export default ArtCreate;