import useStore from "@/store/store.index";
import D20 from "./D20";

export default class DiceManager {
  private currentDice: D20 | null = null;

  roll() {
    const { roll, setMessage, remainingChance } = useStore.getState();

    if (this.currentDice !== null)
      return setMessage("wait until dice stop moving");
    if (remainingChance <= 0)
      return setMessage("your 3 chance is over restart game");

    roll();
    this.currentDice = new D20();
  }

  restart() {
    const { resetScore } = useStore.getState();
    if (this.currentDice !== null) this.currentDice.dispose();
    resetScore();
  }
}
