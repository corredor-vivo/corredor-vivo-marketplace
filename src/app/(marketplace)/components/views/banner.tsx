import {
  ShieldCheck,
  Truck,
  Award,
  Leaf,
  ArrowRight,
} from "lucide-react";

export function MarketplaceBanner() {
  return (
    <section
      className="
        relative mx-auto my-4 hidden flex-col items-start overflow-hidden rounded-2xl
        bg-emerald-700 px-5 py-6 text-white
        sm:my-6 sm:px-8 sm:py-8
        md:flex
        lg:h-[500px] lg:flex-row lg:items-center lg:justify-between
        lg:rounded-[20px] lg:px-16 lg:py-12
      "
    >
      {/* Conteúdo */}
      <div
        className="
          z-20 flex w-full max-w-full flex-col gap-3
          lg:max-w-[550px] lg:gap-4
        "
      >
        <h1 className="m-0 text-3xl font-bold sm:text-4xl">
          Correr Vivo
        </h1>

        <h2 className="m-0 text-xl font-semibold sm:text-2xl">
          Compre direto de quem produz
        </h2>

        <p className="m-0 mb-2 text-sm text-[#EAF8EF] sm:mb-4 sm:text-base">
          Produtos frescos, qualidade garantida e preços justos.
        </p>

        {/* Features */}
        <div
          className="
            mb-4 grid grid-cols-2 gap-x-3 gap-y-4
            sm:mb-6 sm:flex sm:gap-6
          "
        >
          <div className="flex items-center gap-2 text-xs leading-[1.2] sm:gap-3 sm:text-sm">
            <ShieldCheck size={24} strokeWidth={1.5} className="shrink-0" />
            <span>
              Pagamento
              <br />
              Seguro
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs leading-[1.2] sm:gap-3 sm:text-sm">
            <Truck size={24} strokeWidth={1.5} className="shrink-0" />
            <span>
              Logística
              <br />
              Inteligente
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs leading-[1.2] sm:gap-3 sm:text-sm">
            <Award size={24} strokeWidth={1.5} className="shrink-0" />
            <span>
              Qualidade
              <br />
              Garantida
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs leading-[1.2] sm:gap-3 sm:text-sm">
            <Leaf size={24} strokeWidth={1.5} className="shrink-0" />
            <span>
              Apoio ao
              <br />
              Produtor
            </span>
          </div>
        </div>

        {/* Botão */}
        <button
          type="button"
          className="
            flex h-11 w-full items-center justify-center gap-2
            rounded-2xl border-none bg-[#F4C542] px-6
            text-sm font-semibold text-[#1C1C1C]
            transition-opacity hover:opacity-90
            sm:h-[52px] sm:w-fit sm:text-base
          "
        >
          Explorar produtos
          <ArrowRight size={20} />
        </button>
      </div>

      {/* Imagem */}
      <div
        className="
          absolute inset-y-0 right-0 hidden w-1/2
          items-end justify-end
          lg:flex
        "
      >
        <img
          src="/images/background.jpg"
          alt="Cesta de produtos agrícolas"
          className="
            h-full w-full object-cover
            [mask-image:linear-gradient(to_right,transparent_0%,black_50%)]
            [-webkit-mask-image:linear-gradient(to_right,transparent_0%,black_50%)]
          "
        />

        {/* Badge */}
        <div
          className="
            absolute bottom-12 right-16
            flex items-center gap-3 rounded-2xl
            bg-[#F4C542] p-4 text-[#1C1C1C]
            shadow-[0_8px_24px_rgba(0,0,0,0.1)]
          "
        >
          <Leaf size={24} className="text-[#0F6B2E]" />

          <div className="text-sm font-semibold leading-[1.2]">
            <span>Apoio ao produtor.</span>
            <br />
            <span>Fortaleça Angola.</span>
          </div>
        </div>
      </div>
    </section>
  );
}