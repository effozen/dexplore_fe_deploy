import styled from "styled-components";
// Styled Components
const StyledFrame = styled.div`
	margin-left: 16px;
  margin-right: 16px;
	margin-bottom: 10px;
	margin-top: 20px;
`;

const StyledHeaderFrame = styled.div`
	min-width: 375px;
	display: flex;
	justify-content: space-between;
	align-items: center;
  padding-right:20px;
  margin-right:-20px;
`;


const ArtMatrix = ({title, itemInfo}) => {
  console.log(itemInfo);
  return (
      <StyledFrame>
        <StyledHeaderFrame>{title}</StyledHeaderFrame>
        <div className='grid-cols-3'>
          {itemInfo.map(v => {
            return (<div>
              <img src={v.imgUrl} alt=""/>
            </div>);
          })}
        </div>
      </StyledFrame>
  );
}

export default ArtMatrix;