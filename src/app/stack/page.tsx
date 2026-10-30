import { GameScreen } from "@/components/game/GameScreen";
import { gameMetadata } from "@/games/metadata";
import Stack from "@/games/stack/Game";
import { manifest } from "@/games/stack/manifest";
import { StackTitle } from "@/games/stack/Title";

export const metadata = gameMetadata(manifest);

export default function StackPage() {
  return (
    <GameScreen manifest={manifest} title={<StackTitle />}>
      <Stack />
    </GameScreen>
  );
}
