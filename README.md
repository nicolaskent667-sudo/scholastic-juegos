# Scholastic · Juegos

Tres juegos web para chicos, encadenados uno detrás del otro, construidos sobre la ilustración
"Picnic de Amigos". Hechos con Next.js, React y TypeScript.

## Los juegos

| Juego | Cómo se juega |
|---|---|
| **Rompecabezas** | La ilustración se corta en una grilla y las piezas aparecen mezcladas en una bandeja. Se arrastran al tablero hasta reconstruir la escena. |
| **Vuelo** | Estilo Flappy Bird. El pajarito aletea con cada toque y hay que cruzar la luz que queda entre los dos faroles de cada poste, con tres corazones y estrellas para juntar. |
| **Sopa de letras** | Nueve mundos ordenados por dificultad, de palabras de 3 letras hasta LAGARTIJA y PRIMAVERA. Se arrastra sobre la grilla para marcar cada palabra. |
| **Memotest** | Tres niveles: con nombre y color propio, con el mismo fondo, y sin nombres con variantes mínimas del mismo personaje. |

## El mapa

Desde "Jugar" se entra a la campaña: cuatro mundos, uno por juego, con **27 niveles y 81
estrellas** en total. Cada mundo es un mapa con un sendero serpenteante donde los niveles se van
desbloqueando de a uno.

Las tres estrellas de cada nivel salen del desempeño, y cada juego mide lo suyo: piezas puestas
fuera de lugar, corazones que sobraron, pistas usadas, intentos de más. Terminar siempre da al
menos una y desbloquea el nivel siguiente, así que nunca se traba el avance.

El botón **"Juego libre"** de la portada lleva a los juegos sueltos, con sus propios selectores de
dificultad y sin campaña.

## Arrancar

Hace falta [Node.js](https://nodejs.org) 20 o más nuevo.

```bash
npm install
npm run dev
```

Y abrir <http://localhost:3000>.

```bash
npm run build     # build de producción
npm run lint      # eslint
npx tsc --noEmit  # chequeo de tipos
```

## Cómo está organizado

```
src/
  app/                   layout, página y estilos globales
  components/
    GameShell.tsx        decide qué pantalla se ve
    map/                 selector de mundos, mapa de niveles y CampaignPlayer
    start/               portada, opciones y logros
    sprites/             personajes y objetos SVG, compartidos
    Puzzle*.tsx          rompecabezas
    flappy/              vuelo
    wordsearch/          sopa de letras
    memo/                memotest
    ui/buttons.ts        estilos de botón compartidos
  hooks/
    usePointerDrag.ts    arrastre de las piezas del rompecabezas
    useFlappyEngine.ts   bucle de animación del vuelo
    useCellSelection.ts  selección de letras de la sopa
    useProgress.ts       logros, estrellas y preferencias
  lib/
    campaign.ts          mundos, niveles y reglas de estrellas
    mapPath.ts           posiciones de los nodos y el sendero
    puzzle.ts            recorte de piezas y mezcla
    flappy.ts            física, colisiones y generación de faroles
    wordsearch.ts        mundos, generador de tableros y validación
    memo.ts              cartas y armado del mazo
    progress*.ts         persistencia en localStorage
```

Toda la lógica de juego vive en `src/lib/` como funciones puras, sin React ni DOM, separada de los
componentes que la dibujan.

## Algunas decisiones

- **Los tres juegos usan Pointer Events**, nunca la HTML5 Drag & Drop API, que no dispara en
  pantallas táctiles. Además del arrastre, los tres se pueden jugar tocando o con el teclado.
- **El nivel 2 no re-renderiza durante la partida**: el bucle escribe los `transform` de los nodos
  SVG por refs, y la física corre con un paso fijo para que no dependa del framerate.
- **Las escenas del nivel 2 y las mascotas del nivel 3 son SVG dibujado a mano**, no imágenes.
- El generador de sopas de letras reintenta desde cero cuando una palabra no entra. Se verificó con
  2700 generaciones (300 por mundo) sin fallas.

## Créditos

La ilustración `scholastic_sieni_picnic_amigos.png` es material de clase y no es de mi autoría.
