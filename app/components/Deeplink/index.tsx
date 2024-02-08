import React, {useEffect, useState} from 'react';
import QRCode from 'qrcode';

function QRCodeRenderer({usedRef, id, value, size}) {
  const [qrCodeUrl, setQRCodeUrl] = useState('');

  useEffect(() => {
    const canvas = document.createElement('canvas');
    QRCode.toCanvas(canvas, value, {width: size, height: size}, (error) => {
      if (error) console.error(error);
      setQRCodeUrl(canvas.toDataURL('image/png'));
    });
  }, [value, size]);

  return <img crossOrigin="anonymous" ref={usedRef} width={size} height={size} id={id} src={qrCodeUrl} alt="QR Code"/>;
}

export default QRCodeRenderer
