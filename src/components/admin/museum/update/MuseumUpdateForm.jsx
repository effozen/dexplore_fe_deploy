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
import { MuseumFormat, MuseumFormat_hp } from '@components/common/frame/data/FormMessage';
import { AiOutlinePaperClip, AiFillEnvironment } from 'react-icons/ai';
import { requestPost, requestGet } from '@lib/network/network';
import { useLocation, useNavigate } from 'react-router-dom';
import { KakaoMap, loadKakaoMap } from '@components/common/KakaoMap/KakaoMap';

const formSchema = z.object({
  museumName: z.string().min(1, { message: '값을 채워주세요' }),
  museumImg: z.any().refine((file) => file instanceof File, { message: '이미지 파일을 선택해주세요' }),
  museumLoc: z.string().min(1, { message: '위치를 지정해주세요' }),
  startTime: z.string().min(1, { message: '값을 채워주세요' }),
  endTime: z.string().min(1, { message: '값을 채워주세요' }),
  closingDay: z.string().min(1, { message: '값을 채워주세요' }),
  museumEmail: z.string().min(1, { message: '값을 채워주세요' }),
  phone: z.string().min(1, { message: '값을 채워주세요' }),
  entPrice: z.string().min(1, { message: '값을 채워주세요' }),
  description: z.string().min(1, { message: '값을 채워주세요' }),
});

const initialFormValues = {
  museumName: '',
  museumImg: null,
  museumLoc: '',
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

const MuseumUpdateForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loc, setLoc] = useState(initialFormValues);
  const [imageName, setImageName] = useState('');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [id, setId] = useState('');

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: initialFormValues,
  });

  useEffect(() => {
    loadKakaoMap();
    setId(location.state.id);
  }, [location.state.id]);

  useEffect(() => {
    if (id) {
      loadData(id);
    }
  }, [id]);

  const loadData = async (id) => {
    const response = await requestGet('https://dexplore.info/api/v1/user/get-museum', { museumId: id });
    const museum = response.museum;

    if (museum) {
      const updatedValues = {
        ...initialFormValues,
        ...museum,
      };
      form.reset(updatedValues);
    }
  };

  const handleSubmit = (values) => {
    const formData = new FormData();
    Object.keys(values).forEach((key) => {
      if (key === 'museumImg') {
        formData.append('imageFile', values[key]);
      } else {
        formData.append(key, loc[key] || values[key]);
      }
    });

    const { roadAddress, latitude, longitude, edgeLatitude1, edgeLongitude1, edgeLatitude2, edgeLongitude2, level } = loc;
    formData.append('museumLoc', roadAddress);
    formData.append('latitude', latitude);
    formData.append('longitude', longitude);
    formData.append('level', level);
    formData.append('edgeLatitude1', edgeLatitude1);
    formData.append('edgeLongitude1', edgeLongitude1);
    formData.append('edgeLatitude2', edgeLatitude2);
    formData.append('edgeLongitude2', edgeLongitude2);
    formData.append('museumId', id);

    requestPost('https://dexplore.info/api/v1/admin/update-museum', formData).then(() => {
      navigate('/admin/management');
    });
  };

  const renderField = (keyName, isTextArea = false) => (
    <Controller
      key={keyName}
      control={form.control}
      name={keyName}
      render={({ field }) => (
        <FormItem className="space-y-0 mb-[8px]">
          <FormLabel className="pl-[7px] text-gray-500 font-normal mb-0 pb-0">{MuseumFormat[keyName]}</FormLabel>
          <FormControl>
            {isTextArea ? (
              <Textarea placeholder={MuseumFormat_hp[`${keyName}_ph`]} {...field} className="rounded-none h-[200px]" />
            ) : (
              <Input placeholder={MuseumFormat_hp[`${keyName}_ph`]} {...field} className="rounded-none" />
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
    const { roadAddress, latitude, longitude, edgeLatitude1, edgeLongitude1, edgeLatitude2, edgeLongitude2, level } =
      loc;
    form.setValue('museumLoc', roadAddress);
    form.setValue('latitude', latitude);
    form.setValue('longitude', longitude);
    form.setValue('level', level);
    form.setValue('edgeLatitude1', edgeLatitude1);
    form.setValue('edgeLongitude1', edgeLongitude1);
    form.setValue('edgeLatitude2', edgeLatitude2);
    form.setValue('edgeLongitude2', edgeLongitude2);
    setDrawerOpen(false);
  };

  const handleCancleClick = () => {
    navigate(-1);
  };

  return (
    <ShadcnForm {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="mt-[10px] min-w-[350px] ml-[15px] mr-[15px]">
        {['museumName'].map((field) => renderField(field))}

        <Controller
          key="museumImg"
          control={form.control}
          name="museumImg"
          render={({ field }) => (
            <FormItem className="space-y-0 mb-[8px]">
              <FormLabel className="pl-[7px] text-gray-500 font-normal mb-0 pb-0">박물관 사진 첨부</FormLabel>
              <FormControl>
                <label htmlFor="image-file">
                  <div className="border-[1px] h-[40px] text-gray-500 font-normal text-sm flex justify-between items-center pl-[10px] pr-[10px] cursor-pointer hover:border-2 hover:border-black">
                    <div>{imageName || '기존 이미지에서 변경을 원할 경우 클릭해주세요.'}</div>
                    <div>
                      <AiOutlinePaperClip />
                    </div>
                  </div>
                  <input type="file" id="image-file" className="hidden" onChange={handleImageChange} />
                </label>
              </FormControl>
              <FormDescription />
              <FormMessage />
              {form.formState.errors.museumImg && (
                <p className="text-red-500 text-sm">{form.formState.errors.museumImg.message}</p>
              )}
            </FormItem>
          )}
        />

        <Controller
          key="museumLoc"
          control={form.control}
          name="museumLoc"
          render={({ field }) => (
            <FormItem className="space-y-0 mb-[8px]">
              <FormLabel className="pl-[7px] text-gray-500 font-normal mb-0 pb-0">박물관 위치 등록</FormLabel>
              <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
                <FormControl>
                  <DrawerTrigger className="border-[1px] min-w-[350px] w-full mr-[15px] h-[40px] text-gray-500 font-normal text-sm flex justify-between items-center pl-[10px] pr-[10px] cursor-pointer hover:border-2 hover:border-black">
                    <div>{loc.roadAddress || '기존 위치에서 변경을 원할 경우 클릭해주세요'}</div>
                    <div>
                      <AiFillEnvironment />
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
                    <DrawerClose className="w-full">
                      <Button variant="outline" className="w-full" onClick={() => setLoc({})}>
                        취소
                      </Button>
                    </DrawerClose>
                  </DrawerFooter>
                </DrawerContent>
              </Drawer>
              <FormDescription />
              <FormMessage />
              {form.formState.errors.museumLoc && (
                <p className="text-red-500 text-sm">{form.formState.errors.museumLoc.message}</p>
              )}
            </FormItem>
          )}
        />

        {Object.keys(MuseumFormat)
          .filter((v) => !['museumName', 'museumImg', 'museumLoc', 'description'].includes(v))
          .map((field) => renderField(field))}

        {renderField('description', true)}

        <div className="flex justify-around pl-[20px] pr-[20px] mt-[30px] mb-[30px]">
          <Button type="button" className="w-[84px] h-[40px] rounded-none bg-gray-500" onClick={handleCancleClick}>
            취소
          </Button>
          <Button type="submit" className="w-[84px] h-[40px] rounded-none">
            저장
          </Button>
        </div>
      </form>
    </ShadcnForm>
  );
};

export default MuseumUpdateForm;
