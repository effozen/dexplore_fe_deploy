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
      <div className={classNames('mt-2 mb-2')}>
        QR을 클릭하여 다운로드하세요.
      </div>
    </>
  );
}

export default QRCreator;
