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
        relative mx-auto my-6 flex h-[500px]
        items-center justify-between overflow-hidden rounded-[20px]
        bg-[#0F6B2E] px-16 py-12 text-white
        max-[968px]:mx-5 max-[968px]:my-4 max-[968px]:h-auto
        max-[968px]:flex-col max-[968px]:rounded-2xl
        max-[968px]:px-5 max-[968px]:py-6
      "
    >
      {/* Conteúdo */}
      <div
        className="
          z-20 flex max-w-[550px] flex-col gap-4
          max-[968px]:max-w-full
        "
      >
        <h1 className="m-0 text-4xl font-bold">
          Correr Vivo
        </h1>

        <h2 className="m-0 text-2xl font-semibold">
          Compre direto de quem produz
        </h2>

        <p className="m-0 mb-4 text-base text-[#EAF8EF]">
          Produtos frescos, qualidade garantida e preços justos.
        </p>

        {/* Features */}
        <div
          className="
            mb-6 flex gap-6
            max-[968px]:flex-wrap max-[968px]:gap-3
          "
        >
          <div className="flex items-center gap-3 text-sm leading-[1.2]">
            <ShieldCheck size={24} strokeWidth={1.5} />
            <span>
              Pagamento
              <br />
              Seguro
            </span>
          </div>

          <div className="flex items-center gap-3 text-sm leading-[1.2]">
            <Truck size={24} strokeWidth={1.5} />
            <span>
              Logística
              <br />
              Inteligente
            </span>
          </div>

          <div className="flex items-center gap-3 text-sm leading-[1.2]">
            <Award size={24} strokeWidth={1.5} />
            <span>
              Qualidade
              <br />
              Garantida
            </span>
          </div>

          <div className="flex items-center gap-3 text-sm leading-[1.2]">
            <Leaf size={24} strokeWidth={1.5} />
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
            flex h-[52px] w-fit items-center justify-center gap-2
            rounded-2xl border-none bg-[#F4C542] px-6
            text-base font-semibold text-[#1C1C1C]
            transition-opacity hover:opacity-90
          "
        >
          Explorar produtos
          <ArrowRight size={20} />
        </button>
      </div>

      {/* Imagem */}
      <div
        className="
          absolute inset-y-0 right-0 flex w-1/2
          items-end justify-end
          max-[968px]:hidden
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