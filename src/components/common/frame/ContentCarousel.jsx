import JSZip from "jszip";
import { saveAs } from "file-saver";
import QRCode from 'qrcode';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@components/common/shadcn/carousel";
import {
  Card,
  CardContent,
} from "@components/common/shadcn/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@components/common/shadcn/dropdown-menu";

import styled from "styled-components";
import { AiFillDelete, AiOutlinePlus, AiOutlineMenu } from "react-icons/ai";
import { requestGet, requestPost } from "@lib/network/network";
import { useNavigate } from "react-router-dom";
import {useEffect, useState} from "react";

// Styled Components
const StyledFrame = styled.div`
    margin: 10px auto 10px auto;
	padding-left: 12px;
	padding-right: 12px;
    width: 100%;
	//min-width: 365px;
`;
const StyledHeaderFrame = styled.div`
	min-width: 345px;
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding-right: 20px;
	margin-right: -20px;
`;
const StyledHeader = styled.div`
	margin-top: 10px;
	font-weight: 600;
	color: #000000;
`;
const StyledHeader2 = styled.div`
  font-size: 25px;
	margin-top: 10px;
  margin-bottom: 10px;
	font-weight: 600;
	color: #000000;
`;

const StyledTitle = styled.div`
	font-size: 14px;
	font-weight: 600;
`;

const StyledTitle2 = styled.div`
  margin-top:5px;
	font-size: 22px;
	font-weight: 600;
`;

const StyledDescription = styled.div`
	font-size: 11px;
	font-weight: 300;
	color: #909090;
	line-height: 11px;
`;
const StyledDescription2 = styled.div`
	font-size: 15px;
	font-weight: 300;
	color: #909090;
	line-height: 15px;
`;
const StyledListIcon = styled(AiOutlineMenu)`
	stroke: white;
	stroke-width: 20px;
	fill: currentColor;
	background-color: rgba(255, 255, 255, 0.4);
	width: 30px;
	height: 30px;
	position: absolute;
	top: 1px;
	right: 1px;
	border-radius: 10%;
`;
const StyledDropDownMenuTrigger = styled(DropdownMenuTrigger)`
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

const StyledCarousel = styled(Carousel)`
    
`

const StyledCarouselContent = styled(CarouselContent)`
  padding: 0px 10px 0px 20px;
`

const StyledCarouselItem = styled(CarouselItem)`
  flex-basis: 140px;
  padding: 0px 0px 0px 0px;
  @media (min-width: 769px) {
    flex-basis: 180px;
  }

  @media (min-width: 1024px) {
    flex-basis: 220px;
  }
`

const LoadingContainer = styled.div`
  height: 200px;
  width: 100%;
  text-align: center;
  align-content: center;
  font-size: 20px;
  font-weight: 600;
`

const StyledCarouselItem2 = styled(CarouselItem)`
  flex-basis: 150px;
  margin: 10px;
  padding: 0px 0px 0px 0px;
  @media (min-width: 769px) {
  }

  @media (min-width: 1024px) {
  }
`
const StyledCard = styled.div`
  margin: 10px;
`
const ListIcon = ({ isMuseum = true, id, chosenMuseum, museumInfo }) => {
  const navigate = useNavigate();
  const [isDelete, setIsDelete] = useState(false);

  const handleDeleteClick = () => {
    const userAnswer = window.confirm("삭제하시겠습니까?");
    setIsDelete(userAnswer);
    if (userAnswer) {
      const url = isMuseum
        ? "https://dexplore.info/api/v1/admin/delete-museum"
        : "https://dexplore.info/api/v1/admin/delete-art";
      const bodyData = isMuseum ? { museumId: id } : { artId: id };
      requestPost(url, bodyData).then((v) => {
        setIsDelete(!userAnswer);
        window.location.reload();
      });
    }
  };
  const handleUpdateClick = () => {
    const path = isMuseum ? "/admin/museum/update" : "/admin/art/update";
    isMuseum
      ? navigate(path, { state: { id } })
      : navigate(path, { state: { id, museumId: chosenMuseum.museumId } });
  };

  const handleQrDownload = async () => {
    if (!isMuseum) {
      try {
        const artResponse = await requestGet(`https://dexplore.info/api/v1/user/get-art`, { artId: id });
        const qrcodeId = artResponse.art.qrcodeId;
        const qrcodeResponse = await requestGet('https://dexplore.info/api/v1/user/get-qrcode', { qrcodeId });
        const qrHash = qrcodeResponse.qrcode.qrcodeHashkey;
        // setQRCodeHash(qrHash);

        try {
          const canvas = document.createElement('canvas');
          await QRCode.toCanvas(canvas, qrHash, { errorCorrectionLevel: 'H' });
          const pngUrl = canvas.toDataURL('image/png').replace('image/png', 'image/octet-stream');
          const downloadLink = document.createElement('a');
          downloadLink.href = pngUrl;
          downloadLink.download = `${qrHash}.png`;
          document.body.appendChild(downloadLink);
          downloadLink.click();
          document.body.removeChild(downloadLink);
        } catch (error) {
          console.error(error);
        }

      } catch (error) {
        console.error('QR code download failed:', error);
      }
    }
  };

  const handleQrWholeDownload = async () => {
    console.log(id);
    const answer = await requestGet('https://dexplore.info/api/v1/user/get-arts', { museumId: id });
    const artList = answer.artList;

    const zip = new JSZip();

    for (const art of artList) {
      try {
        const artResponse = await requestGet(`https://dexplore.info/api/v1/user/get-art`, { artId: art.artId });
        const qrcodeId = artResponse.art.qrcodeId;
        const qrcodeResponse = await requestGet('https://dexplore.info/api/v1/user/get-qrcode', { qrcodeId });
        const qrHash = qrcodeResponse.qrcode.qrcodeHashkey;

        const canvas = document.createElement('canvas');
        await QRCode.toCanvas(canvas, qrHash, { errorCorrectionLevel: 'H' });
        const pngUrl = canvas.toDataURL('image/png').replace('image/png', 'image/octet-stream');
        const imgData = pngUrl.split(',')[1];

        zip.file(`${qrHash}.png`, imgData, { base64: true });
      } catch (error) {
        console.error('QR code download failed:', error);
      }
    }

    zip.generateAsync({ type: 'blob' }).then((content) => {
      saveAs(content, 'qrcodes.zip');
    });
  };

  return (
    <DropdownMenu>
      <StyledDropDownMenuTrigger>
        <StyledListIcon />
      </StyledDropDownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>작업 목록</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleDeleteClick}>
          {isMuseum ? "박물관" : "작품"} 삭제
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleUpdateClick}>
          {isMuseum ? "박물관" : "작품"} 수정
        </DropdownMenuItem>
        {!isMuseum ? (
          <DropdownMenuItem onClick={handleQrDownload}>
            QR 다운로드
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem onClick={handleQrWholeDownload}>
            QR 전체 다운로드
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
const CarouselItemComponent = ({
                                 isAdmin,
                                 imageSrc,
                                 title,
                                 description,
                                 isMuseum,
                                 id,
                                 chosenMuseum,
                                 isRecommend = false,
                               }) => {
  const navigate = useNavigate();

  const handleMuseumClick = () => {
    navigate("/user/museum", { state: { museumId: id } });
  };

    const handleArtClick = () => {
        navigate("/user/art/info", { state: { artId: id } });
    };

  return (
    <StyledCarouselItem
        onClick={!isAdmin ? (isMuseum ? handleMuseumClick : handleArtClick) : null}
    >
      <div className="p-1">
        <Card className="h-full w-full">
          <CardContent className="flex aspect-square items-center justify-center p-0 relative">
            <StyledImageWrapper>
              {isAdmin && (
                <ListIcon
                  isMuseum={isMuseum}
                  id={id}
                  chosenMuseum={chosenMuseum}
                />
              )}
              <img
                src={imageSrc}
                alt={title}
                className="h-full w-full object-cover rounded-lg"
              />
            </StyledImageWrapper>
          </CardContent>
        </Card >
        <StyledTitle>{title}</StyledTitle>
        <StyledDescription>
          {description &&
            (description.length > 50
              ? description.substring(0, 50) + "..."
              : description)}
        </StyledDescription>
      </div>
    </StyledCarouselItem>
  );
};

const AddNewItemComponent = ({ isMuseum, chosenMuseum }) => {
  const navigate = useNavigate();
  const message = isMuseum ? "박물관" : "작품";

  const handleClick = () => {
    const path = isMuseum ? "/admin/museum/create" : "/admin/art/create";
    isMuseum
      ? navigate(path)
      : navigate(path, { state: { museumId: chosenMuseum.museumId } });
  };

  return (
    <StyledCarouselItem onClick={handleClick}>
      <div className="p-1">
        <StyledCard className="h-full w-full border-2 border-dashed border-gray-500">
          <CardContent className="flex flex-col aspect-square items-center justify-center p-0 relative bg-gray-200">
            <AiOutlinePlus className="text-5xl text-gray-500"/>
            <StyledAddWrapper>{message} 추가하기</StyledAddWrapper>
          </CardContent>
        </StyledCard>
      </div>
    </StyledCarouselItem>
  );
};
const ContentCarousel = ({
                           name,
                           museumSelector,
                           itemInfo,
                           isAdmin = true,
                           isMuseum,
                           chosenMuseum,
                           isRecommend,
                         }) => {

    useEffect(() => {
        console.log(itemInfo);
    }, [itemInfo])
  return (
    <StyledFrame>
      <StyledHeaderFrame>
        <StyledHeader>{name}</StyledHeader>
        {museumSelector}
      </StyledHeaderFrame>
      <StyledCarousel opts={{ align: "start" }}>
        <StyledCarouselContent>
            <>{itemInfo.length === 0 ? <LoadingContainer>로딩 중...</LoadingContainer> : null}</>
          {itemInfo.map((item) => {
            const info = isMuseum
              ? {
                id: item.museumId,
                name: item.museumName,
                imgUrl: item.imgUrl,
                description: item.description,
              }
              : {
                id: item.artId,
                name: item.artName,
                imgUrl: item.imgUrl,
                description: item.artDescription,
              };
            return (
              <CarouselItemComponent
                key={info.id}
                isAdmin={isAdmin}
                imageSrc={info.imgUrl}
                title={info.name}
                description={info.description}
                isMuseum={isMuseum}
                id={info.id}
                chosenMuseum={chosenMuseum}
                isRecommend={isRecommend}
              />
            );
          })}
          {isAdmin && (
            <AddNewItemComponent
              isMuseum={isMuseum}
              chosenMuseum={chosenMuseum}
            />
          )}
        </StyledCarouselContent>
      </StyledCarousel>
    </StyledFrame>
  );
};
// 세로 슬라이드 컴포넌트 추가
const VerticalCarouselItemComponent = ({
                                         isAdmin,
                                         imageSrc,
                                         title,
                                         description,
                                         isMuseum,
                                         id,
                                         chosenMuseum,
                                         isRecommend = false,
                                         imgClassName, // 새로운 prop 추가
                                         isLink = true,
                                       }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/user/art/info/", { state: { artId: id } });
  };

  return (
    <StyledCarouselItem2
      onClick={(isLink) ? handleClick : null}
    >
      <div>
        <StyledCard>
          <CardContent>
            <StyledImageWrapper> {/* 이미지 크기 조정 */}
              {isAdmin && (
                <ListIcon
                  isMuseum={isMuseum}
                  id={id}
                  chosenMuseum={chosenMuseum}
                />
              )}
              <img
                src={imageSrc}
                alt={title}
                className={`${imgClassName}`}
              />
            </StyledImageWrapper>
          </CardContent>
        </StyledCard>
        <StyledTitle2>{title}</StyledTitle2>
        <StyledDescription2>
          {description &&
            (description.length > 50
              ? description.substring(0, 50) + "..."
              : description)}
        </StyledDescription2>
      </div>
    </StyledCarouselItem2>
  );
};

const VerticalContentCarousel = ({
                                   name,
                                   museumSelector,
                                   itemInfo,
                                   isAdmin = true,
                                   isMuseum,
                                   chosenMuseum,
                                   isRecommend,
                                   isLink,
                                 }) => {
  return (
    <StyledFrame>
      <StyledHeaderFrame>
        <StyledHeader2>{name}</StyledHeader2>
        {museumSelector}
      </StyledHeaderFrame>
      <Carousel opts={{ axis: "y", align: "start" }}>
        <CarouselContent className="flex flex-col">
          {itemInfo.map((item) => {
            const info = isMuseum
              ? {
                id: item.museumId,
                name: item.museumName,
                imgUrl: item.imgUrl,
                description: item.description,
              }
              : {
                id: item.artId,
                name: item.artName,
                imgUrl: item.imgUrl,
                description: item.artDescription,
              };
            return (
              <VerticalCarouselItemComponent
                key={info.id}
                isAdmin={isAdmin}
                imageSrc={info.imgUrl}
                title={info.name}
                description={info.description}
                isMuseum={isMuseum}
                id={info.id}
                chosenMuseum={chosenMuseum}
                isRecommend={isRecommend}
                imgClassName="h-48 w-full object-cover rounded-lg" // 이미지 크기 조정
              />
            );
          })}
          {isAdmin && (
            <AddNewItemComponent
              isMuseum={isMuseum}
              chosenMuseum={chosenMuseum}
            />
          )}
        </CarouselContent>
      </Carousel>
    </StyledFrame>
  );
};

export default ContentCarousel;
export { VerticalContentCarousel };