# Componente `Beneficios`

Exibe o panorama de benefícios do usuário a partir do último holerite analisado.

## Props

```ts
interface BeneficiosProps {
  userStatus: "PJ" | "CLT" | "Autônomo" | "Aposentado" | string;
  beneficios: {
    tipo: string;
    detectado: boolean;
    comentario: string;
    actionLink: string;
  }[];
  onSimularPacote?: () => void; // Callback opcional para abrir simulador
}
```

## Uso

```tsx
import Beneficios from "@/components/beneficios/Beneficios";

<Beneficios
  userStatus="CLT"
  beneficios={beneficiosDoBackend}
  onSimularPacote={() => setShowSimulador(true)}
/>
```

## Estrutura

1. **Sua Situação de Benefícios**: badge de status, contagem e frase-resumo.
2. **Tabela**: resumo de cada benefício (detectado ou não) + link de ação.
3. **Aprenda com o PIM**: cards de conteúdo educativo.
4. **Agir**: CTA para “Simular Pacote Ideal” e “Guia das Empresas de Benefícios”.

## Acessibilidade

- Cores com contraste AA.
- `aria-label` nos ícones de ajuda.

## Dependências

- `@/components/ui/*` (shadcn/ui)
- `lucide-react`

## Testes

Exemplo básico com React Testing Library:

```tsx
import { render, screen } from "@testing-library/react";
import Beneficios from "@/components/beneficios/Beneficios";

it("mostra resumo sem benefícios", () => {
  render(<Beneficios userStatus="PJ" beneficios={[]} />);
  expect(screen.getByText(/não possui benefícios/i)).toBeInTheDocument();
});
``` 