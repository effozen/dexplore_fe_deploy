import styled from "styled-components";
// @ts-ignore
import { AiOutlineArrowLeft } from "react-icons/ai";
import {useNavigate} from "react-router-dom";


const StyledHeader = styled.header`
	min-width: 375px;
	height: ${(props) => props.height || '55px'};
	background-size: 100%;
	background-position: center;
	display: flex;
	flex-direction: column;
	justify-content: flex-end;
	align-items: flex-end;
	flex-wrap: wrap;
`;

const StyledWelcomeMessage = styled.div`
  color: black;
  font-size: 24px;
	font-weight:700;
  margin-right: 13px;
  margin-bottom: 6px;
`

const StyledFrame = styled.div`
  display: flex;
`;

const StyledBackButton = styled(AiOutlineArrowLeft)`
  color: black;
  font-size: 35px;
	font-weight:900;
  position:absolute;
  left:14px;
  cursor:pointer;
`

const InfoHeader = ({ height, name, isDate=true }) => {
  const navigate = useNavigate();

  const handleBackClick = (e) => {
    navigate(-1);
  };

  return (
    <StyledHeader height={height}>
      <StyledFrame>
        <StyledBackButton onClick={handleBackClick}><AiOutlineArrowLeft/></StyledBackButton>
        <StyledWelcomeMessage>
          {name}
        </StyledWelcomeMessage>
      </StyledFrame>
    </StyledHeader>
  );
}

export default InfoHeader;
