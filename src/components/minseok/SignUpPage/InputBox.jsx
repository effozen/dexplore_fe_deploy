import styled from "styled-components";

const InputBoxWrapper = styled.div`
  width: 300px;
  text-align: left;
  margin: auto;
  font-family: Pretendard-Regular;
`;

const InputTitle = styled.div`
  color: #FFFFFF;
  font-size: 15px;
`;

const InputContainer = styled.div`
  display: flex; /* Flexbox를 사용하여 버튼과 input을 나란히 배치 */
`;

const StyledInput = styled.input`
  width: ${({ hasButton }) => (hasButton ? '210px' : '300px')};
  height: 100%;
  padding: 12px;
  font-size: 14px;
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
  display: ${({ hasButton }) => (hasButton ? 'block' : 'none')}; /* 버튼이 없을 때 숨기기 */
  &:hover {
    background-color: #252525;
  }
`;

const StyledMessage = styled.div`
  color: ${({ isWarn }) => (isWarn ? 'rgba(255, 86, 64, 1)' : 'rgba(58, 87, 248, 1)')};
  font-size: 13px;
  height: 20px;
`;

/**
 title: 라벨에 들어갈 문자열
 placeholder: placeholder에 들어갈 문자열
 isWarn: boolean값, true면 빨간색 메세지, false면 파란색 메세지
 message: 메세지에 들어갈 문자열
 buttonName: 버튼에 들어갈 문자열, 비어있으면 버튼 생성 안함
 buttonFunc: 버튼을 눌렀을때 실행할 기능
 */
const InputBox = ({ title, placeholder, isWarn, message, buttonName, buttonFunc }) => {
    const hasButton = Boolean(buttonName);

    return (
        <InputBoxWrapper>
            <InputTitle>{title}</InputTitle>
            <InputContainer>
                <StyledInput type="text" placeholder={placeholder} hasButton={hasButton} />
                {hasButton && <StyledButton onClick={buttonFunc} hasButton={hasButton}>{buttonName}</StyledButton>}
            </InputContainer>
            <StyledMessage isWarn={isWarn}>{message}</StyledMessage>
        </InputBoxWrapper>
    );
}

export default InputBox;
