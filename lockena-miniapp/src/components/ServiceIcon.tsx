import { logoService } from "lockena-core";
import { useEffect, useState } from "react";

const ServiceIcon = ({ name, size = 10 }: { name: string; size?: number }) => {
  const [error, setError] = useState(false);
  const [image, setImage] = useState<string>("");
  useEffect(() => {
    const fetchLogo = async () => {
      const response = await logoService.get(name);
      if (response.state === "success") {
        const url = URL.createObjectURL(response.data);
        setImage(url);
      } else setError(true);
    };

    fetchLogo();
  }, [name]);

  if (image && !error) {
    return (
      <img
        src={image}
        alt={name}
        className={`w-${size} h-${size} rounded-full object-cover bg-gray-100 border border-black/5`}
        onError={() => setError(true)}
      />
    );
  }

  return (
    <div
      className={`w-${size} h-${size} rounded-full bg-linear-to-br from-[#4f46e5] to-[#3730a3] flex items-center justify-center text-white font-bold text-3xl`}
    >
      {name.charAt(0).toUpperCase()}
    </div>
  );
};

export default ServiceIcon;
