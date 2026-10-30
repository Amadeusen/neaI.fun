import { GameScreen } from "@/components/game/GameScreen";
import { gameMetadata } from "@/games/metadata";
import ColorMatch from "@/games/color-match/Game";
import { manifest } from "@/games/color-match/manifest";
import { ColorMatchTitle } from "@/games/color-match/Title";

export const metadata = gameMetadata(manifest);

export default function ColorMatchPage() {
  return (
    <GameScreen manifest={manifest} title={<ColorMatchTitle />}>
      <ColorMatch />
    </GameScreen>
  );
}
