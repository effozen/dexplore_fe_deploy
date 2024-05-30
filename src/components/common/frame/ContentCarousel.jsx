import React from 'react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@components/common/shadcn/carousel";
import {
  Card,
  CardContent,
} from "@components/common/shadcn/card";
import styled from "styled-components";
import { AiFillDelete } from "react-icons/ai";

const StyledFrame = styled.div`
	margin-left: 16px;
	margin-bottom: 20px;
`;

const StyledHeader = styled.div`
	margin-top: 10px;
	font-weight: 600;
	color: #000000;
`;

const StyledTitle = styled.div`
	font-size: 12px;
	font-weight: 600;
`;

const StyledDescription = styled.div`
	font-size: 10px;
	font-weight: 300;
	color: #909090;
`;

// Styled component for the icon
const StyledIcon = styled(AiFillDelete)`
	stroke: white; // 테두리 색상 설정
	stroke-width: 20px; // 테두리 두께 설정
	fill: currentColor; // 아이콘 내부 색상 (필요 시 설정)
	width: 17px; // 아이콘의 크기 설정
	height: 17px; // 아이콘의 크기 설정
	position: absolute;
	top: 5px;
	right: 5px;
	background: rgba(0, 0, 0, 0.5); // 아이콘 배경 설정
	border-radius: 50%; // 아이콘을 원형으로
`;

const ImageWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
`;

const ContentCarousel = ({ name, titleContent, itemInfo = { url: 'test.com', title: '제목', description: '내용입니다.' }, isDelete = true }) => {
  return (
    <StyledFrame>
      <span className='justify-around'>
        <StyledHeader>{name}</StyledHeader>
        {titleContent}
      </span>
      <Carousel
        opts={{
          align: "start",
        }}
        className="w-[365px]">
        <CarouselContent className='ml-0'>
          {Array.from({ length: 5 }).map((_, index) => (
            <CarouselItem key={index} className="basis-[34%] pl-[3px]">
              <div className="p-1">
                <Card className="h-full w-full">
                  <CardContent className="flex aspect-square items-center justify-center p-0 relative">
                    <ImageWrapper>
                      {isDelete && <StyledIcon />}
                      <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/Baby.tux.sit-black-800x800.png" alt=""
                           className="h-full w-full object-cover rounded-lg"/>
                    </ImageWrapper>
                  </CardContent>
                </Card>
                <StyledTitle>
                  사과 박물관
                </StyledTitle>
                <StyledDescription>
                  설명입니다.
                </StyledDescription>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </StyledFrame>
  );
};

export default ContentCarousel;
