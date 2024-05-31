import styled from "styled-components";
import background from "@assets/images/museum_BW2.jpg";
import InputBox from "@components/minseok/components/InputBox";
import {useEffect, useState} from "react";
import kakaoImg from "@assets/images/kakao-sign-in.png";
import naverImg from "@assets/images/naver-sign-in.png";
import {useNavigate} from "react-router-dom";
import axios from "axios";
import {useCookies} from "react-cookie";
import {jwtDecode} from "jwt-decode";

const FullScreenWrapper = styled.div`
  width: 100vw;
  height: 100vh;
  background-image: linear-gradient(rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.5)), url('${background}');
  background-size: cover;
  background-position: center;
  font-size: 15px;
  text-align: center;
  display: block;
  p {
    color: #FFFFFF;
  }
`;

const DexploreTitle = styled.h1`
  font-size: 38px;
  color: #FFFFFF;
  text-align: center;
  padding:155px 45px 45px 45px;
  font-weight: 900;
`

const InputWrapper = styled.div`
  display: block;
`

const StyledLoginButton = styled.button`
  background-color: rgba(0,0,0,1);
  color: rgba(255,255,255,1);
  width: 300px;
  height: 43px;
  margin: 12px auto 12px auto;
  font-size: 15px;
  font-weight: 500;
  display: block;
  &:hover {
    background-color: #252525;
    cursor: pointer;
  }
`;

const StyledSignUpButton = styled.button`
  background-color: rgba(99,99,99,1);
  color: rgba(255,255,255,1);
  width: 300px;
  height: 43px;
  margin: 0px auto 38px auto;
  font-size: 15px;
  font-weight: 500;
  display: block;
  &:hover {
    background-color: #666666;
    cursor: pointer;
  }
`;

const OAuth2ImageBtn = styled.div`
  width: 56px;
  height: 56px;
  background-position: 50% 50%;
  background-size: 100% 100%;
  background-image: url(${props => (props.$img)});
  display: inline-flex;
  margin: 15px 10px 15px 10px;
  &:hover {
    cursor: pointer;
  }
`

const SignInPage = () => {

    const [cookie, setCookie, removeCookie] = useCookies();
    const [id, setId] = useState('');
    const [password, setPassword] = useState('');
    const [passwordMessage, setPasswordMessage] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const token = cookie.accessToken;
        if (token) {
            const decodedToken = jwtDecode(token);
            console.log(decodedToken);
            const now = Date.now() / 1000;
            if (decodedToken.exp < now) {
                // 토큰이 만료된 경우
                removeCookie('accessToken', { path: '/' }); // 만료된 토큰 삭제
                navigate("/auth/sign-in");
            } else {
                // 토큰이 유효한 경우
                const userRole = decodedToken.role;
                if(userRole && userRole === "ROLE_ADMIN") {
                    navigate("/admin/management");
                } else if (userRole && userRole === "ROLE_USER") {
                    navigate("/user/main");
                } else {
                    alert("wrong role");
                }
            }
        }
    }, [cookie]);

    const idChangeHandler = (event) => {
        const {value} = event.target;
        setId(value);
    }
    const passwordChangeHandler = (event) => {
        const {value} = event.target;
        setPassword(value);
        setPasswordMessage('');
    }

    const SignInOnClickHandler = () => {
        handleSignIn().then(response => {
            const {code, message, token, expirationTime, role} = response.data;
            console.log("code"+code);
            console.log("message"+message);
            console.log("token"+token);
            console.log("expirationTime"+expirationTime);
            console.log("role"+role);

            const now = (new Date().getTime())*1000; //ms
            const expires = new Date(now + Number(expirationTime));

            setCookie('accessToken', token, {expires, path: '/'});
        }).catch(error => {
            alert("예기치 못한 오류가 발생했습니다. 다시 시도하세요.");
        })
    }

    const SignUpOnClickHandler = () => {
        navigate("/auth/sign-up");
    }

    const handleSignIn = async () => {
        try {
            // 아이디 중복 확인 API 호출
            const response = await axios.post('https://dexplore.info/api/v1/auth/sign-in', {
                id: id,
                password: password
            });

            return response;
        } catch (error) {
            // 상태 코드 확인하여 처리
            if (error.response) {
                const { code, message } = error.response.data;
                console.error('Error Response Code:', code);
                console.error('Error Response Message:', message);
                setPasswordMessage('아이디 또는 패스워드가 올바르지 않습니다.');
            }
            throw error;
        }
    };

    const onSnsSignInButtonClickHandler = (snsType) => () => {
        window.location.href = `https://dexplore.info/api/v1/auth/oauth2/${snsType}`;
    }

    return (
        <FullScreenWrapper>
            <DexploreTitle>
                Dexplore
            </DexploreTitle>
            <InputWrapper>
                <InputBox
                    title={"아이디"}
                    placeholder={"아이디를 입력해주세요"}
                    warn={true}
                    value={id}
                    type={"text"}
                    message={''}
                    changeHandler={idChangeHandler}
                />
                <InputBox
                    title={"비밀번호"}
                    placeholder={"비밀번호를 입력해주세요"}
                    warn={true}
                    value={password}
                    type={"password"}
                    message={passwordMessage}
                    changeHandler={passwordChangeHandler}
                />
            </InputWrapper>
            <StyledLoginButton onClick={SignInOnClickHandler}>로그인</StyledLoginButton>
            <StyledSignUpButton onClick={SignUpOnClickHandler}>회원가입</StyledSignUpButton>
            <p>SNS 로그인</p>
            <div>
                <OAuth2ImageBtn $img={kakaoImg} onClick={onSnsSignInButtonClickHandler('kakao')}/>
                <OAuth2ImageBtn $img={naverImg} onClick={onSnsSignInButtonClickHandler('naver')}/>
            </div>
        </FullScreenWrapper>
    )
}

export default SignInPage;