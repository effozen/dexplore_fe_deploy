import styled from "styled-components";

const InputBoxWrapper = styled.div`
  width: 300px;
  text-align: left;
  margin: auto;
`;

const InputTitle = styled.div`
  color: #FFFFFF;
  font-size: 15px;
  font-weight: 500;
`;

const InputContainer = styled.div`
  display: flex; 
`;

const StyledInput = styled.input`
  width: 210px;
  height: 100%;
  padding: 12px;
  font-size: 14px;
  font-weight: 300;
  border: solid #909090 1px;
  &:focus {
    outline: none;
  }
`;

const StyledButton = styled.button`
  background-color: #000000;
  color: #FFFFFF;
  width: 90px;
  margin-left: 5px;
  font-size: 15px;
  font-weight: 500;
  display: block;
  &:hover {
    background-color: #252525;
  }
`;

const StyledMessage = styled.div`
  color: ${props => (props.$warn ? 'rgba(255, 86, 64, 1)' : 'rgba(58, 87, 248, 1)')};
  font-size: 13px;
  height: 20px;
`;

/**
 title: 라벨에 들어갈 문자열
 placeholder: placeholder에 들어갈 문자열
 warn: boolean값, true면 빨간색 메세지, false면 파란색 메세지
 value: 인풋에 들어가는 값
 message: 메세지에 들어갈 문자열
 changeHandler: 인풋 변화시 불러오는 핸들러
 buttonName: 버튼 이름
 buttonFunc: 버튼 눌렀을때 실행할 함수
 */
const InputBox = ({ title, placeholder, warn, value, type, message, changeHandler, buttonName, buttonFunc }) => {


    return (
        <InputBoxWrapper>
            <InputTitle>{title}</InputTitle>
            <InputContainer>
                <StyledInput type={type} placeholder={placeholder} value={value} onChange={changeHandler}/>
                <StyledButton onClick={buttonFunc} >{buttonName}</StyledButton>
            </InputContainer>
            <StyledMessage $warn={warn}>{message}</StyledMessage>
        </InputBoxWrapper>
    );
}

export default InputBox;
