// ArtUpdateForm.jsx
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
import { requestGet, requestPost } from '@lib/network/network';
import { useNavigate, useLocation } from 'react-router-dom';
import { KakaoMap } from '@components/common/KakaoMap/KakaoMap';

const formSchema = z.object({
  artName: z.string().min(1, { message: '값을 채워주세요' }),
  artImg: z
    .any()
    .refine((file) => file instanceof File, { message: '이미지 파일을 선택해주세요' }),
  artYear: z.string().min(1, { message: '값을 채워주세요' }),
  authName: z.string().min(1, { message: '값을 채워주세요' }),
  artDescription: z.string().min(1, { message: '값을 채워주세요' }),
  // 위치 관련 필드 추가
  artLoc: z.string().min(1, { message: '위치를 지정해주세요' }),
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
  artLoc: '',
  latitude: '',
  longitude: '',
  edgeLatitude1: '',
  edgeLongitude1: '',
  edgeLatitude2: '',
  edgeLongitude2: '',
  level: '',
};

const ArtUpdateForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // loc 상태를 위치 관련 필드로 제한
  const [loc, setLoc] = useState({
    roadAddress: '',
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
  const [museumId, setMuseumId] = useState('');
  const [id, setId] = useState('');

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: initialFormValues,
  });

  // 폼 필드 값 모니터링 (디버깅 용도)
  const currentArtLoc = form.watch('artLoc');
  const currentLatitude = form.watch('latitude');
  const currentLongitude = form.watch('longitude');

  useEffect(() => {
    console.log('artLoc:', currentArtLoc);
    console.log('latitude:', currentLatitude);
    console.log('longitude:', currentLongitude);
  }, [currentArtLoc, currentLatitude, currentLongitude]);

  useEffect(() => {
    setMuseumId(location.state?.museumId || '');
    setId(location.state?.id || '');
  }, [location.state]);

  useEffect(() => {
    if (id) {
      loadData(id);
    }
  }, [id]);

  const loadData = async (id) => {
    try {
      const response = await requestGet('https://dexplore.info/api/v1/user/get-art', { artId: id });
      const art = response.art;

      if (art) {
        const updatedValues = {
          ...initialFormValues,
          artName: art.artName,
          artYear: art.artYear,
          authName: art.authName,
          artDescription: art.artDescription,
          artLoc: `위도: ${art.latitude}, 경도: ${art.longitude}`, // 위치 정보 설정
          latitude: art.latitude,
          longitude: art.longitude,
          edgeLatitude1: art.edgeLatitude1,
          edgeLongitude1: art.edgeLongitude1,
          edgeLatitude2: art.edgeLatitude2,
          edgeLongitude2: art.edgeLongitude2,
          level: art.level,
        };
        form.reset(updatedValues);

        // loc 상태도 업데이트
        setLoc({
          roadAddress: '', // 도로명 주소는 없으므로 빈 문자열로 설정
          latitude: art.latitude,
          longitude: art.longitude,
          edgeLatitude1: art.edgeLatitude1,
          edgeLongitude1: art.edgeLongitude1,
          edgeLatitude2: art.edgeLatitude2,
          edgeLongitude2: art.edgeLongitude2,
          level: art.level,
        });

        console.log('로드된 데이터:', updatedValues);
      }
    } catch (error) {
      console.error('데이터 로딩 실패:', error);
      // 필요에 따라 사용자에게 에러 메시지 표시
    }
  };

  const handleSubmit = (values) => {
    const formData = new FormData();
    Object.keys(values).forEach((key) => {
      if (key === 'artImg') {
        formData.append('imageFile', values[key]);
      } else {
        formData.append(key, values[key]);
      }
    });

    // 위치 관련 필드 추가
    const {
      latitude,
      longitude,
      edgeLatitude1,
      edgeLongitude1,
      edgeLatitude2,
      edgeLongitude2,
      level,
    } = loc;
    formData.append('latitude', latitude);
    formData.append('longitude', longitude);
    formData.append('level', level);
    formData.append('edgeLatitude1', edgeLatitude1);
    formData.append('edgeLongitude1', edgeLongitude1);
    formData.append('edgeLatitude2', edgeLatitude2);
    formData.append('edgeLongitude2', edgeLongitude2);
    formData.append('museumId', museumId);
    formData.append('artId', id);

    requestPost('https://dexplore.info/api/v1/admin/update-art', formData)
      .then(() => {
        navigate('/admin/management');
      })
      .catch((error) => {
        console.error('작품 업데이트 실패:', error);
        // 필요에 따라 사용자에게 에러 메시지 표시
      });
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

    // 위도와 경도를 사용하여 위치 정보를 표시
    const locationString = `위도: ${latitude.toFixed(6)}, 경도: ${longitude.toFixed(6)}`;

    // 폼 필드에 위치 정보 설정
    form.setValue('artLoc', locationString);
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
        <Controller
          key="artLoc"
          control={form.control}
          name="artLoc"
          render={({ field }) => (
            <FormItem className="space-y-0 mb-[8px]">
              <FormLabel className="pl-[7px] text-gray-500 font-normal mb-0 pb-0">
                작품 위치 등록
              </FormLabel>
              <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
                <FormControl>
                  <DrawerTrigger asChild>
                    <div className="border-[1px] min-w-[350px] w-full mr-[15px] h-[40px] text-gray-500 font-normal text-sm flex justify-between items-center pl-[10px] pr-[10px] cursor-pointer hover:border-2 hover:border-black">
                      {/* 위도와 경도를 표시 */}
                      <div>{field.value || '클릭해서 작품 위치를 등록하세요'}</div>
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
              {form.formState.errors.artLoc && (
                <p className="text-red-500 text-sm">{form.formState.errors.artLoc.message}</p>
              )}
            </FormItem>
          )}
        />

        {/* 기타 필드 렌더링 */}
        {Object.keys(ArtFormat)
          .filter((v) => !['artName', 'artImg', 'artLoc', 'artDescription'].includes(v))
          .map((field) => renderField(field))}

        {/* 작품 설명 필드 (Textarea) */}
        {renderField('artDescription', true)}

        {/* 제출 버튼 */}
        <div className="flex flex-col align-middle space-y-3 pl-[20px] pr-[20px] mt-[30px] mb-[30px]">
          <Button type="submit" className="min-w-[300px] h-[40px] rounded-none">
            저장
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
    </ShadcnForm>
  );
};

export default ArtUpdateForm;
