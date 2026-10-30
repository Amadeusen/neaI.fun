import { GameScreen } from "@/components/game/GameScreen";
import { gameMetadata } from "@/games/metadata";
import ClickSprint from "@/games/click-sprint/Game";
import { manifest } from "@/games/click-sprint/manifest";
import { ClickSprintTitle } from "@/games/click-sprint/Title";

export const metadata = gameMetadata(manifest);

export default function ClickSprintPage() {
  return (
    <GameScreen manifest={manifest} title={<ClickSprintTitle />}>
      <ClickSprint />
    </GameScreen>
  );
}
