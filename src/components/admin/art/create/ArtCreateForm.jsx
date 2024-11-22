// ArtCreateForm.jsx
import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@components/common/shadcn/button';
import {
  Form as ShadcnForm,
  FormControl,
  FormDescription,
  FormItem,
  FormLabel,
  FormMessage,
} from '@components/common/shadcn/form';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@components/common/shadcn/drawer';
import { Input } from '@components/common/shadcn/input';
import { Textarea } from '@components/common/shadcn/textarea';
import { ArtFormat, ArtFormat_hp } from '@components/common/frame/data/FormMessage';
import { AiOutlinePaperClip, AiFillEnvironment } from 'react-icons/ai';
import { requestPost } from '@lib/network/network';
import { useNavigate, useLocation } from 'react-router-dom';
import { KakaoMap } from '@components/common/KakaoMap/KakaoMap';
import Modal from 'react-modal';
import QRCreator from '@components/common/qrCode/QRCreator';

const formSchema = z.object({
  artName: z.string().min(1, { message: '값을 채워주세요' }),
  artImg: z
    .any()
    .refine((file) => file instanceof File, { message: '이미지 파일을 선택해주세요' }),
  artYear: z.string().min(1, { message: '값을 채워주세요' }),
  authName: z.string().min(1, { message: '값을 채워주세요' }),
  artDescription: z.string().min(1, { message: '값을 채워주세요' }),
  // 위치 관련 필드 추가
  latitude: z.string(),
  longitude: z.string(),
  edgeLatitude1: z.string(),
  edgeLongitude1: z.string(),
  edgeLatitude2: z.string(),
  edgeLongitude2: z.string(),
  level: z.string(),
});

const initialFormValues = {
  artName: '',
  artImg: null,
  artYear: '',
  authName: '',
  artDescription: '',
  latitude: '',
  longitude: '',
  edgeLatitude1: '',
  edgeLongitude1: '',
  edgeLatitude2: '',
  edgeLongitude2: '',
  level: '',
};

const ArtCreateForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loc, setLoc] = useState({
    latitude: '',
    longitude: '',
    edgeLatitude1: '',
    edgeLongitude1: '',
    edgeLatitude2: '',
    edgeLongitude2: '',
    level: '',
  });
  const [imageName, setImageName] = useState('');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [museumId, setMuseumId] = useState();
  const [qrCodeHashKey, setQrCodeHashKey] = useState('');
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: initialFormValues,
  });

  useEffect(() => {
    setMuseumId(location.state?.museumId || '');
  }, [location.state]);

  // 접근성 설정
  useEffect(() => {
    Modal.setAppElement('#root'); // '#root'는 실제 앱의 루트 요소 ID로 변경 필요
  }, []);

  const handleSubmit = async (values) => {
    const formData = new FormData();

    // API에 맞게 필드 이름 매핑하여 추가
    formData.append('imageFile', values.artImg);
    formData.append('museumId', museumId);
    formData.append('artName', values.artName);
    formData.append('artDescription', values.artDescription);
    formData.append('artYear', values.artYear);
    formData.append('authName', values.authName);
    formData.append('latitude', values.latitude);
    formData.append('longitude', values.longitude);
    formData.append('level', values.level);
    formData.append('edgeLatitude1', values.edgeLatitude1);
    formData.append('edgeLongitude1', values.edgeLongitude1);
    formData.append('edgeLatitude2', values.edgeLatitude2);
    formData.append('edgeLongitude2', values.edgeLongitude2);

    try {
      const response = await requestPost('https://dexplore.info/api/v1/admin/save-art', formData);
      console.log('응답 데이터:', response);

      // 서버 응답에서 qrcodeId를 올바르게 추출
      const qrcodeId = response.data?.qrcodeId || response.qrcodeId;
      if (qrcodeId) {
        setQrCodeHashKey(qrcodeId);
        setModalIsOpen(true);
      } else {
        console.error('qrcodeId를 응답에서 찾을 수 없습니다.');
      }
    } catch (error) {
      console.error('작품 저장 실패:', error);
      // 필요에 따라 사용자에게 에러 메시지 표시
    }
  };

  const renderField = (keyName, isTextArea = false) => (
    <Controller
      key={keyName}
      control={form.control}
      name={keyName}
      render={({ field }) => (
        <FormItem className="space-y-0 mb-[8px]">
          <FormLabel className="pl-[7px] text-gray-500 font-normal mb-0 pb-0">
            {ArtFormat[keyName]}
          </FormLabel>
          <FormControl>
            {isTextArea ? (
              <Textarea
                placeholder={ArtFormat_hp[`${keyName}_ph`]}
                {...field}
                className="rounded-none h-[200px]"
              />
            ) : (
              <Input
                placeholder={ArtFormat_hp[`${keyName}_ph`]}
                {...field}
                className="rounded-none"
              />
            )}
          </FormControl>
          <FormDescription />
          <FormMessage />
          {form.formState.errors[keyName] && (
            <p className="text-red-500 text-sm">{form.formState.errors[keyName].message}</p>
          )}
        </FormItem>
      )}
    />
  );

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImageName(file.name);
      form.setValue('artImg', file);
    }
  };

  const handleConfirm = () => {
    const {
      latitude,
      longitude,
      edgeLatitude1,
      edgeLongitude1,
      edgeLatitude2,
      edgeLongitude2,
      level,
    } = loc;

    // 폼 필드에 위치 정보 설정
    form.setValue('latitude', latitude.toString());
    form.setValue('longitude', longitude.toString());
    form.setValue('level', level.toString());
    form.setValue('edgeLatitude1', edgeLatitude1.toString());
    form.setValue('edgeLongitude1', edgeLongitude1.toString());
    form.setValue('edgeLatitude2', edgeLatitude2.toString());
    form.setValue('edgeLongitude2', edgeLongitude2.toString());
    setDrawerOpen(false);
  };

  const handleCancelClick = () => {
    navigate(-1);
  };

  // 모달의 인라인 스타일 정의
  const customStyles = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
      padding: '20px',
      border: '1px solid #ccc',
      borderRadius: '4px',
      background: '#fff',
      // maxWidth: '500px',
      width: '300px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
    },
    overlay: {
      backgroundColor: 'rgba(0, 0, 0, 0.75)',
      zIndex: 1000,
    },
  };

  return (
    <ShadcnForm {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="mt-[10px] min-w-[350px] ml-[15px] mr-[15px]"
      >
        {/* 작품 이름 필드 */}
        {['artName'].map((field) => renderField(field))}

        {/* 작품 이미지 첨부 필드 */}
        <Controller
          key="artImg"
          control={form.control}
          name="artImg"
          render={({ field }) => (
            <FormItem className="space-y-0 mb-[8px]">
              <FormLabel className="pl-[7px] text-gray-500 font-normal mb-0 pb-0">
                작품 사진 첨부
              </FormLabel>
              <FormControl>
                <label htmlFor="image-file">
                  <div className="border-[1px] h-[40px] text-gray-500 font-normal text-sm flex justify-between items-center pl-[10px] pr-[10px] cursor-pointer hover:border-2 hover:border-black">
                    <div>{imageName || '클릭해서 이미지를 첨부하세요'}</div>
                    <div>
                      <AiOutlinePaperClip />
                    </div>
                  </div>
                  <input
                    type="file"
                    id="image-file"
                    className="hidden"
                    onChange={handleImageChange}
                  />
                </label>
              </FormControl>
              <FormDescription />
              <FormMessage />
              {form.formState.errors.artImg && (
                <p className="text-red-500 text-sm">{form.formState.errors.artImg.message}</p>
              )}
            </FormItem>
          )}
        />

        {/* 작품 위치 등록 필드 */}
        <FormItem className="space-y-0 mb-[8px]">
          <FormLabel className="pl-[7px] text-gray-500 font-normal mb-0 pb-0">
            작품 위치 등록
          </FormLabel>
          <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
            <FormControl>
              <DrawerTrigger asChild>
                <div className="border-[1px] min-w-[350px] w-full mr-[15px] h-[40px] text-gray-500 font-normal text-sm flex justify-between items-center pl-[10px] pr-[10px] cursor-pointer hover:border-2 hover:border-black">
                  {/* 위도와 경도를 표시 */}
                  <div>
                    {loc.latitude && loc.longitude
                      ? `위도: ${parseFloat(loc.latitude).toFixed(6)}, 경도: ${parseFloat(
                        loc.longitude
                      ).toFixed(6)}`
                      : '클릭해서 작품 위치를 등록하세요'}
                  </div>
                  <div>
                    <AiFillEnvironment />
                  </div>
                </div>
              </DrawerTrigger>
            </FormControl>
            <DrawerContent>
              <DrawerHeader>
                <DrawerTitle>작품 위치 찾기</DrawerTitle>
                <DrawerDescription>지도에서 작품 위치를 클릭해주세요</DrawerDescription>
              </DrawerHeader>
              <KakaoMap setLoc={setLoc} />
              <DrawerFooter>
                <Button className="w-full" onClick={handleConfirm}>
                  확인
                </Button>
                <DrawerClose asChild>
                  {/* 취소 시 loc을 초기화하지 않고 Drawer를 닫음 */}
                  <Button variant="outline" className="w-full">
                    취소
                  </Button>
                </DrawerClose>
              </DrawerFooter>
            </DrawerContent>
          </Drawer>
          <FormDescription />
          <FormMessage />
        </FormItem>

        {/* 기타 필드 렌더링 */}
        {Object.keys(ArtFormat)
          .filter((v) => !['artName', 'artImg', 'artLoc', 'artDescription'].includes(v))
          .map((field) => renderField(field))}

        {/* 작품 설명 필드 (Textarea) */}
        {renderField('artDescription', true)}

        {/* 제출 버튼 */}
        <div className="flex flex-col align-middle space-y-3 pl-[20px] pr-[20px] mt-[30px] mb-[30px]">
          <Button type="submit" className="min-w-[300px] h-[40px] rounded-none">
            저장하고 QR코드 발급 받기
          </Button>
          <Button
            type="button"
            className="min-w-[300px] h-[40px] rounded-none bg-gray-500"
            onClick={handleCancelClick}
          >
            취소
          </Button>
        </div>
      </form>

      {/* QR 코드 모달 */}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => {
          setModalIsOpen(false);
          navigate(-1); // 모달이 닫히면 이전 페이지로 이동
        }}
        contentLabel="QR Code Modal"
        style={customStyles} // 인라인 스타일 적용
      >
        <h2 className='text-2xl font-bold mb-3'>QR 코드</h2>
        {/* QR 코드 생성 컴포넌트 */}
        <QRCreator qrcodeHashkey={qrCodeHashKey} artName={form.getValues('artName')} />
        <Button
          onClick={() => {
            setModalIsOpen(false);
            navigate(-1); // 닫기 버튼 클릭 시 이전 페이지로 이동
          }}
        >
          닫기
        </Button>
      </Modal>
    </ShadcnForm>
  );
};

export default ArtCreateForm;
