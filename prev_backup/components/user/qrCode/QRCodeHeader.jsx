import Header from "../../frame_backup/Header";
import headerText from "../../data/headerText";

export default function QRCodeHeader() {
  return (
    <header>
      <Header title={headerText.QRCode}></Header>
    </header>
  );
}