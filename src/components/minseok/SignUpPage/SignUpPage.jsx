import styled from "styled-components";
import background from "@assets/images/museum_BW6.jpg";
import InputBox from "@components/minseok/SignUpPage/InputBox";


const FullScreenWrapper = styled.div`
  width: 100vw;
  height: 100vh;
  background-image: linear-gradient(rgba(0, 0, 0, 0.0), rgba(0, 0, 0, 0.0)), url('${background}');
  background-size: cover;
  background-position: center;
  text-align: center;
  display: block;
`;

const DexploreTitle = styled.h1`
  font-family: Pretendard-ExtraBold;
  font-size: 38px;
  color: #FFFFFF;
  text-align: center;
  padding:45px;
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
  font-family: Pretendard-Regular;
`;
const StyledButton = styled.button`
  background-color: #000000;
  color: #FFFFFF;
  width: 300px;
  height: 43px;
  margin: auto;
  font-size: 15px;
  &:hover {
    background-color: #252525;
  }
`;

const WelcomePage = () => {
    return (
        <FullScreenWrapper>
            <DexploreTitle>
                Dexplore
            </DexploreTitle>
            <InputWrapper>
                <InputBox
                    title={"아이디"}
                    placeholder={"아이디를 입력해주세요"}
                    message={""}
                    isWarn={false}
                    buttonName={"중복 확인"}
                />
                <InputBox
                    title={"비밀번호"}
                    placeholder={"비밀번호를 입력해주세요"}
                    message={""}
                    isWarn={false}
                />
                <InputBox
                    title={"비밀번호확인"}
                    placeholder={"비밀번호를 입력해주세요"}
                    message={""}
                    isWarn={false}
                />
                <InputBox
                    title={"이메일"}
                    placeholder={"이메일 주소를 입력해주세요"}
                    message={""}
                    isWarn={false}
                    buttonName={"이메일 인증"}
                />
                <InputBox
                    title={"인증번호"}
                    placeholder={"인증번호 6자리를 입력해주세요"}
                    message={""}
                    isWarn={false}
                    buttonName={"인증 확인"}
                />
            </InputWrapper>
            <CheckBoxWrapper>
                <Label>관리자로 등록하기</Label>
                <StyledCheckbox></StyledCheckbox>
            </CheckBoxWrapper>
            <StyledButton>회원가입</StyledButton>
        </FullScreenWrapper>
    )
}

export default WelcomePage;