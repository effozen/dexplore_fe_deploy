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
import {AiFillDelete, AiOutlinePlus} from "react-icons/ai";
import {requestPost, requestGet} from "@lib/network/network";
import {useNavigate} from "react-router-dom";

// Styled Components
const StyledFrame = styled.div`
	margin-left: 16px;
	margin-bottom: 10px;
	margin-top: 10px;
`;

const StyledHeaderFrame = styled.div`
	width: 375px;
	display: flex;
	justify-content: space-between;
	align-items: center;
	//padding: 10px;
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
	line-height: 11px;
`;

const StyledIcon = styled(AiFillDelete)`
	stroke: white;
	stroke-width: 20px;
	fill: currentColor;
	width: 17px;
	height: 17px;
	position: absolute;
	top: 5px;
	right: 5px;
	border-radius: 50%;
`;

const StyledImageWrapper = styled.div`
	position: relative;
	width: 100%;
	height: 100%;
`;

const StyledAddWrapper = styled.div`
	font-size: 12px;
	font-weight: 600;
	text-align: center;
`;

const DeleteIcon = ({isMuseum = true, id}) => {
  const urlList = {
    museum: 'https://dexplore.info/api/v1/admin/delete-museum',
    art: 'https://dexplore.info/api/v1/admin/delete-art',
  };

  const handleClick = (e) => {
    if (isMuseum) {
      requestPost(urlList['museum'], {museumId: id});
    } else {
      requestPost(urlList['art'], {artId: id});
    }
  };

  return <StyledIcon onClick={handleClick}/>;
};

const CarouselItemComponent = ({isAdmin, imageSrc, title, description, isMuseum, id}) => (
  <CarouselItem className="basis-[35%] pl-[3px]">
    <div className="p-1">
      <Card className="h-full w-full">
        <CardContent className="flex aspect-square items-center justify-center p-0 relative">
          <StyledImageWrapper>
            {isAdmin && <DeleteIcon isMuseum={isMuseum} id={id}/>}
            <img src={imageSrc} alt="" className="h-full w-full object-cover rounded-lg"/>
          </StyledImageWrapper>
        </CardContent>
      </Card>
      <StyledTitle>{title}</StyledTitle>
      <StyledDescription>{description}</StyledDescription>
    </div>
  </CarouselItem>
);

const AddNewItemComponent = ({isMuseum}) => {
  const navigate = useNavigate();
  let message = isMuseum ? '박물관' : '작품';

  const handleClick = (e) => {
    const path = isMuseum ? '/admin/museum/create' : '/admin/art/create';

    navigate(path);
  }

  return (
    <CarouselItem className="basis-[34%] pl-[3px]" onClick={handleClick}>
      <div className="p-1">
        <Card className="h-full w-full border-2 border-dashed border-gray-500">
          <CardContent className="flex flex-col aspect-square items-center justify-center p-0 relative bg-gray-200">
            <AiOutlinePlus className="text-5xl text-gray-500"/>
            <StyledAddWrapper>{message} 추가하기</StyledAddWrapper>
          </CardContent>
        </Card>
      </div>
    </CarouselItem>
  );
};

// Main Component
const ContentCarousel = ({
                           name,
                           museumSelector,
                           itemInfo = [{id: 1, url: 'test.com', title: '제목', description: '내용입니다.'}],
                           isAdmin = true,
                           isMuseum
                         }) => (
  <StyledFrame>
    <StyledHeaderFrame>
      <StyledHeader>{name}</StyledHeader>
      {museumSelector}
    </StyledHeaderFrame>
    <Carousel opts={{align: "start"}} className="w-[365px]">
      <CarouselContent className="ml-0">
        {itemInfo.map((item, index) => {
          let info;

          if (isMuseum) {
            info = {
              id: item.museumId,
              name: item.museumName,
              imgUrl: item.imgUrl,
              description: item.description,
            };
          } else {
            info = {
              id: item.artId,
              name: item.artName,
              imgUrl: item.imgUrl,
              description: item.description,
            };
          }

          return <CarouselItemComponent
            key={info.id}
            isAdmin={isAdmin}
            imageSrc={info.imgUrl}
            title={info.name}
            description={info.description}
            isMuseum={isMuseum}
            id={info.id}
          />;
        })}
        {isAdmin && <AddNewItemComponent isMuseum={isMuseum}/>}
      </CarouselContent>
    </Carousel>
  </StyledFrame>
);

export default ContentCarousel;
