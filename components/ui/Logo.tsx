import React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface LogoProps {
  variant?: "default" | "icon" | "horizontal" | "white";
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  showText?: boolean;
}

const sizeClasses = {
  sm: "h-8", // 32px
  md: "h-10", // 40px - taille par défaut
  lg: "h-12", // 48px
  xl: "h-16", // 64px
};

const logoSources = {
  default: "/assets/images/logo.svg",
  icon: "/assets/images/logo-icon.svg",
  horizontal: "/assets/images/logo-horizontal.svg",
  white: "/assets/images/logo-white.svg",
};

export const Logo: React.FC<LogoProps> = ({
  variant = "default",
  size = "md",
  className,
  showText = true,
}) => {
  const logoSrc = logoSources[variant];

  // Dimensions par défaut pour chaque variante
  const getDefaultDimensions = () => {
    switch (variant) {
      case "icon":
        return { width: 40, height: 40 };
      case "horizontal":
        return { width: 300, height: 80 };
      default:
        return { width: 200, height: 60 };
    }
  };

  const { width, height } = getDefaultDimensions();

  return (
    <div className={cn("flex items-center gap-3", className)}>
      {/* Logo Image - Remplacez par votre logo SVG */}
      <div
        className={cn(
          "relative flex-shrink-0",
          sizeClasses[size],
          variant === "icon" && "aspect-square"
        )}
      >
        {/* Placeholder temporaire - remplacez par votre logo */}
        {/* <div
          className={cn(
            "w-full h-full rounded-lg flex items-center justify-center text-white font-bold text-sm",
            "bg-gradient-to-r from-blue-600 to-purple-600"
          )}
        >
          {variant === "icon" ? "PS" : "LOGO"}
        </div> */}

        {/* Décommentez cette section une fois que vous aurez ajouté votre logo SVG */}

        <Image
          src={logoSrc}
          alt="Product Scorecard Logo"
          width={width}
          height={height}
          className="w-full h-full object-contain"
          priority
        />
      </div>

      {/* Texte d'accompagnement (optionnel) */}
      {/* {showText && variant !== "horizontal" && (
        <span
          className={cn(
            "font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent",
            size === "sm" && "text-lg",
            size === "md" && "text-xl",
            size === "lg" && "text-2xl",
            size === "xl" && "text-3xl"
          )}
        >
          Product Scorecard
        </span>
      )} */}
    </div>
  );
};

export default Logo;
