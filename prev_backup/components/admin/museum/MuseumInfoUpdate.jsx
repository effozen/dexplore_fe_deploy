import '../../frames/DataForm.scss'
import classNames from "classnames";
import Frame from "../../frames/Frame";
import Header from "../../frames/Header";
import Line from "../../frames/Line";
import {useState, useEffect} from "react";
import {useNavigate, useLocation} from "react-router-dom";
import axios from "axios";
import {useCookies} from "react-cookie";


const MuseumInfoUpdate = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { museumId } = location.state || {};
  const [cookies] = useCookies(['accessToken']);
  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    if (museumId) {
      // museumId를 사용하여 필요한 작업 수행
      console.log('Received museumId:', museumId);
    }
  }, [museumId]);

  useEffect(() => {
    getData();
  }, []);


  // Initial state for the form
  const [formData, setFormData] = useState({
    museumId:'',
    museumName: '',
    entPrice: '',
    startTime: '',
    endTime: '',
    closingDay: '',
    description: '',
    phone: '',
    museumEmail: '',
    latitude: '132.111',
    longitude: '32.111',
    level: '3',
    edgeLatitude1: '',
    edgeLongitude1: '',
    edgeLatitude2: '',
    edgeLongitude2: ''
  });

  // Handle change for form inputs
  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value
    });
  }

  // Handle file change
  const handleFileChange = (event) => {
    setImageFile(event.target.files[0]);
  }

  const getData = async () => {
    // 쿠키에서 accessToken을 가져옵니다.
    const token = cookies.accessToken;

    if (!token) {
      console.error('Access token is not available.');
      return;
    }

    // 요청에 Authorization 헤더를 설정합니다.
    const headers = {
      Authorization: `Bearer ${token}`
    };

    let params = {museumId};

    const result = await axios.get('https://dexplore.info/api/v1/admin/get-museum', {headers, params});

    let {...gettedData} = result.data.museum;

    setFormData(gettedData);
  };

  const requestData = async (dataObj) => {
    // 쿠키에서 accessToken을 가져옵니다.
    const token = cookies.accessToken;

    if (!token) {
      console.error('Access token is not available.');
      return;
    }

    // 요청에 Authorization 헤더를 설정합니다.
    const headers = {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'multipart/form-data'
    };

    const formData = new FormData();
    Object.keys(dataObj).forEach(key => {
      formData.append(key, dataObj[key]);
    });

    if (imageFile) {
      formData.append('imageFile', imageFile);
    }

    try {
      const result = await axios.post('https://dexplore.info/api/v1/admin/update-museum', formData, {headers});
      console.log(result.data);
    } catch (error) {
      console.error('Error communicating with the server:', error);
    }
  };

  const deleteMuseum = async () => {
    // 쿠키에서 accessToken을 가져옵니다.
    const token = cookies.accessToken;

    if (!token) {
      console.error('Access token is not available.');
      return;
    }

    // 요청에 Authorization 헤더를 설정합니다.
    const headers = {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    };

    const requestBody = { museumId };

    console.log(requestBody);

    try {
      const result = await axios.post('https://dexplore.info/api/v1/admin/delete-museum', JSON.stringify(requestBody), { headers });
      console.log(result.data);
      navigate('/admin');
    } catch (error) {
      console.error('Error communicating with the server:', error);
    }
  };



  // Get current location
  const handleGetCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setFormData({
            ...formData,
            latitude: latitude.toString(),
            longitude: longitude.toString()
          });
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
  }


  // Handle form submit
  const handleSubmit = (event) => {
    event.preventDefault();
    let confirmed = window.confirm("수정하시겠습니까?");
    if (confirmed) {
      // Process formData here
      requestData(formData);
      navigate('/admin');
    }
  }

  const handleDelete = (event) => {
    event.preventDefault();
    let confirmed = window.confirm("삭제하시겠습니까?");
    if (confirmed) {
      // Process formData here
      deleteMuseum(formData);
    }
  }

  return (
    <Frame>
      <Header>
        정보 입력
      </Header>
      <Line/>
      <form method="post" encType="multipart/form-data" className={classNames('flex-box-column')}
            onSubmit={handleSubmit}>
        <label htmlFor="image-file">
          <div className={classNames('form-input-button')}>박물관 사진 첨부</div>
        </label>
        <input type="file" name="imageFile" id="image-file" onChange={handleFileChange}/>
        <button type="button" className={classNames('form-input-button-location')} onClick={handleGetCurrentLocation}>
          위치 정보 확인
        </button>
        <input type="text" name="museumName" value={formData.museumName} placeholder="박물관 명 (한글)"
               className={classNames('form-input-text')} onChange={handleChange}/>
        <input type="text" name="startTime" value={formData.startTime} placeholder='개장시간'
               className={classNames('form-input-text')} onChange={handleChange}/>
        <input type="text" name="endTime" value={formData.endTime} placeholder='폐장시간'
               className={classNames('form-input-text')} onChange={handleChange}/>
        <input type="text" name="closingDay" value={formData.closingDay} placeholder='휴관일'
               className={classNames('form-input-text')} onChange={handleChange}/>
        <input type="text" name="museumEmail" value={formData.museumEmail} placeholder='박물관 이메일'
               className={classNames('form-input-text')} onChange={handleChange}/>
        <input type="text" name="phone" value={formData.phone} placeholder='박물관 전화번호'
               className={classNames('form-input-text')} onChange={handleChange}/>
        <input type="text" name="entPrice" value={formData.entPrice} placeholder='관람료'
               className={classNames('form-input-text')} onChange={handleChange}/>
        <textarea name="description" value={formData.description} placeholder='박물관 설명'
                  className={classNames('form-input-text-box')} onChange={handleChange}/>
        <div className={classNames('flex-content-around')}>
          <button type="submit" className={classNames('form-input-submit')}>저장하기</button>
          <button type="button" className={classNames('form-input-submit')} onClick={handleDelete}>삭제하기</button>
        </div>
      </form>
    </Frame>
  );
}

export default MuseumInfoUpdate;