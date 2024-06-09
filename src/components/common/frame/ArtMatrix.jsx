import styled from "styled-components";
import {useNavigate} from "react-router-dom";

// Styled Components
const StyledFrame = styled.div`
  margin-left: 16px;
  margin-right: 16px;
  margin-bottom: 10px;
  margin-top: 40px;
`;

const StyledHeaderFrame = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-right: 20px;
  margin-right: -20px;
`;

const StyledHeader = styled.div`
  margin-top: 10px;
  font-weight: 600;
  color: #000000;
`;

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  height: 100%;
  gap: 2px;

  @media (min-width: 769px) {
    grid-template-columns: repeat(6, 1fr);
    gap: 3px;
  }

  @media (min-width: 1024px) {
    grid-template-columns: repeat(9, 1fr);
    gap: 4px;
  }

  div {
    position: relative;
    width: 100%;
    padding-bottom: 100%; /* This makes the div a square */
  }

  img {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover; /* This makes the image cover the square */
  }
`;

const LoadingContainer = styled.div`
  height: 200px;
  width: 100%;
  text-align: center;
  align-content: center;
  font-size: 18px;
  font-weight: 600;
`

const ArtMatrix = ({ title, itemInfo }) => {

    const navigate = useNavigate();

    const handleClick = (id) => {
        navigate("/user/art/info/", { state: { artId: id } });
    };

    return (
        <StyledFrame>
            <StyledHeaderFrame>
                <StyledHeader>{title}</StyledHeader>
            </StyledHeaderFrame>
            {itemInfo.length === 0 ? <LoadingContainer>아직 북마크한 작품이 없어요</LoadingContainer>:
                <GridContainer>
                    {itemInfo.map((v, index) => (
                        <div key={index} onClick={() => handleClick(v.artId)}>
                            <img src={v.imgUrl} alt={`Artwork ${index}`} />
                        </div>
                    ))}
                </GridContainer>
            }

        </StyledFrame>
    );
};

export default ArtMatrix;
