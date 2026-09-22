# Scholastic · Juegos

Tres juegos web para chicos, encadenados uno detrás del otro, construidos sobre la ilustración
"Picnic de Amigos". Hechos con Next.js, React y TypeScript.

## Los niveles

| # | Juego | Cómo se juega |
|---|---|---|
| 1 | **Rompecabezas** | La ilustración se corta en una grilla y las piezas aparecen mezcladas en una bandeja. Se arrastran al tablero hasta reconstruir la escena. Tres dificultades: 3×3, 4×4 y 5×5. |
| 2 | **Vuelo** | Estilo Flappy Bird. El pajarito aletea con cada toque y hay que cruzar la luz que queda entre los dos faroles de cada poste. Tres corazones, estrellas para juntar y 15 faroles hasta ganar. |
| 3 | **Sopa de letras** | Nueve mundos ordenados por dificultad, de palabras de 3 letras hasta LAGARTIJA y PRIMAVERA. Se arrastra sobre la grilla para marcar cada palabra. |

Se avanza con el botón "Siguiente juego" de cada pantalla de victoria. La pantalla inicial también
tiene atajos para entrar directo a cualquier nivel.

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
    GameShell.tsx        decide qué nivel se ve
    Puzzle*.tsx          nivel 1
    flappy/              nivel 2
    wordsearch/          nivel 3
    ui/buttons.ts        estilos de botón compartidos
  hooks/
    usePointerDrag.ts    arrastre de las piezas del rompecabezas
    useFlappyEngine.ts   bucle de animación del nivel 2
    useCellSelection.ts  selección de letras del nivel 3
  lib/
    puzzle.ts            recorte de piezas y mezcla
    flappy.ts            física, colisiones y generación de faroles
    wordsearch.ts        mundos, generador de tableros y validación
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
