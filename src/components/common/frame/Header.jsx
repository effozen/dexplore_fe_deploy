import styled from "styled-components";
// @ts-ignore
import backgroundMuseumImage from "@assets/images/museum_BW2.jpg";
import { AiOutlineArrowLeft } from "react-icons/ai";
import {useNavigate} from "react-router-dom";


const StyledHeader = styled.header`
	min-width: 375px;
	height: ${(props) => props.height || '130px'};
	background-image: url(${backgroundMuseumImage});
	background-size: 100%;
	background-position: center;
	display: flex;
	flex-direction: column;
	justify-content: flex-end;
	align-items: flex-end;
	flex-wrap: wrap;
`;

const StyledWelcomeMessage = styled.div`
  color: white;
  font-size: 24px;
	font-weight:700;
  margin-right: 13px;
  margin-bottom: 6px;
`

const StyledDate = styled.div`
  color: white;
  font-size: 13px;
  margin-right:17px;
  margin-bottom: 6px;
`;

const StyledFrame = styled.div`
  display: flex;
`;

const StyledBackButton = styled(AiOutlineArrowLeft)`
  color: white;
  font-size: 35px;
	font-weight:900;
  position:absolute;
  left:14px;
  cursor:pointer;
`

const formatDate = (date) => {
  const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
  const formattedDate = date.toLocaleDateString('ko-KR', options).slice(0, -1).replace(/\./g, '-').replace(/- /g, '-');

  const dayOfWeek = date.toLocaleDateString('ko-KR', { weekday: 'short' });

  return `${formattedDate} (${dayOfWeek})`;
};

const Header = ({ height, name, isDate=true }) => {
  const navigate = useNavigate();

  const date = new Date();
  const formattedDate = formatDate(date);

  const handleBackClick = (e) => {
    navigate(-1);
  };

  return (
    <StyledHeader height={height}>
      <StyledFrame>
        {!isDate && <StyledBackButton onClick={handleBackClick}><AiOutlineArrowLeft/></StyledBackButton>}
        <StyledWelcomeMessage>
          {name}
        </StyledWelcomeMessage>
      </StyledFrame>
      {isDate && <StyledDate>
        {formattedDate}
      </StyledDate>}
    </StyledHeader>
  );
}

export default Header;
