import React, { useRef, useState, useEffect } from 'react';

interface InputOTPProps {
  length?: number;
  onComplete: (otp: string) => void;
}

export const InputOTP: React.FC<InputOTPProps> = ({ length = 6, onComplete }) => {
  const [otp, setOtp] = useState<string[]>(new Array(length).fill(""));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0]?.focus();
    }
  }, []);

  const handleChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (isNaN(Number(value))) return;

    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    const combinedOtp = newOtp.join("");
    if (combinedOtp.length === length) {
      onComplete(combinedOtp);
    }

    if (value && index < length - 1 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0 && inputRefs.current[index - 1]) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const data = e.clipboardData.getData("text").slice(0, length);
    if (isNaN(Number(data))) return;

    const newOtp = data.split("");
    for (let i = 0; i < length; i++) {
        if(newOtp[i]) otp[i] = newOtp[i];
    }
    setOtp([...otp]);
    if (data.length === length) onComplete(data);
    inputRefs.current[Math.min(data.length, length - 1)]?.focus();
  };

  return (
    <div className="flex gap-2 justify-center">
      {otp.map((_, index) => (
        <input
          key={index}
          ref={(ref) => { inputRefs.current[index] = ref }}
          type="text"
          maxLength={1}
          value={otp[index]}
          onChange={(e) => handleChange(index, e)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          onPaste={handlePaste}
          // ✅ CHANGED: Uses focus:border-theme-primary and focus:ring-theme-border
          className="w-12 h-12 text-center text-xl font-bold border border-gray-300 rounded-lg focus:border-theme-primary focus:ring-2 focus:ring-theme-border outline-none transition-all text-gray-900 bg-white"
        />
      ))}
    </div>
  );
};