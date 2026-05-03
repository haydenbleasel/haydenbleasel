import Image from "next/image";

import Photo from "@/app/photo.jpg";

export const Hero = () => (
  <div className="grid sm:grid-cols-[1fr_113px] gap-8">
    <Image
      alt="Hayden Bleasel"
      className="h-auto w-[79px] sm:w-[113px] shrink-0 rounded-md sm:order-2"
      height={137}
      sizes="(max-width: 639px) 79px, 113px"
      src={Photo}
      width={113}
      priority
    />
    <h1 className="font-normal font-serif text-[28px] sm:text-[38px] leading-[1.2] text-foreground">
      Member of Technical Staff at OpenAI. Originally from Sydney and currently
      living in San Francisco, California.
    </h1>
  </div>
);
