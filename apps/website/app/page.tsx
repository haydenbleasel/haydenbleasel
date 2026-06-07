import Image from "next/image";

import Photo from "@/app/photo.jpg";
import { Newsletter } from "@/components/newsletter";

const externalLinkProps = {
  rel: "noopener noreferrer",
  target: "_blank",
};

const VercelMark = () => (
  <svg
    aria-hidden="true"
    className="mx-1 inline-block size-4 -translate-y-px"
    fill="currentColor"
    viewBox="0 0 24 21"
  >
    <path d="M11.8508 0L23.7015 20.5263H0L11.8508 0Z" />
  </svg>
);

const OpenAIMark = () => (
  <svg
    aria-hidden="true"
    className="mx-1 inline-block size-4 translate-y-[-2px]"
    fill="currentColor"
    viewBox="0 0 24 24"
  >
    <path d="M9.20507 8.658V6.39835C9.20507 6.20803 9.27647 6.06524 9.4429 5.9702L13.9861 3.3538C14.6046 2.99703 15.3419 2.8306 16.1029 2.8306C18.9573 2.8306 20.7651 5.04273 20.7651 7.39743C20.7651 7.56388 20.7651 7.75419 20.7412 7.94451L16.0316 5.1853C15.7462 5.01887 15.4607 5.01887 15.1753 5.1853L9.20507 8.658ZM19.8136 17.4589V12.0593C19.8136 11.7262 19.6707 11.4884 19.3853 11.3219L13.4152 7.84923L15.3656 6.73122C15.532 6.63618 15.6749 6.63618 15.8413 6.73122L20.3845 9.34764C21.6928 10.1089 22.5727 11.7262 22.5727 13.296C22.5727 15.1036 21.5025 16.7687 19.8136 17.4586V17.4589ZM7.80172 12.7016L5.85129 11.56C5.68484 11.465 5.61345 11.3222 5.61345 11.1319V5.89904C5.61345 3.35401 7.56388 1.42724 10.2042 1.42724C11.2032 1.42724 12.1307 1.76035 12.9158 2.35493L8.23009 5.0666C7.94473 5.23305 7.80193 5.47089 7.80193 5.804V12.7019L7.80172 12.7016ZM12 15.1278L9.20507 13.558V10.228L12 8.65823L14.7946 10.228V13.558L12 15.1278ZM13.7958 22.3587C12.7967 22.3587 11.8692 22.0256 11.0841 21.4311L15.7698 18.7193C16.0552 18.5529 16.198 18.3151 16.198 17.982V11.0841L18.1724 12.2258C18.3388 12.3208 18.4101 12.4636 18.4101 12.6539V17.8868C18.4101 20.4317 16.4358 22.3587 13.7958 22.3587ZM8.15846 17.0545L3.61527 14.4381C2.30695 13.6769 1.42701 12.0595 1.42701 10.4897C1.42701 8.65823 2.52115 7.01703 4.20985 6.32717V11.7503C4.20985 12.0834 4.35265 12.3213 4.63801 12.4877L10.5846 15.9365L8.63414 17.0545C8.46769 17.1496 8.32489 17.1496 8.15846 17.0545ZM7.89698 20.9555C5.20917 20.9555 3.23487 18.9335 3.23487 16.436C3.23487 16.2457 3.25874 16.0554 3.28239 15.8651L7.96815 18.5768C8.2535 18.7432 8.53909 18.7432 8.82445 18.5768L14.7946 15.128V17.3877C14.7946 17.578 14.7233 17.7207 14.5568 17.8157L10.0136 20.4322C9.39516 20.7889 8.65777 20.9555 7.89676 20.9555H7.89698ZM13.7958 23.7858C16.6738 23.7858 19.0761 21.7402 19.6234 19.0286C22.2873 18.3387 24 15.8412 24 13.2962C24 11.6312 23.2864 10.0138 22.0019 8.84832C22.1209 8.34877 22.1924 7.84923 22.1924 7.34991C22.1924 3.94861 19.4331 1.40336 16.2458 1.40336C15.6037 1.40336 14.9852 1.49841 14.3667 1.71259C13.2962 0.665983 11.8215 0 10.2042 0C7.32604 0 4.92381 2.04547 4.37652 4.75714C1.7126 5.447 0 7.94451 0 10.4895C0 12.1546 0.713504 13.7719 1.99795 14.9374C1.87903 15.437 1.80764 15.9365 1.80764 16.4359C1.80764 19.8371 4.56683 22.3823 7.7542 22.3823C8.3963 22.3823 9.01477 22.2874 9.63322 22.0732C10.7035 23.1198 12.1782 23.7858 13.7958 23.7858Z" />
  </svg>
);

const PalantirMark = () => (
  <svg
    aria-hidden="true"
    className="mx-1 inline-block size-4 -translate-y-px"
    fill="currentColor"
    viewBox="0 0 634 800"
  >
    <path d="M588.3 600 316.675 706 45.05 600 0 678.125 316.675 800l316.675-121.875L588.3 600ZM316.675 0C141.8 0 0 141.8 0 316.675 0 491.55 141.8 633.35 316.675 633.35c174.875 0 316.675-141.8 316.675-316.675C633.35 141.8 491.55 0 316.675 0Zm0 535.95c-120.975 0-218.875-98.05-218.875-218.875 0-120.975 97.925-219 218.875-219 120.95 0 218.875 98.05 218.875 219 0 120.825-97.925 218.875-218.875 218.875Z" />
  </svg>
);

const Home = () => (
  <main className="grid w-full gap-8 px-6 py-6 sm:px-12 sm:py-12 min-[1200px]:min-h-screen min-[1200px]:grid-cols-[531px_minmax(0,1fr)] min-[1200px]:items-stretch min-[1200px]:gap-[clamp(3rem,10.76vw,155px)]">
    <div className="flex flex-col gap-10 min-[1200px]:min-h-[calc(100svh-6rem)] min-[1200px]:justify-between">
      <Image
        alt="Hayden Bleasel"
        className="size-8 shrink-0 rounded-full object-cover"
        height={32}
        sizes="32px"
        src={Photo}
        width={32}
        priority
      />

      <div className="grid max-w-xl gap-6">
        <div className="grid gap-[26px]">
          <p>Hi, I&apos;m Hayden Bleasel.</p>

          <p>
            I work as a Member of Technical Staff at <OpenAIMark /> OpenAI.
            I&apos;m originally from Sydney, Australia; now living in San
            Francisco, California.
          </p>

          <p>
            I was previously acquihired at <VercelMark /> Vercel where I worked
            on the DX team. Before that, I was a CPO for a cybersecurity startup
            (acq&apos;d $170M), ran and sold my own agency, and interned at{" "}
            <PalantirMark />
            Palantir.
          </p>

          <p>
            After hours I maintain OSS projects such as{" "}
            <a href="https://www.ultracite.ai" {...externalLinkProps}>
              Ultracite
            </a>
            ,{" "}
            <a href="https://useghost.sh/" {...externalLinkProps}>
              Ghost
            </a>{" "}
            and{" "}
            <a href="https://files-sdk.dev" {...externalLinkProps}>
              Files SDK
            </a>
            . I previously sold{" "}
            <a
              href="https://www.shadcnblocks.com/blog/announcing-kibo-ui-acquisition/"
              {...externalLinkProps}
            >
              Kibo UI
            </a>
            ,{" "}
            <a
              href="https://x.com/haydenbleasel/status/1678770475647012864"
              {...externalLinkProps}
            >
              Refraction
            </a>{" "}
            and{" "}
            <a
              href="https://x.com/haydenbleasel/status/1929625673586598148"
              {...externalLinkProps}
            >
              next-forge
            </a>
            .
          </p>

          <p>
            If you&apos;d like to stay up to date with my adventures, subscribe
            to my mailing list below,{" "}
            <a href="https://x.com/haydenbleasel" {...externalLinkProps}>
              follow me on 𝕏
            </a>{" "}
            or check out{" "}
            <a
              className="underline underline-offset-2 transition-colors hover:text-[#427f5b]"
              href="https://os1.haydenbleasel.com"
              {...externalLinkProps}
            >
              OS1
            </a>
            .
          </p>
        </div>

        <Newsletter />
      </div>
    </div>

    <div className="relative aspect-658/804 w-full overflow-hidden rounded-3xl bg-[#fafafa] min-[1200px]:aspect-auto min-[1200px]:h-[calc(100svh-6rem)] min-[1200px]:min-h-0">
      <video
        aria-label="A rendered garden data center scene"
        autoPlay
        className="size-full object-cover blur-[0.7px] saturate-[1.5]"
        loop
        muted
        playsInline
        preload="metadata"
        src="https://m5ujrbvzrmbgd5kn.public.blob.vercel-storage.com/home.webm"
      />
    </div>
  </main>
);

export default Home;
