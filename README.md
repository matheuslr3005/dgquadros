# D.G. de Quadros · Site

Site institucional da **D.G. de Quadros Terraplanagem e Transportes** (Canoas/RS), construído a partir do
*Plano de Ação de Marca e Marketing*: paleta (Amarelo Máquina `#F5B700`, Grafite `#1C1D1F`, Areia `#F2EFE8`,
Terra `#8C5A2B`), tipografia (Barlow Condensed + Barlow), símbolo de degraus e selo da porca "DG".

## Stack

- React 18 + TypeScript + Vite
- **Three.js** via `@react-three/fiber` / `drei` — todas as máquinas são modeladas por código (sem arquivos 3D)
- **GSAP** (ScrollTrigger, SplitText) + **Lenis** (scroll suave) + **motion** (transições de UI)

## Rodar

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # typecheck + build de produção em dist/
npm run preview
```

## O que tem no site

| Seção | O que acontece |
| --- | --- |
| Preloader | Porca girando + degraus subindo enquanto o 3D carrega |
| Hero | Escavadeira 3D cavando em loop, poeira ao tocar o chão, parallax pelo mouse, clique = nova escavada |
| Serviços | Cards com tilt 3D e spotlight; o botão pré-seleciona o serviço no orçamento |
| Frota | Visualizador 3D arrastável: retroescavadeira, escavadeira, trator de esteira, rolo, caçamba |
| Terraplanagem | Seção "pinada": ao rolar, o trator nivela o terreno 3D (Antes → Durante → Depois) |
| Como funciona | 4 passos em escada (o símbolo da marca) |
| Onde atuamos | Radar animado centrado em Canoas + link para o mapa |
| Orçamento | Formulário que monta a mensagem ao vivo e abre o WhatsApp do Danilo ou do Jr. |
| Instagram | Reprodução do feed de lançamento (6 posts em xadrez) |

Respeita `prefers-reduced-motion`, funciona sem WebGL (mostra aviso no lugar do 3D) e pausa o render 3D fora da tela.

## Onde editar

- `src/lib/contacts.ts` — telefones, endereço, Instagram, domínio
- `src/data/services.ts` — serviços e opções do orçamento
- `src/data/fleet.ts` — textos de cada máquina da frota
- `src/sections/*` — copy de cada seção
- `src/three/machines/*` — modelos 3D

## Para confirmar antes de publicar

- `@dgdequadros` e `dgdequadros.com.br` foram tirados do mockup do plano — conferir se são os definitivos.
- Textos de "Como funciona", descrições dos serviços e da frota são redação nova a partir do plano — revisar com o Danilo e o Jr.
- O site ainda não tem fotos/vídeos reais. Depois do dia de gravação, dá para trocar as cenas 3D (ou complementá-las) por vídeo de obra no hero e fotos da frota.
- Avaliações do Google: o plano cita prova social como diferencial dos concorrentes; ainda não há avaliações da D.G. para exibir, então nenhuma foi inventada.
