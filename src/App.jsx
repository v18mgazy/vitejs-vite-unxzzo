import React, { useState } from 'react';
import './App.css';  // استيراد ملف CSS

function App() {
  const [centerNumber, setCenterNumber] = useState('');
  const [frontImage, setFrontImage] = useState(null);
  const [backImage, setBackImage] = useState(null);
  const [location, setLocation] = useState({ latitude: null, longitude: null });
  const [frontImageSrc, setFrontImageSrc] = useState('');
  const [backImageSrc, setBackImageSrc] = useState('');

  const handleCenterNumberChange = (e) => {
    setCenterNumber(e.target.value);
  };

  const handleFrontImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFrontImageSrc(reader.result);
      };
      reader.readAsDataURL(file);
      setFrontImage(file);  // حفظ الصورة كملف
    }
  };

  const handleBackImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setBackImageSrc(reader.result);
      };
      reader.readAsDataURL(file);
      setBackImage(file);  // حفظ الصورة كملف
    }
  };

  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => console.error(error)
      );
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  };

  const handleSubmit = async () => {
    if (location.latitude === null || location.longitude === null) {
      alert("يرجى حفظ الموقع أولاً.");
      return;
    }

    const formData = new FormData();
    formData.append('centerNumber', centerNumber);
    formData.append('frontImage', frontImage);
    formData.append('backImage', backImage);
    formData.append('latitude', location.latitude);
    formData.append('longitude', location.longitude);

    try {
      await fetch('YOUR_GOOGLE_APPS_SCRIPT_URL', {
        method: 'POST',
        body: formData,
      });
      alert("تم حفظ البيانات بنجاح!");
    } catch (error) {
      console.error(error);
      alert("فشل في حفظ البيانات.");
    }
  };

  return (
    <div className="container">
      <h1>الأهلي ممكن</h1>
      <h2>تيم كفر الشيخ</h2>
      
      <label>رقم المركز:</label>
      <input type="text" value={centerNumber} onChange={handleCenterNumberChange} />

      <div>
        <label>صورة بطاقة الرقم القومى الوجه:</label>
        <input 
          type="file" 
          accept="image/*" 
          capture // استخدام capture بدون environment
          onChange={handleFrontImageUpload} 
        />
        {frontImageSrc && <img src={frontImageSrc} alt="Front ID" style={{ width: '100%', marginTop: '10px' }} />}
      </div>

      <div>
        <label>صورة بطاقة الرقم القومى الظهر:</label>
        <input 
          type="file" 
          accept="image/*" 
          capture // استخدام capture بدون environment
          onChange={handleBackImageUpload} 
        />
        {backImageSrc && <img src={backImageSrc} alt="Back ID" style={{ width: '100%', marginTop: '10px' }} />}
      </div>

      <button onClick={getLocation}>حفظ الموقع</button>
      {location.latitude && location.longitude && (
        <p className="location-info">الموقع: {location.latitude}, {location.longitude}</p>
      )}

      <button onClick={handleSubmit}>إرسال</button>
    </div>
  );
}

export default App;
// افترض أنك التقطت صورة وتم تخزينها في frontImageSrc
const recognizeText = (imageSrc) => {
  Tesseract.recognize(
    imageSrc, // استخدم الرابط أو بيانات الصورة
    'eng', // اللغة التي تريد استخدامها
    {
      logger: info => console.log(info) // لمراقبة العملية
    }
  ).then(({ data: { text } }) => {
    console.log(text); // النص المستخرج
    // هنا يمكنك معالجة النص المستخرج (تقسيم الاسم، العنوان، الرقم القومي)
  });
};

// عند التقاط الصورة أو رفعها، استدعِ هذه الدالة
// على سبيل المثال، عند رفع الصورة
const handleFrontImageUpload = (e) => {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onloadend = () => {
      setFrontImageSrc(reader.result); // حفظ مصدر الصورة
      recognizeText(reader.result); // استدعاء الدالة للاستخراج
    };
    reader.readAsDataURL(file);
  }
};
