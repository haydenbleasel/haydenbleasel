"use client";

import Image from "next/image";
import { useCallback, useState } from "react";

export const GameImage = ({
  id,
  name,
  capsuleFilename,
}: {
  id: number;
  name: string;
  capsuleFilename?: string;
}) => {
  const [fallback, setFallback] = useState<"original" | "capsule" | "none">(
    "original"
  );

  const handleError = useCallback(() => {
    setFallback((prev) =>
      prev === "original" && capsuleFilename ? "capsule" : "none"
    );
  }, [capsuleFilename]);

  if (fallback === "none") {
    return (
      <div className="w-32 h-15 shrink-0 rounded-lg bg-muted flex items-center justify-center">
        <span className="text-xs text-muted-foreground truncate px-2">
          {name}
        </span>
      </div>
    );
  }

  const src =
    fallback === "original"
      ? `https://cdn.cloudflare.steamstatic.com/steam/apps/${id}/header.jpg`
      : `https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/${id}/${capsuleFilename}`;

  return (
    <Image
      src={src}
      alt={name}
      className="w-20 h-9.5 shrink-0 rounded-md object-cover bg-sidebar object-center"
      width={128}
      height={60}
      unoptimized={fallback === "original"}
      onError={handleError}
    />
  );
};
