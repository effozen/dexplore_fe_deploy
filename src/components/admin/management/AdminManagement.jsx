// @ts-ignore
import React from 'react';
import Header from "@components/common/frame/Header";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@components/common/shadcn/carousel"


const AdminManagement = () => {
  const name = '홍길동';

  return (
    <>
      <Header name={name} height="130px" />

    </>
  );
}

export default AdminManagement;
