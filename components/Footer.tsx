import Link from 'next/link';
import Star from '@/components/Star';
import Section from '@/components/Section';
import { nav, navSecundaria, site } from '@/content/site';
import { categoriasVisiveis } from '@/content/categorias';
import { wppLink, wppMsg } from '@/lib/whatsapp';

export default function Footer() {
  const ano = new Date().getFullYear();

  return (
    <Section as="footer" surface="olive" padding="none" texture>
      {/* assinatura */}
      <div className="shell relative pb-block-sm pt-block">
        <div className="flex flex-col items-center gap-6 text-center">
          <Star size={28} className="text-[color:var(--s-accent)]" />
          <p className="display text-d2 text-balance">{site.assinatura}</p>
          <p className="body max-w-prose-sm">{site.descricao}</p>
        </div>

        <div className="rule my-block-sm" />

        <div className="grid gap-10 sm:grid-cols-3">
          <div>
            <h2 className="label">Navegar</h2>
            <ul className="mt-6 flex flex-col gap-3">
              {[...nav, ...navSecundaria].map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="link-quiet font-sans text-[0.9rem] text-[color:var(--s-muted)]"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="label">Catálogo</h2>
            <ul className="mt-6 flex flex-col gap-3">
              {categoriasVisiveis.map((c) => (
                <li key={c.slug}>
                  <Link
                    href={`/catalogo/${c.slug}`}
                    className="link-quiet font-sans text-[0.9rem] text-[color:var(--s-muted)]"
                  >
                    {c.nomeCurto ?? c.nome}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="label">Contato</h2>
            <ul className="mt-6 flex flex-col gap-3 font-sans text-[0.9rem] text-[color:var(--s-muted)]">
              <li>
                <a
                  href={wppLink(wppMsg.geral)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-quiet"
                >
                  WhatsApp
                </a>
              </li>
              <li>
                <a
                  href={site.instagram.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-quiet"
                >
                  Instagram {site.instagram.handle}
                </a>
              </li>
              <li>{site.cidade}</li>
            </ul>
          </div>

          {/*
            Cadastro de e-mail oculto até existir backend — a marca pediu para
            não expor um formulário que não funciona. Para reativar: recolocar
            <Newsletter /> aqui e conectar o serviço de e-mail.
          */}
        </div>

        <div className="rule my-block-sm" />

        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="label-quiet">
            © {ano} {site.nome}
          </p>
          <p className="font-sans text-[0.72rem] leading-relaxed text-[color:var(--s-faint)]">
            Produtos artesanais de autocuidado. Não substituem acompanhamento profissional.
          </p>
        </div>
      </div>
    </Section>
  );
}
