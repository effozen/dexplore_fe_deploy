import {Fragment} from "react";
import Header from "@components/common/frame/Header";
import Form from "@components/common/frame/Form";

const MuseumCreate = () => {

  return (
    <>
      <Header name='새로운 박물관을 등록하세요' height='100px' isDate={false}></Header>
      <Form></Form>
    </>
  );
};

export default MuseumCreate;