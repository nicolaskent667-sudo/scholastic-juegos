import type { ReactNode } from "react";
import BirdSprite from "@/components/sprites/BirdSprite";
import ChickSprite from "@/components/sprites/ChickSprite";
import DogSprite from "@/components/sprites/DogSprite";
import {
  CatSprite,
  DuckSprite,
  LizardSprite,
  PenguinSprite,
  RabbitSprite,
  SheepSprite,
} from "@/components/sprites/animals";
import {
  AppleSprite,
  BackpackSprite,
  BasketSprite,
  BookSprite,
  ButterflySprite,
  CloudSprite,
  FlowerSprite,
  HeartSprite,
  LampSprite,
  PawSprite,
  PencilSprite,
  RulerSprite,
  StarSprite,
  StrawberrySprite,
  SunSprite,
  YarnSprite,
} from "@/components/sprites/objects";

/**
 * Cada carta del memotest a su dibujo. Las variantes del nivel experto son el
 * mismo sprite con props distintas, no arte nueva.
 */
const ART: Record<string, ReactNode> = {
  // Nivel fácil
  sieni: <DogSprite />,
  gato: <CatSprite />,
  azulejo: <BirdSprite motion={false} />,
  pato: <DuckSprite />,
  pinguino: <PenguinSprite />,
  lagartija: <LizardSprite />,
  conejito: <RabbitSprite />,
  pollito: <ChickSprite />,
  ovejita: <SheepSprite />,
  ovillo: <YarnSprite />,
  farol: <LampSprite />,

  // Nivel difícil
  libro: <BookSprite />,
  lapiz: <PencilSprite />,
  mochila: <BackpackSprite />,
  regla: <RulerSprite />,
  manzana: <AppleSprite />,
  frutilla: <StrawberrySprite />,
  canasta: <BasketSprite />,
  flor: <FlowerSprite />,
  sol: <SunSprite />,
  nube: <CloudSprite />,
  estrella: <StarSprite />,
  corazon: <HeartSprite />,
  mariposa: <ButterflySprite />,
  huella: <PawSprite />,
  "sieni-graduada": <DogSprite cap bow={null} />,
  "azulejo-volador": <BirdSprite motion={false} flying />,

  // Nivel experto
  "sieni-mono-rosa": <DogSprite bow="rosa" />,
  "sieni-mono-azul": <DogSprite bow="azul" />,
  "sieni-mono-amarillo": <DogSprite bow="amarillo" />,
  "sieni-sin-mono": <DogSprite bow={null} />,
  "sieni-guino": <DogSprite wink />,
  "sieni-lentes": <DogSprite glasses />,
  "sieni-birrete": <DogSprite cap bow={null} />,
  "sieni-collar": <DogSprite pendant="estrella" />,
  "azulejo-izquierda": <BirdSprite motion={false} facing="left" />,
  "azulejo-derecha": <BirdSprite motion={false} facing="right" />,
  "azulejo-volando": <BirdSprite motion={false} flying />,
  "azulejo-flor": <BirdSprite motion={false} flower />,
  "pollito-simple": <ChickSprite />,
  "pollito-mono": <ChickSprite bow />,
  "pollito-lentes": <ChickSprite glasses />,
  "pollito-guino": <ChickSprite wink />,
};

export function cardArt(id: string): ReactNode {
  return ART[id] ?? null;
}
