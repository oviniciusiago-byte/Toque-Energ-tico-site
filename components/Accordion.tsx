'use client';

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useId, useState, type ReactNode } from 'react';

interface Item {
  pergunta: string;
  resposta: ReactNode;
}

/** Acordeão animado e acessível — FAQ e detalhes de produto. */
export default function Accordion({
  itens,
  abertoInicial = -1,
  numerado = false,
  tamanho = 'grande',
}: {
  itens: readonly Item[];
  abertoInicial?: number;
  numerado?: boolean;
  tamanho?: 'grande' | 'medio';
}) {
  const [aberto, setAberto] = useState(abertoInicial);
  const reduzido = useReducedMotion();
  const base = useId();

  return (
    <div className="border-t" style={{ borderColor: 'var(--s-line)' }}>
      {itens.map((item, i) => {
        const ativo = aberto === i;
        const idPainel = `${base}-painel-${i}`;
        const idBotao = `${base}-botao-${i}`;
        return (
          <div key={i} className="border-b" style={{ borderColor: 'var(--s-line)' }}>
            <h3>
              <button
                type="button"
                id={idBotao}
                aria-expanded={ativo}
                aria-controls={idPainel}
                onClick={() => setAberto(ativo ? -1 : i)}
                className="flex w-full items-start justify-between gap-6 py-6 text-left transition-colors duration-500 hover:text-[color:var(--s-accent)]"
              >
                <span className="flex items-baseline gap-4">
                  {numerado ? (
                    <span className="label-quiet tnum shrink-0">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                  ) : null}
                  <span
                    className={
                      tamanho === 'grande'
                        ? 'display text-d4'
                        : 'font-sans text-[0.78rem] uppercase tracking-[0.18em]'
                    }
                  >
                    {item.pergunta}
                  </span>
                </span>

                <span aria-hidden="true" className="relative mt-2 block h-3 w-3 shrink-0">
                  <span className="absolute left-0 top-1/2 block h-px w-3 bg-current" />
                  <span
                    className={`absolute left-1/2 top-0 block h-3 w-px bg-current transition-transform duration-700 ease-calm ${
                      ativo ? 'scale-y-0' : 'scale-y-100'
                    }`}
                  />
                </span>
              </button>
            </h3>

            <AnimatePresence initial={false}>
              {ativo && (
                <motion.div
                  id={idPainel}
                  role="region"
                  aria-labelledby={idBotao}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: reduzido ? 0.15 : 0.65, ease: [0.22, 1, 0.36, 1] }}
                  className="overflow-hidden"
                >
                  <div className="body max-w-prose pb-7">{item.resposta}</div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
