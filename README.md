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
| **Unir colores** | Tubos que conectan pares de puntos hasta llenar el tablero, al estilo Flow. |
| **Mezclar tubos** | Water sort: volcar porciones de color hasta dejar cada tubo de un solo color. |
| **Sacar flechas** | Cada flecha sale hacia donde apunta si nada se le cruza. Hay que sacarlas todas sin chocar para liberar a Sieni. |

## El mapa

Desde "Jugar" se entra a la campaña: siete mundos, uno por juego, con **51 niveles y 153
estrellas** en total. Cada mundo es un mapa con un sendero serpenteante donde los niveles se van
desbloqueando de a uno.

Las tres estrellas de cada nivel salen del desempeño, y cada juego mide lo suyo: piezas puestas
fuera de lugar, corazones que sobraron, pistas usadas, intentos de más. Terminar siempre da al
menos una y desbloquea el nivel siguiente, así que nunca se traba el avance.

Todo se juega desde el mapa. Los selectores sueltos de cada juego (dificultad del rompecabezas,
mundos de la sopa, niveles del memotest) siguen en el código pero ya no tienen acceso desde la
interfaz.

## La tienda

Desde la portada se entra a la tienda, donde las estrellas de la campaña sirven para vestir a
Sieni: tres accesorios (sombrero, anteojos y barbijo, combinables entre sí), tres vestuarios
(vestido, malla y traje de Papá Noel) y tres amigos que se paran a su lado. Los amigos además piden
haber terminado un mundo.

Los nueve suman 150 estrellas, así que la campaña completa alcanza para todo. El saldo no se guarda:
es lo ganado menos lo comprado, y comprar no le baja estrellas a ningún nivel. Lo que tiene puesto
se ve en la portada, en el mapa y en "Sacar flechas".

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
    flow/                unir colores
    tubes/               mezclar tubos
    shop/                la tienda
    arrows/              sacar flechas
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
    flow.ts              tableros de unir colores y validacion
    tubes.ts             niveles de mezclar tubos y reglas de volcado
    shop.ts              catálogo de la tienda, saldo y candados
    arrows.ts            niveles de sacar flechas, choques y validación
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
