import { haptics } from "@/lib/haptics";
import { sfx } from "@/lib/sfx";
import type { DropOutcome } from "./rules";

/** Sound and vibration for each kind of drop; `height` is the new layer index. */
export function dropFeedback(kind: DropOutcome["kind"], height: number, streak: number) {
  switch (kind) {
    case "place":
      sfx.place(height);
      haptics.light();
      break;
    case "perfect":
      sfx.perfect(streak);
      haptics.medium();
      break;
    case "grow":
      sfx.perfect(streak);
      sfx.grow();
      haptics.medium();
      break;
    case "miss":
      sfx.fail();
      haptics.heavy();
      break;
  }
}
