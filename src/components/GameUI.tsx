import Editor from "@/Editor/Editor";
import useStore from "@/store/store.index";

export default function UI() {
  const score = useStore.use.score();
  const totalScore = useStore.use.totalScore();
  const remainingChance = useStore.use.remainingChance();
  const message = useStore.use.message();

  const onRoll = () => Editor.GetInstance().diceManager.roll();
  const onRestart = () => Editor.GetInstance().diceManager.restart();

  return (
    <div className="fixed top-4 left-2 w-40 bg-white p-2 rounded-2xl shadow">
      <p>{message}</p>
      <p> Score = {score} </p>
      <p> total Score = {totalScore} </p>
      <p> remaining roll = {remainingChance} </p>
      <button className="btn" onClick={onRoll}>
        Roll
      </button>
      <button className="btn" onClick={onRestart}>
        Restart
      </button>
    </div>
  );
}
