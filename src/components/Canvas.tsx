"use client";
import { useRef, useLayoutEffect } from "react";
import Game from "@/Game/Game";
import useStore from "@/store/store.index";
import Loading from "@/shared/Loading";
import GameUI from "./GameUI";

export default function Canvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isLoadingOver = useStore.use.isLoadingOver();

  useLayoutEffect(() => {
    async function startGame() {
      if (!canvasRef.current) return;
      const editor = Game.GetInstance();
      try {
        await editor.init(canvasRef.current);
      } catch (error) {
        Game.ClearInstance();
        console.error(error);
      }
    }
    void startGame();

    return () => Game.ClearInstance();
  }, []);

  return (
    <main className="z-10 h-screen min-h-screen w-full select-none">
      <div
        id="canvas-container"
        className="max-h-screen overflow-hidden opacity-100"
      >
        <canvas
          id="canvas"
          ref={canvasRef}
          className="h-screen w-full outline-none"
          style={{ transition: "transform 0.1s linear" }}
        />
        {isLoadingOver ? (
          <>
            <GameUI />
          </>
        ) : (
          <Loading />
        )}
      </div>
    </main>
  );
}
