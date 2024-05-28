import '../../frames/DataForm.scss';
import classNames from "classnames";
import Frame from "../../frames/Frame";
import Header from "../../frames/Header";
import Line from "../../frames/Line";
import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useCookies } from "react-cookie";

const AdminArtCreate = () => {
  const [cookies] = useCookies(['accessToken']);
  const location = useLocation();
  const { museumId } = location.state || {};
  const [imageFile, setImageFile] = useState(null);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    museumId: museumId,
    artName: '',
    artDescription: '',
    artYear: '',
    authName: '',
    latitude: '37.123456',
    longitude: '-122.123456',
    level: "3",
    edgeLatitude1: "37.123",
    edgeLongitude1: "-122.123",
    edgeLatitude2: "37.456",
    edgeLongitude2: "-122.456",
  });

  useEffect(() => {
    if (museumId) {
      // museumId를 사용하여 필요한 작업 수행
      console.log('Received museumId:', museumId);
    }
  }, [museumId]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleFileChange = (event) => {
    setImageFile(event.target.files[0]);
  };

  const requestData = async (dataObj) => {
    const token = cookies.accessToken;

    if (!token) {
      console.error('Access token is not available.');
      return;
    }

    const headers = {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'multipart/form-data'
    };

    const formDataToSend = new FormData();
    Object.keys(dataObj).forEach(key => {
      formDataToSend.append(key, dataObj[key]);
    });
    // console.log(formDataToSend);

    if (imageFile) {
      formDataToSend.append('imageFile', imageFile);
    }

    try {
      // console.log(formDataToSend);
      const result = await axios.post('https://dexplore.info/api/v1/admin/save-art', formDataToSend, { headers });
      console.log(result.data);
      navigate('/admin/art', { state: { museumId }});
    } catch (error) {
      console.error('Error communicating with the server:', error);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const confirmed = window.confirm("저장하시겠습니까?");
    if (confirmed) {
      requestData(formData);
    }
  };

  const handleGetCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setFormData((prevState) => ({
            ...prevState,
            latitude: latitude.toString(),
            longitude: longitude.toString()
          }));
          alert(`현재 위치가 설정되었습니다: (${latitude}, ${longitude})`);
        },
        (error) => {
          console.error('Error getting current location:', error);
          alert('현재 위치를 가져오는 데 실패했습니다.');
        }
      );
    } else {
      alert('현재 위치를 지원하지 않는 브라우저입니다.');
    }
  };

  return (
    <Frame>
      <Header>
        정보 입력
      </Header>
      <Line />
      <form method="post" encType="multipart/form-data" className={classNames('flex-box-column')} onSubmit={handleSubmit}>
        <label htmlFor="image-file">
          <div className={classNames('form-input-button')}>작품 사진 첨부</div>
        </label>
        <input type="file" name="imageFile" id="image-file" onChange={handleFileChange} />
        <button type="button" className={classNames('form-input-button-location')} onClick={handleGetCurrentLocation}>
          위치 정보 확인
        </button>
        <input type="text" name="artName" value={formData.artName} placeholder="작품 명"
               className={classNames('form-input-text')} onChange={handleChange} />
        <input type="text" name="artYear" value={formData.artYear} placeholder="작품 연도"
               className={classNames('form-input-text')} onChange={handleChange} />
        <input type="text" name="authName" value={formData.authName} placeholder="작가 명"
               className={classNames('form-input-text')} onChange={handleChange} />
        <textarea name="artDescription" value={formData.artDescription} placeholder='작품 설명'
                  className={classNames('form-input-text-box')} onChange={handleChange} />
        <button type="submit" className={classNames('form-input-submit')}>저장하기</button>
      </form>
    </Frame>
  );
};

export default AdminArtCreate;
