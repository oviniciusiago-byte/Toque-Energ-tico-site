// Declarações de módulos não-JS (o TypeScript 6 exige para imports com efeito colateral).
declare module '*.css';
declare module '*.svg' {
  const conteudo: string;
  export default conteudo;
}
