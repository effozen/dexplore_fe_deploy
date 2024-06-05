import styled from "styled-components";
// Styled Components
const StyledFrame = styled.div`
	margin-left: 16px;
  margin-right: 16px;
	margin-bottom: 10px;
	margin-top: 40px;
`;

const StyledHeaderFrame = styled.div`
	min-width: 375px;
	display: flex;
	justify-content: space-between;
	align-items: center;
  padding-right:20px;
  margin-right:-20px;
`;

const StyledHeader = styled.div`
	margin-top: 10px;
	font-weight: 600;
	color: #000000;
`;

const ArtMatrix = ({title, itemInfo}) => {
  console.log(itemInfo);
  return (
      <StyledFrame>
        <StyledHeaderFrame><StyledHeader>{title}</StyledHeader></StyledHeaderFrame>
        <div className='grid grid-cols-3 gap-x-[1vw] gap-y-[1vw]'>
          {itemInfo.map(v => {
            return (<div className='h-[33vw]'>
              <img src={v.imgUrl} alt="" className='w-full h-full overflow-hidden' />
            </div>);
          })}
        </div>
      </StyledFrame>
  );
}

export default ArtMatrix;