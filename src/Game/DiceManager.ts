import useStore from "@/store/store.index";
import D20 from "./D20";

export default class DiceManager {
  private currentDice: D20 | null = null;
  private isRollingOver = true;

  roll() {
    const { roll, setMessage, remainingChance } = useStore.getState();

    if (!this.isRollingOver) return setMessage("wait until dice stop moving");

    if (remainingChance <= 0)
      return setMessage("your 3 chance is over restart game");

    roll();

    if (this.currentDice) this.currentDice.dispose();
    this.currentDice = new D20(this.onFinish.bind(this));
    this.isRollingOver = false;
  }

  restart() {
    const { resetScore } = useStore.getState();
    if (this.currentDice !== null) this.currentDice.dispose();
    resetScore();
  }

  onFinish(score: number) {
    const { setScore } = useStore.getState();
    setScore(score);
    this.isRollingOver = true;
  }
}
