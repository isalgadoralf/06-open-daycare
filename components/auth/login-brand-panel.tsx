import { BrandSunIcon } from "@/components/shared/icons";

export function LoginBrandPanel() {
  return (
    <div className="relative flex flex-col justify-between overflow-hidden bg-[linear-gradient(155deg,var(--color-panel-from)_0%,var(--color-panel-mid)_45%,var(--color-panel-to)_100%)] px-[60px] py-[56px] text-white">
      <div className="absolute -top-[140px] -right-[120px] h-[420px] w-[420px] rounded-full bg-white/12" />
      <div className="absolute -bottom-[110px] -left-[80px] h-[300px] w-[300px] rounded-full bg-white/10" />

      <div className="relative flex items-center gap-[13px]">
        <div className="flex h-[46px] w-[46px] items-center justify-center rounded-[14px] bg-white/[.22]">
          <BrandSunIcon size={26} />
        </div>
        <span className="font-heading text-[21px] font-semibold tracking-[0.5px]">
          OpenDayCare
        </span>
      </div>

      <div className="relative">
        <h1 className="mb-[18px] font-heading text-[42px] font-semibold leading-[1.12]">
          El día de cada niño,
          <br />
          compartido con su familia.
        </h1>
        <p className="m-0 max-w-[430px] text-[17px] leading-[1.6] text-white/[.92]">
          Publicá momentos, gestioná las salas y mantené a las familias cerca,
          desde un solo lugar.
        </p>
      </div>

      <div className="relative text-[14px] text-white/[.9]">
        🌿 Guardería Sala Soles
      </div>
    </div>
  );
}
