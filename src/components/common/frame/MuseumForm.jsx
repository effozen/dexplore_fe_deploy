import React, {useEffect} from 'react';
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {z} from "zod";
import {Button} from "@components/common/shadcn/button";
import {
  Form as ShadcnForm,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@components/common/shadcn/form";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@components/common/shadcn/drawer";
import {Input} from "@components/common/shadcn/input";
import {Textarea} from "@components/common/shadcn/textarea";
import {MuseumFormat, MuseumFormat_hp} from "@components/common/frame/data/FormMessage";
import {AiOutlinePaperClip, AiFillEnvironment} from "react-icons/ai";
import {requestPost, requestGet} from "@lib/network/network";
import {useNavigate} from "react-router-dom";
import {loadKakaoMap, KakaoMap} from "@components/common/KakaoMap/KakaoMap";

const formSchema = z.object({
  museumName: z.string().min(1, {message: '값을 채워주세요'}),
  museumImg: z.any().refine(file => file instanceof File, {message: '이미지 파일을 선택해주세요'}),
  museumLoc: z.string().min(1, {message: '위치를 지정해주세요'}),
  startTime: z.string().min(1, {message: '값을 채워주세요'}),
  endTime: z.string().min(1, {message: '값을 채워주세요'}),
  closingDay: z.string().min(1, {message: '값을 채워주세요'}),
  museumEmail: z.string().min(1, {message: '값을 채워주세요'}),
  phone: z.string().min(1, {message: '값을 채워주세요'}),
  entPrice: z.string().min(1, {message: '값을 채워주세요'}),
  description: z.string().min(1, {message: '값을 채워주세요'}),
});


const MuseumForm = () => {
  const navigate = useNavigate();

  useEffect(() => {
    loadKakaoMap();
  }, []);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      museumName: "",
      museumImg: null,
      museumLoc: "",
      startTime: "",
      endTime: "",
      closingDay: "",
      museumEmail: "",
      phone: "",
      entPrice: "",
      description: "",
    },
  });

  const handleSubmit = (values) => {
    const formData = new FormData();
    formData.append('museumName', values.museumName);
    formData.append('imageFile', values.museumImg);
    formData.append('museumLoc', values.museumLoc);
    formData.append('startTime', values.startTime);
    formData.append('endTime', values.endTime);
    formData.append('closingDay', values.closingDay);
    formData.append('museumEmail', values.museumEmail);
    formData.append('phone', values.phone);
    formData.append('entPrice', values.entPrice);
    formData.append('description', values.description);

    requestPost('https://dexplore.info/api/v1/admin/save-museum', formData).then(v => {
      console.log(v);
    });
  };

  const renderField = (keyName) => (
    <FormField
      key={keyName}
      control={form.control}
      name={keyName}
      render={({field}) => (
        <FormItem className="space-y-0 mb-[8px]">
          <FormLabel className="pl-[7px] text-gray-500 font-normal mb-0 pb-0">{MuseumFormat[keyName]}</FormLabel>
          <FormControl>
            <Input placeholder={MuseumFormat_hp[`${keyName}_ph`]} {...field} className="rounded-none"/>
          </FormControl>
          <FormDescription/>
          <FormMessage/>
        </FormItem>
      )}
    />
  );

  const handleLocClick = () => {

  };

  return (
    <ShadcnForm {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="mt-[10px] w-[350px] ml-[15px]">
        {Object.keys(MuseumFormat).filter(v => {
          if (v === 'museumName') return true;
          return false;
        }).map(renderField)}

        <FormField
          key="museumImg"
          control={form.control}
          name="museumImg"
          render={({field}) => (
            <FormItem className="space-y-0 mb-[8px]">
              <FormLabel className="pl-[7px] text-gray-500 font-normal mb-0 pb-0">박물관 사진 첨부</FormLabel>
              <FormControl>
                <label htmlFor="image-file">
                  <div
                    className="border-[1px] h-[40px] text-gray-500 font-normal text-sm flex justify-between items-center pl-[10px] pr-[10px] cursor-pointer hover:border-2 hover:border-black">
                    <div>클릭해서 이미지를 첨부하세요</div>
                    <div><AiOutlinePaperClip/></div>
                  </div>
                  <input type="file" name="imageFile" id="image-file" className="hidden"/>
                </label>
              </FormControl>
              <FormDescription/>
              <FormMessage/>
            </FormItem>
          )}
        />
        <FormField
          key="museumLoc"
          control={form.control}
          name="museumLoc"
          render={({field}) => (
            <FormItem className="space-y-0 mb-[8px]">
              <FormLabel className="pl-[7px] text-gray-500 font-normal mb-0 pb-0">박물관 위치 등록</FormLabel>
              <Drawer>
                <FormControl>
                  <DrawerTrigger
                    className="border-[1px] w-[350px] h-[40px] text-gray-500 font-normal text-sm flex justify-between items-center pl-[10px] pr-[10px] cursor-pointer hover:border-2 hover:border-black">
                    <div>클릭해서 박물관 위치를 등록하세요</div>
                    <div><AiFillEnvironment/></div>
                  </DrawerTrigger>
                </FormControl>
                <DrawerContent>
                  <DrawerHeader>
                    <DrawerTitle>박물관 위치 찾기</DrawerTitle>
                    <DrawerDescription>지도에서 박물관 위치를 클릭해주세요</DrawerDescription>
                  </DrawerHeader>
                  <KakaoMap />
                  <DrawerFooter>
                    <Button>확인</Button>
                    <DrawerClose>
                      <Button variant="outline" className='w-full'>취소</Button>
                    </DrawerClose>
                  </DrawerFooter>
                </DrawerContent>
              </Drawer>
              <FormDescription/>
              <FormMessage/>
            </FormItem>
          )}
        />
        {Object.keys(MuseumFormat).filter(v => {
          if (v === 'museumName' || v === 'museumImg' || v === 'museumLoc' || v === 'description') return false;
          return true;
        }).map(renderField)}
        <FormField
          key="description"
          control={form.control}
          name="description"
          render={({field}) => (
            <FormItem className="space-y-0 mb-[8px]">
              <FormLabel className="pl-[7px] text-gray-500 font-normal mb-0 pb-0">박물관 설명</FormLabel>
              <FormControl>
                <Textarea placeholder="박물관에 관한 정보를 입력하세요" {...field} className="rounded-none h-[200px]"/>
              </FormControl>
              <FormDescription/>
              <FormMessage/>
            </FormItem>
          )}
        />
        <div className="flex justify-around pl-[20px] pr-[20px] mt-[30px] mb-[30px]">
          <Button type="button" className="w-[84px] h-[40px] rounded-none bg-gray-500">취소</Button>
          <Button type="submit" className="w-[84px] h-[40px] rounded-none">저장</Button>
        </div>
      </form>
    </ShadcnForm>
  );
};

export default MuseumForm;
