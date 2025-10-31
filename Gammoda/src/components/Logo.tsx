import { useState } from "react";
import { siteConfig } from "../config/siteConfig";
import logoImage from "../assets/download.jpg";
interface LogoProps {
  src?: string;
  className?: string;
  showText?: boolean;
}

export default function Logo({ src, className = "", showText = true }: LogoProps) {
  const logoSrc = src || logoImage; // <-- Use imported image by default
  // const logoSrc = src || siteConfig.logoSrc; 
  const [imageError, setImageError] = useState(false);
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {!imageError ? (
        <img
          src={logoSrc}
          alt={`${siteConfig.companyName} Logo`}
          className="h-10 w-10 object-contain"
          onError={() => setImageError(true)}
        />
      ) : (
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600 text-white">
          <span className="font-semibold">{siteConfig.companyInitials}</span>
        </div>
      )}
      {showText && (
        <div className="flex flex-col">
          <span className="text-gray-900">{siteConfig.companyShortName}</span>
        </div>
      )}
    </div>
  );
}
