import { ExternalLink, Mail, FileText } from "lucide-react";

const socialLinks = [
  { label: "Facebook", href: "https://example.com/corredor-vivo/facebook" },
  { label: "Instagram", href: "https://example.com/corredor-vivo/instagram" },
  { label: "LinkedIn", href: "https://example.com/corredor-vivo/linkedin" },
];

const email = "contacto@corredorvivo.example";
const linkClassName = "inline-flex items-center gap-2 rounded-sm text-sm text-emerald-50 underline-offset-4 hover:text-white hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white";

export function MarketplaceFooter() {
  return (
    <footer className="rounded-2xl bg-emerald-700 px-6 py-8 text-white md:px-8">
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-2">
          <p className="text-lg font-bold">Corredor Vivo</p>
          <p className="text-sm text-emerald-50">Conectando o campo ao mercado.</p>
        </div>

        <div className="space-y-3">
          <h2 className="text-sm font-semibold">Redes sociais</h2>
          <ul className="space-y-2">
            {socialLinks.map(({ label, href }) => (
              <li key={label}>
                <a href={href} target="_blank" rel="noopener noreferrer" className={linkClassName}>
                  <ExternalLink className="h-4 w-4" aria-hidden="true" />
                  {label}
                  <span className="sr-only"> (abre numa nova aba)</span>
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-3">
          <h2 className="text-sm font-semibold">Contacto</h2>
          <a href={`mailto:${email}`} className={`${linkClassName} break-all`}>
            <Mail className="h-4 w-4 shrink-0" aria-hidden="true" />
            {email}
          </a>
        </div>

        <div className="space-y-3">
          <h2 className="text-sm font-semibold">Informações legais</h2>
        </div>
      </div>

      <p className="mt-8 border-t border-white/20 pt-5 text-sm text-emerald-50">
        © {new Date().getFullYear()} Corredor Vivo. Todos os direitos reservados.
      </p>
    </footer>
  );
}