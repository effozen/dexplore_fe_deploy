import testImage from "../../../modules/img/testImage400.jpeg";

export default function QRCodeMenu({}) {
  return (
    <menu>
      <div>
        <button><img src={testImage} alt="img"/></button>
        <p>주변 작품 확인</p>
      </div>
    </menu>
  );
}