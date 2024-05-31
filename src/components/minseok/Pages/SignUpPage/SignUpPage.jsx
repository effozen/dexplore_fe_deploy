import styled from "styled-components";
import background from "@assets/images/museum_BW6.jpg";
import InputBox from "@components/minseok/components/InputBox";
import {useEffect, useState} from "react";
import InputBoxWithBtn from "@components/minseok/components/InputBoxWithBtn";
import axios from "axios";
import {useNavigate} from "react-router-dom";


const FullScreenWrapper = styled.div`
  width: 100vw;
  height: 100vh;
  background-image: linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.0)), url('${background}');
  background-size: cover;
  background-position: center;
  text-align: center;
  display: block;
`;

const DexploreTitle = styled.h1`
  font-size: 38px;
  color: #FFFFFF;
  text-align: center;
  padding:45px;
  font-weight: 900;
`

const InputWrapper = styled.div`
  display: block;
`

const CheckBoxWrapper = styled.div`
  margin: auto auto 10px auto;
  display: block;
  width:300px;
  text-align: left;
  align-items: center; /* 수직 가운데 정렬 */
`

const StyledCheckbox = styled.input.attrs({ type: 'checkbox' })`
  width: 18px;
  height: 18px;
  position: relative;
  margin-left: 10px;
  top: 4px;
`;

const Label = styled.label`
  font-size: 14px;
  color: #FFFFFF;
`;
const StyledButton = styled.button`
  background-color: ${ props => (props.$avail ? 'rgba(0,0,0,1)' : 'rgba(0,0,0,80%)')};
  color: ${ props => (props.$avail ? 'rgba(255,255,255,1)' : 'rgba(155,155,155,50%)')};
  width: 300px;
  height: 43px;
  margin: auto;
  font-size: 15px;
  font-weight: 500;
  &:hover {
    background-color: ${ props => (props.$avail ? '#252525' : '')};
    cursor: ${ props => (props.$avail ? 'pointer' : 'not-allowed')};;
  }
`;

const WelcomePage = () => {

    const [id, setId] = useState('');
    const [idMessage, setIdMessage] = useState('');
    const [idWarn, setIdWarn] = useState(false);
    const [isIdPass, setIsIdPass] = useState(false);

    const [password, setPassword] = useState('');
    const [passwordMessage, setPasswordMessage] = useState('');
    const [passwordWarn, setPasswordWarn] = useState(false);
    const [isPasswordPass, setIsPasswordPass] = useState(false);
    const passwordPattern = /^(?=.*[a-zA-Z])(?=.*[0-9])[a-zA-Z0-9]{8,13}$/;

    const [passwordCheck, setPasswordCheck] = useState('');
    const [passwordCheckMessage, setPasswordCheckMessage] = useState('');
    const [passwordCheckWarn, setPasswordCheckWarn] = useState(false);

    const [email, setEmail] = useState('');
    const [emailMessage, setEmailMessage] = useState('');
    const [emailWarn, setEmailWarn] = useState(false);
    const [isEmailPass, setIsEmailPass] = useState(false);
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    const [cert, setCert] = useState('');
    const [certMessage, setCertMessage] = useState('');
    const [certWarn, setCertWarn] = useState(false);
    const [isCertPass, setIsCertPass] = useState(false);

    const [checked, setChecked] = useState(false);

    const [btnAvailable, setBtnAvailable] = useState(false);

    const navigate = useNavigate();

    const onIdChangeHandler = (event) => {
        const {value} = event.target;
        setIsIdPass(false);
        // 4~20 사이 값인지 검사
        if (value.length >= 4 && value.length <= 20) {
            setIdWarn(false);
            setIdMessage('');
        } else {
            setIdWarn(true);
            setIdMessage('아이디는 4~20자여야 합니다.');
        }
        setId(value);
    };

    const onPasswordChangeHandler = (event) => {
        const { value } = event.target;
        setIsPasswordPass(false);
        // 정규식 검사
        if (passwordPattern.test(value)) {
            setPasswordWarn(false);
            setPasswordMessage('유효한 값입니다.');
        } else {
            setPasswordWarn(true);
            setPasswordMessage('비밀번호는 알파벳, 숫자를 조합하여 8~13자여야 합니다.');
        }
        // 비밀번호 확인 검사
        if (passwordCheck && value === passwordCheck) {
            setPasswordCheckWarn(false);
            setPasswordCheckMessage('유효한 값입니다.');
            setIsPasswordPass(true);
        } else {
            setPasswordCheckWarn(true);
            setPasswordCheckMessage('비밀번호가 일치하지 않습니다.');
        }
        setPassword(value);
    };

    const onPasswordCheckChangeHandler = (event) => {
        const { value } = event.target;
        setIsPasswordPass(false);
        // 비밀번호 확인 검사
        if (password && value === password) {
            setPasswordCheckWarn(false);
            setPasswordCheckMessage('유효한 값입니다.');
            setIsPasswordPass(true);
        } else {
            setPasswordCheckWarn(true);
            setPasswordCheckMessage('비밀번호가 일치하지 않습니다.');
        }
        setPasswordCheck(value);
    };

    const onEmailChangeHandler = (event) => {
        const {value} = event.target;
        setIsEmailPass(false);
        if(emailPattern.test(value)) {
            setEmailWarn(false);
            setEmailMessage('유효한 값입니다.');
            setIsEmailPass(true);
        } else {
            setEmailWarn(true);
            setEmailMessage('올바른 이메일 형식을 입력하세요.');
        }
        setEmail(value);
    }

    const onCertChangeHandler = (event) => {
        const {value} = event.target;
        setIsCertPass(false);
        if(value.length === 6) {
            setCertWarn(false);
            setCertMessage('')
        } else {
            setCertWarn(true);
            setCertMessage('인증번호는 6자리입니다.');
        }
        setCert(value);
    }

    const checkBoxChangeHandler = () => {
        setChecked(!checked);
    }

    const signUpBtnHandler = () => {
        if(btnAvailable) {
            handleSignUp()
                .then(response => {
                    const {code, message} = response.data;
                    console.log(code);
                    console.log(message);
                    navigate("/auth/sign-in")
                })
                .catch(error => {
                    console.log(error);
                    alert("회원가입 중 오류가 발생했습니다. 다시 시도해 주세요.");
                });
        }
    }

    // 중복 확인 API 호출
    const handleCheckId = async () => {
        try {
            // 아이디 중복 확인 API 호출
            const response = await axios.post('https://dexplore.info/api/v1/auth/id-check', {
                id: id
            });
            setIdMessage('이 아이디를 사용할 수 있습니다.');
            setIsIdPass(true);

        } catch (error) {
            setIsIdPass(false);
            // 상태 코드 확인하여 처리
            if (error.response) {
                const { code, message } = error.response.data;
                console.error('Error Response Code:', code);
                console.error('Error Response Message:', message);
                if (code && code === 'DI') {
                    setIdWarn(true);
                    setIdMessage('이 아이디는 이미 사용중 입니다.');
                } else if (code && code === 'VF') {
                    setIdWarn(true);
                    setIdMessage('아이디는 4~20자여야 합니다.');
                } else if (code && code === "DBE") {
                    setIdWarn(true);
                    setIdMessage('데이터베이스 오류.');
                }
            }
        }
    };

    //이메일 인증 API 호출
    const handleEmailCertification = async () => {
        setEmailWarn(false);
        setEmailMessage('이메일 전송중...');
        try {
            // 이메일 인증 API 호출
            const response = await axios.post('https://dexplore.info/api/v1/auth/email-certification', {
                id: id,
                email: email
            });
            setEmailWarn(false);
            setEmailMessage('인증번호가 전송되었습니다.');

        } catch (error) {
            // 상태 코드 확인하여 처리
            if (error.response) {
                const { code, message } = error.response.data;
                console.error('Error Response Code:', code);
                console.error('Error Response Message:', message);
                if (code && code === 'DI') {
                    setIdWarn(true);
                    setIdMessage('이 아이디는 이미 사용중 입니다.');
                    setEmailWarn(true);
                    setEmailMessage('아이디가 이미 사용중 입니다.');
                } else if (code && code === 'VF') {
                    setEmailWarn(true);
                    setEmailMessage('아이디 또는 이메일 양식을 확인해주세요');
                } else if (code && code === "DBE") {
                    setEmailWarn(true);
                    setEmailMessage('데이터베이스 오류.');
                }
            }
        }
    };

    //인증번호 확인 API 호출
    const handleCertificationCheck = async () => {
        try {
            // 이메일 인증 API 호출
            const response = await axios.post('https://dexplore.info/api/v1/auth/check-certification', {
                id: id,
                email: email,
                certificationNumber: cert
            });
            setCertWarn(false);
            setCertMessage('인증되었습니다.');
            setIsCertPass(true);

        } catch (error) {
            setIsCertPass(false);
            // 상태 코드 확인하여 처리
            if (error.response) {
                const { code, message } = error.response.data;
                console.error('Error Response Code:', code);
                console.error('Error Response Message:', message);
                if (code && code === 'VF') {
                    setCertWarn(true);
                    setCertMessage('유효하지 않은 값이 양식에 포함되어 있습니다.');
                } else if (code && code === 'CF') {
                    setCertWarn(true);
                    setCertMessage('유효하지 않은 인증번호입니다.');
                } else if (code && code === "DBE") {
                    setCertWarn(true);
                    setCertMessage('데이터베이스 오류.');
                }
            }
        }
    };

    const handleSignUp = async () => {
        try {
            // 아이디 중복 확인 API 호출
            const response = await axios.post('https://dexplore.info/api/v1/auth/sign-up', {
                id: id,
                password: password,
                email: email,
                certificationNumber: cert,
                role: checked ? "ROLE_ADMIN" : "ROLE_USER"
            });

            return response;

        } catch (error) {
            setIsIdPass(false);
            // 상태 코드 확인하여 처리
            if (error.response) {
                const { code, message } = error.response.data;
                console.error('Error Response Code:', code);
                console.error('Error Response Message:', message);
            }
            throw error;
        }
    };

    useEffect(() => {
        if (isIdPass && isPasswordPass && isEmailPass && isCertPass) {
            setBtnAvailable(true);
        } else {
            setBtnAvailable(false);
        }
    }, [isIdPass, isPasswordPass, isEmailPass, isCertPass]);

    return (
        <FullScreenWrapper>
            <DexploreTitle>
                Dexplore
            </DexploreTitle>
            <InputWrapper>
                <InputBoxWithBtn
                    title={"아이디"}
                    placeholder={"아이디를 입력해주세요"}
                    warn={idWarn}
                    value={id}
                    type={"text"}
                    message={idMessage}
                    changeHandler={onIdChangeHandler}
                    buttonName={"중복 확인"}
                    buttonFunc={handleCheckId}
                />
                <InputBox
                    title={"비밀번호"}
                    placeholder={"비밀번호를 입력해주세요"}
                    warn={passwordWarn}
                    value={password}
                    type={"password"}
                    message={passwordMessage}
                    changeHandler={onPasswordChangeHandler}
                />
                <InputBox
                    title={"비밀번호 확인"}
                    placeholder={"비밀번호를 입력해주세요"}
                    warn={passwordCheckWarn}
                    value={passwordCheck}
                    type={"password"}
                    message={passwordCheckMessage}
                    changeHandler={onPasswordCheckChangeHandler}
                />
                <InputBoxWithBtn
                    title={"이메일"}
                    placeholder={"이메일 주소를 입력해주세요"}
                    warn={emailWarn}
                    value={email}
                    type={"text"}
                    message={emailMessage}
                    changeHandler={onEmailChangeHandler}
                    buttonName={"이메일 인증"}
                    buttonFunc={handleEmailCertification}
                />
                <InputBoxWithBtn
                    title={"인증번호"}
                    placeholder={"인증번호 6자리를 입력해주세요"}
                    warn={certWarn}
                    value={cert}
                    type={"text"}
                    message={certMessage}
                    changeHandler={onCertChangeHandler}
                    buttonName={"인증하기"}
                    buttonFunc={handleCertificationCheck}
                />
            </InputWrapper>
            <CheckBoxWrapper>
                <Label>관리자로 등록하기</Label>
                <StyledCheckbox onChange={checkBoxChangeHandler} checked={checked}></StyledCheckbox>
            </CheckBoxWrapper>
            <StyledButton $avail={btnAvailable} onClick={signUpBtnHandler}>회원가입</StyledButton>
        </FullScreenWrapper>
    )
}

export default WelcomePage;