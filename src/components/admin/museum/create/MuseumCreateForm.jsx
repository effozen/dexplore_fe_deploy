// MuseumCreateForm.jsx
import React, { useState } from 'react';
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
import { MuseumFormat, MuseumFormat_hp } from '@components/common/frame/data/FormMessage';
import { AiOutlinePaperClip, AiFillEnvironment } from 'react-icons/ai';
import { requestPost } from '@lib/network/network';
import { useNavigate } from 'react-router-dom';
import { KakaoMap } from '@components/common/KakaoMap/KakaoMap';

const formSchema = z.object({
  museumName: z.string().min(1, { message: '값을 채워주세요' }),
  museumImg: z
    .any()
    .refine((file) => file instanceof File, { message: '이미지 파일을 선택해주세요' }),
  startTime: z.string().min(1, { message: '값을 채워주세요' }),
  endTime: z.string().min(1, { message: '값을 채워주세요' }),
  closingDay: z.string().min(1, { message: '값을 채워주세요' }),
  museumEmail: z.string().min(1, { message: '값을 채워주세요' }),
  phone: z.string().min(1, { message: '값을 채워주세요' }),
  entPrice: z.string().min(1, { message: '값을 채워주세요' }),
  description: z.string().optional(),
  latitude: z.string().min(1, { message: '위치를 선택해주세요' }),
  longitude: z.string().min(1, { message: '위치를 선택해주세요' }),
  edgeLatitude1: z.string().optional(),
  edgeLongitude1: z.string().optional(),
  edgeLatitude2: z.string().optional(),
  edgeLongitude2: z.string().optional(),
  level: z.string().min(1, { message: '값을 채워주세요' }),
});

const initialFormValues = {
  museumName: '',
  museumImg: null,
  startTime: '',
  endTime: '',
  closingDay: '',
  museumEmail: '',
  phone: '',
  entPrice: '',
  description: '',
  latitude: '',
  longitude: '',
  edgeLatitude1: '',
  edgeLongitude1: '',
  edgeLatitude2: '',
  edgeLongitude2: '',
  level: '',
};

const MuseumCreateForm = () => {
  const navigate = useNavigate();
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

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: initialFormValues,
  });

  const handleSubmit = async (values) => {
    const formData = new FormData();

    // Append required fields
    formData.append('imageFile', values.museumImg);
    formData.append('museumName', values.museumName);
    formData.append('entPrice', values.entPrice);
    formData.append('museumEmail', values.museumEmail);
    formData.append('startTime', values.startTime);
    formData.append('endTime', values.endTime);
    formData.append('closingDay', values.closingDay);
    formData.append('phone', values.phone);
    formData.append('latitude', values.latitude);
    formData.append('longitude', values.longitude);
    formData.append('level', values.level);

    // Append optional fields only if they have values
    if (values.description) {
      formData.append('description', values.description);
    }
    if (values.edgeLatitude1) {
      formData.append('edgeLatitude1', values.edgeLatitude1);
    }
    if (values.edgeLongitude1) {
      formData.append('edgeLongitude1', values.edgeLongitude1);
    }
    if (values.edgeLatitude2) {
      formData.append('edgeLatitude2', values.edgeLatitude2);
    }
    if (values.edgeLongitude2) {
      formData.append('edgeLongitude2', values.edgeLongitude2);
    }

    try {
      await requestPost('https://dexplore.info/api/v1/admin/save-museum', formData);
      navigate('/admin/management');
    } catch (error) {
      if (error.response && error.response.data) {
        console.error('Server Error:', error.response.data);
        alert(`박물관 등록에 실패했습니다: ${error.response.data.message || '알 수 없는 오류'}`);
      } else {
        console.error('Network Error:', error);
        alert('박물관 등록에 실패했습니다. 네트워크 상태를 확인해주세요.');
      }
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
            {MuseumFormat[keyName]}
          </FormLabel>
          <FormControl>
            {isTextArea ? (
              <Textarea
                placeholder={MuseumFormat_hp[`${keyName}_ph`]}
                {...field}
                className="rounded-none h-[200px]"
              />
            ) : (
              <Input
                placeholder={MuseumFormat_hp[`${keyName}_ph`]}
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
      form.setValue('museumImg', file);
    }
  };

  const handleConfirm = () => {
    const {
      roadAddress,
      latitude,
      longitude,
      edgeLatitude1,
      edgeLongitude1,
      edgeLatitude2,
      edgeLongitude2,
      level,
    } = loc;
    if (!roadAddress) {
      alert('유효한 위치를 선택해주세요.');
      return;
    }
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

  return (
    <ShadcnForm {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="mt-[10px] min-w-[350px] ml-[15px] mr-[15px]"
      >
        {/* 박물관 이름 필드 */}
        {['museumName'].map((field) => renderField(field))}

        {/* 박물관 이미지 첨부 필드 */}
        <Controller
          key="museumImg"
          control={form.control}
          name="museumImg"
          render={({ field }) => (
            <FormItem className="space-y-0 mb-[8px]">
              <FormLabel className="pl-[7px] text-gray-500 font-normal mb-0 pb-0">
                박물관 사진 첨부
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
              {form.formState.errors.museumImg && (
                <p className="text-red-500 text-sm">
                  {form.formState.errors.museumImg.message}
                </p>
              )}
            </FormItem>
          )}
        />

        {/* 박물관 위치 등록 필드 */}
        <FormItem className="space-y-0 mb-[8px]">
          <FormLabel className="pl-[7px] text-gray-500 font-normal mb-0 pb-0">
            박물관 위치 등록
          </FormLabel>
          <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
            <FormControl>
              <DrawerTrigger asChild>
                <div className="border-[1px] min-w-[350px] w-full mr-[15px] h-[40px] text-gray-500 font-normal text-sm flex justify-between items-center pl-[10px] pr-[10px] cursor-pointer hover:border-2 hover:border-black">
                  <div>{loc.roadAddress || '클릭해서 박물관 위치를 등록하세요'}</div>
                  <div>
                    <AiFillEnvironment />
                  </div>
                </div>
              </DrawerTrigger>
            </FormControl>
            <DrawerContent>
              <DrawerHeader>
                <DrawerTitle>박물관 위치 찾기</DrawerTitle>
                <DrawerDescription>지도에서 박물관 위치를 클릭해주세요</DrawerDescription>
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
          {form.formState.errors.latitude && (
            <p className="text-red-500 text-sm">
              {form.formState.errors.latitude.message}
            </p>
          )}
        </FormItem>

        {/* 기타 필드 렌더링 */}
        {Object.keys(MuseumFormat)
          .filter(
            (v) =>
              !['museumName', 'museumImg', 'museumLoc', 'description'].includes(v)
          )
          .map((field) => renderField(field))}

        {/* 설명 필드 (Textarea) */}
        {renderField('description', true)}

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

export default MuseumCreateForm;
