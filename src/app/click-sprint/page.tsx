import { GameScreen } from "@/components/game/GameScreen";
import { gameMetadata } from "@/games/metadata";
import ClickSprint from "@/games/click-sprint/Game";
import { manifest } from "@/games/click-sprint/manifest";

export const metadata = gameMetadata(manifest);

export default function ClickSprintPage() {
  return (
    <GameScreen manifest={manifest}>
      <ClickSprint />
    </GameScreen>
  );
}
