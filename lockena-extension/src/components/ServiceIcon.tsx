import { useEffect, useState } from "react";
import { Globe } from "lucide-react";
import { sendMessage } from "../messages";

interface ServiceIconProps {
  serviceName: string;
  className?: string;
}

export function ServiceIcon({ serviceName, className }: ServiceIconProps) {
  const [logoUrl, setLogoUrl] = useState<string | null>(null);

  useEffect(() => {
    let objectUrl: string | null = null;
    async function fetchLogo() {
      try {
        const response = await sendMessage({
          type: "GET_LOGO",
          serviceName: serviceName,
        });
        if (response.type === "LOGO_URL") {
          objectUrl = response.payload;
          setLogoUrl(objectUrl);
        }
      } catch (e) {
        console.error("Failed to fetch logo", e);
      }
    }

    if (serviceName) fetchLogo();

    return () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [serviceName]);

  if (logoUrl) {
    return <img src={logoUrl} alt={serviceName} className={className} />;
  }

  return <Globe className={className} />;
}
