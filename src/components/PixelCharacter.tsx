import { Character } from "@/types";
import { characterImages } from "@/data/images";
const maps: Record<Character, string[]> = {
  dog: [
    "................",
    "...bb.....bb....",
    "..bccb...bccb...",
    "..bcccccccccb...",
    "..bckcccckccb...",
    "..bccccnccccb...",
    "...bcccccccb....",
    "....rrrrrrr.....",
    "...bcccccccb..bb",
    "..bccccccccb.bcb",
    "..bccccccccbbccb",
    "...bbccccccbbb..",
    "...bb..bb..bb...",
  ],
  sparrow: [
    "................",
    ".......bbbb.....",
    ".....bbccccb....",
    "....bcccckccb...",
    "...bccccccccbyy.",
    "...bccwwwcccb...",
    "..bbccwwwwccb...",
    "bbbcccwwwwwb....",
    ".bbbccwwwwb.....",
    "....bbbbbb......",
    ".....y..y.......",
  ],
  phoenix: [
    ".....r...r......",
    "....ror.rr......",
    "....rooor.......",
    ".....oyor.......",
    "....roykor......",
    "....royyyrr.....",
    "rr..royor..rr...",
    ".rorroyyyrror...",
    "..royyyyyor.....",
    "...royyyor......",
    "....roror.......",
    "...rooroor......",
    "..roor.roor.....",
    ".rrr....rrr.....",
  ],
  dragon: [
    "...y.....y......",
    "...gy...yg......",
    "..rrggggggr.....",
    ".rggwggwgggr....",
    "..ggkggkggg.....",
    "...gggyygggg....",
    "....rrrggg.gr...",
    ".......ggg..gr..",
    "..gg...ggg..gr..",
    ".grgg..ggg.gr...",
    ".gg.gg.ggggr....",
    "..gg.gggggr.....",
    "...ggggggr......",
    "....g..g........",
  ],
};
export function PixelCharacter({
  kind,
  className = "",
}: {
  kind: Character;
  className?: string;
}) {
  if (characterImages[kind])
    return (
      <img
        className={`pixel ${className}`}
        src={characterImages[kind]}
        alt=""
      />
    );
  const palette: Record<string, string> = {
    b: "#715440",
    c: "#e2c49c",
    k: "#25201e",
    n: "#382925",
    r: "#bf4030",
    o: "#ec7a35",
    y: "#edbb57",
    w: "#fff4df",
    g: "#547b59",
  };
  return (
    <svg
      className={`pixel ${className}`}
      viewBox="0 0 16 16"
      aria-hidden="true"
      shapeRendering="crispEdges"
    >
      {maps[kind].flatMap((row, y) =>
        [...row].map((v, x) =>
          v === "." ? null : (
            <rect
              key={`${x}-${y}`}
              x={x}
              y={y}
              width="1"
              height="1"
              fill={palette[v]}
            />
          ),
        ),
      )}
    </svg>
  );
}
