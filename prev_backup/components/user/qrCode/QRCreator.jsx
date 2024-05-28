import { useState, useEffect } from 'react';
import QRCode from 'qrcode.react';
import classNames from "classnames";

function QRCreator({ qrcodeHashkey, artName }) {
  const [qrdata, setQRdata] = useState('');

  useEffect(() => {
    setQRdata(qrcodeHashkey);
  }, [qrcodeHashkey]);

  const downloadQRCode = () => {
    if (!qrdata) return;

    const qrCodeCanvas = document.querySelector('#qrcode canvas');
    const qrCodeImage = qrCodeCanvas.toDataURL('image/png');

    const downloadLink = document.createElement('a');
    downloadLink.download = `qr_image_${artName}.png`;
    downloadLink.href = qrCodeImage;
    downloadLink.click();
  };

  return (
    <>
      <button onClick={downloadQRCode}>
        <div id="qrcode">
          {qrdata && <QRCode value={qrdata}/>}
        </div>
      </button>
      <div className={classNames('margin-top-7')}>
        다운로드 하시려면 QR코드를 클릭하세요.
      </div>
    </>
  );
}

export default QRCreator;
