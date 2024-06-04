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
import { KakaoMap, loadKakaoMap } from '@components/common/KakaoMap/KakaoMap';
import {artFormSchema as formSchema, artInitialFormValues as initialFormValues} from "@components/common/frame/data/FormSchema";

const ArtCreateForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loc, setLoc] = useState(initialFormValues);
  const [imageName, setImageName] = useState('');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [museumId, setMuseumId] = useState();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: initialFormValues,
  });

  useEffect(() => {
    loadKakaoMap();
    setMuseumId(location.state.museumId);
  }, []);

  const handleSubmit = (values) => {
    const formData = new FormData();
    Object.keys(values).forEach((key) => {
      if (key === 'artImg') {
        formData.append('imageFile', values[key]);
      } else {
        formData.append(key, loc[key] || values[key]);
      }
    });

    const { roadAddress, latitude, longitude, edgeLatitude1, edgeLongitude1, edgeLatitude2, edgeLongitude2, level } = loc;
    // formData.append('artLoc', roadAddress);
    formData.append('latitude', latitude);
    formData.append('longitude', longitude);
    formData.append('level', level);
    formData.append('edgeLatitude1', edgeLatitude1);
    formData.append('edgeLongitude1', edgeLongitude1);
    formData.append('edgeLatitude2', edgeLatitude2);
    formData.append('edgeLongitude2', edgeLongitude2);
    formData.append('museumId', museumId);

    requestPost('https://dexplore.info/api/v1/admin/save-art', formData).then(() => {
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
          <FormLabel className="pl-[7px] text-gray-500 font-normal mb-0 pb-0">{ArtFormat[keyName]}</FormLabel>
          <FormControl>
            {isTextArea ? (
              <Textarea placeholder={ArtFormat_hp[`${keyName}_ph`]} {...field} className="rounded-none h-[200px]" />
            ) : (
              <Input placeholder={ArtFormat_hp[`${keyName}_ph`]} {...field} className="rounded-none" />
            )}
          </FormControl>
          <FormDescription />
          <FormMessage />
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
    setDrawerOpen(false);
  };

  const handleCancleClick = () => {
    navigate(-1);
  }

  return (
    <ShadcnForm {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="mt-[10px] min-w-[350px] ml-[15px] mr-[15px]">
        {['artName'].map((field) => renderField(field))}

        <Controller
          key="artImg"
          control={form.control}
          name="artImg"
          render={({ field }) => (
            <FormItem className="space-y-0 mb-[8px]">
              <FormLabel className="pl-[7px] text-gray-500 font-normal mb-0 pb-0">작품 사진 첨부</FormLabel>
              <FormControl>
                <label htmlFor="image-file">
                  <div className="border-[1px] h-[40px] text-gray-500 font-normal text-sm flex justify-between items-center pl-[10px] pr-[10px] cursor-pointer hover:border-2 hover:border-black">
                    <div>{imageName || '클릭해서 이미지를 첨부하세요'}</div>
                    <div>
                      <AiOutlinePaperClip />
                    </div>
                  </div>
                  <input type="file" id="image-file" className="hidden" onChange={handleImageChange} />
                </label>
              </FormControl>
              <FormDescription />
              <FormMessage />
            </FormItem>
          )}
        />

        <Controller
          key="artLoc"
          control={form.control}
          name="artLoc"
          render={({ field }) => (
            <FormItem className="space-y-0 mb-[8px]">
              <FormLabel className="pl-[7px] text-gray-500 font-normal mb-0 pb-0">작품 위치 등록</FormLabel>
              <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
                <FormControl>
                  <DrawerTrigger className="border-[1px] min-w-[350px] w-full mr-[15px] h-[40px] text-gray-500 font-normal text-sm flex justify-between items-center pl-[10px] pr-[10px] cursor-pointer hover:border-2 hover:border-black">
                    <div>{loc.roadAddress || '클릭해서 작품 위치를 등록하세요'}</div>
                    <div>
                      <AiFillEnvironment />
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
            </FormItem>
          )}
        />

        {Object.keys(ArtFormat)
          .filter((v) => !['artName', 'artImg', 'artLoc', 'artDescription'].includes(v))
          .map((field) => renderField(field))}

        {renderField('artDescription', true)}

        <div className="flex flex-col align-middle space-y-3 pl-[20px] pr-[20px] mt-[30px] mb-[30px]">
          <Button type="submit" className="min-w-[300px] h-[40px] rounded-none">
            저장하고 QR코드 발급 받기
          </Button>
          <Button type="button" className="min-w-[300px] h-[40px] rounded-none bg-gray-500" onClick={handleCancleClick}>
            취소
          </Button>
        </div>
      </form>
    </ShadcnForm>
  );
};

export default ArtCreateForm;
