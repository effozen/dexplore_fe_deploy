import '../../frames/DataForm.scss';
import classNames from "classnames";
import Frame from "../../frames/Frame";
import Header from "../../frames/Header";
import Line from "../../frames/Line";
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useCookies } from "react-cookie";
import QRCreator from "../../user/qrCode/QRCreator";

const AdminArtUpdate = () => {
  const [cookies] = useCookies(['accessToken']);
  const location = useLocation();
  const { artId, museumId } = location.state || {};
  const [imageFile, setImageFile] = useState(null);
  const navigate = useNavigate();
  const [qrcodeHash, setQrcodeHash] = useState('');

  const [formData, setFormData] = useState({
    artId: artId || '',
    artName: '',
    artDescription: '',
    artYear: '',
    authName: '',
    qrcodeId: '',
    latitude: '37.123456',
    longitude: '-122.123456',
    level: "3",
    edgeLatitude1: "37.123",
    edgeLongitude1: "-122.123",
    edgeLatitude2: "37.456",
    edgeLongitude2: "-122.456",
  });

  useEffect(() => {
    const fetchData = async () => {
      const data = await getData();
      if (data && data.qrcodeId) {
        await getQRHash(data.qrcodeId);
      }
    };
    fetchData();
  }, []);

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

  const getData = async () => {
    const token = cookies.accessToken;

    if (!token) {
      console.error('Access token is not available.');
      return;
    }

    const headers = {
      Authorization: `Bearer ${token}`
    };

    let params = { artId };

    try {
      const result = await axios.get('https://dexplore.info/api/v1/user/get-art', { headers, params });
      console.log(result);

      let { ...gettedData } = result.data.art;

      setFormData((prevState) => ({
        ...prevState,
        ...gettedData
      }));
      return gettedData;
    } catch (error) {
      console.error('Error fetching art data:', error);
      return null;
    }
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

    if (imageFile) {
      formDataToSend.append('imageFile', imageFile);
    }

    try {
      const result = await axios.post('https://dexplore.info/api/v1/admin/update-art', formDataToSend, { headers });
      console.log(result.data);
    } catch (error) {
      console.error('Error communicating with the server:', error);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const confirmed = window.confirm("수정하시겠습니까?");
    if (confirmed) {
      requestData(formData);
      navigate('/admin/art', { state: { museumId }});
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

  const getQRHash = async (qrId) => {
    const token = cookies.accessToken;

    if (!token) {
      console.error('Access token is not available.');
      return;
    }

    const headers = {
      Authorization: `Bearer ${token}`
    };

    let params = { qrcodeId: qrId };
    console.log(params);

    try {
      const result = await axios.get('https://dexplore.info/api/v1/user/get-qrcode', { headers, params });
      console.log('QR result:', result);

      const qrHash = result.data.qrcode.qrcodeHashkey;
      console.log(qrHash);
      setQrcodeHash(qrHash);
    } catch (error) {
      console.error('Error fetching QR code hash:', error);
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
        {qrcodeHash && <QRCreator qrcodeHashkey={qrcodeHash} artName={formData.artName}></QRCreator>}
        <div className={classNames('margin-topBottom-7')}></div>
        <button type="submit" className={classNames('form-input-submit')}>수정하기</button>
      </form>
    </Frame>
  );
};

export default AdminArtUpdate;
