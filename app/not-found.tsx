import Link from 'next/link';
import { Estrela } from '@/components/Logo';
import Section from '@/components/Section';

export default function NotFound() {
  return (
    <Section surface="charcoal" padding="none" texture>
      <div className="shell relative flex min-h-[86svh] flex-col items-center justify-center py-block text-center">
        <div className="radiance flex flex-col items-center">
          <Estrela size={28} className="text-[color:var(--s-accent)]" />
          <h1 className="display mt-9 text-d2">Esta página se despediu.</h1>
          <p className="lede mt-6 max-w-prose">
            Talvez o endereço tenha mudado. Você pode voltar ao início ou ver o catálogo completo.
          </p>
          <div className="mt-11 flex flex-wrap justify-center gap-3">
            <Link href="/" className="btn btn-solid">
              Início
            </Link>
            <Link href="/catalogo" className="btn btn-outline">
              Catálogo
            </Link>
          </div>
        </div>
      </div>
    </Section>
  );
}
