import React, { useEffect, useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { socket } from "..";
import { EventEnum, SocketEventTypes, TSquare } from "../types";

interface ICanvasProps {
  squares: Record<string, TSquare>;
  setSquares: React.Dispatch<React.SetStateAction<Record<string, TSquare>>>;
}

const FILL_COLOR = "#FF8DA1";

export const Canvas: React.FC<ICanvasProps> = ({ squares, setSquares }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [dragId, setDragId] = useState<string | null>(null);

  useEffect(() => {
    const ctx = canvasRef.current!.getContext("2d")!;

    const resize = () => {
      ctx.canvas.width = window.innerWidth - 400;
      ctx.canvas.height = window.innerHeight;
      drawSquares();
    };

    window.addEventListener("resize", resize);
    resize();

    return () => window.removeEventListener("resize", resize);
  }, [squares]);

  const drawSquares = () => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    Object.values(squares).forEach((sq) => {
      ctx.fillStyle = FILL_COLOR;
      ctx.fillRect(sq.x, sq.y, sq.size, sq.size);
    });
  };

  useEffect(drawSquares, [squares]);

  useEffect(() => {
    const canvas = canvasRef.current!;

    const onDoubleClick = (e: MouseEvent) => {
      console.log('IN ON DB')
      const size = 100;
      const newSq: TSquare = {
        id: uuidv4(),
        x: e.offsetX - size / 2,
        y: e.offsetY - size / 2,
        size,
      };
      // отправляем на сервер
      socket.emit(SocketEventTypes.newEvent, {
        type: EventEnum.created,
        payload: newSq,
      });
    };

    const onMouseDown = (e: MouseEvent) => {
      for (const [id, sq] of Object.entries(squares)) {
        if (
          e.offsetX >= sq.x &&
          e.offsetX <= sq.x + sq.size &&
          e.offsetY >= sq.y &&
          e.offsetY <= sq.y + sq.size
        ) {
          setDragId(id);
          break;
        }
      }
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!dragId) return;
      setSquares((prev) => {
        const next = { ...prev };
        const sq = { ...next[dragId] };
        sq.x = e.offsetX - sq.size / 2;
        sq.y = e.offsetY - sq.size / 2;
        next[dragId] = sq;
        return next;
      });
    };

    const onMouseUp = () => {
      if (!dragId) return;
      socket.emit(SocketEventTypes.newEvent, {
        type: EventEnum.moved,
        payload: squares[dragId],
      });
      setDragId(null);
    };

    canvas.addEventListener("dblclick", onDoubleClick);
    canvas.addEventListener("mousedown", onMouseDown);
    canvas.addEventListener("mousemove", onMouseMove);
    canvas.addEventListener("mouseup", onMouseUp);
    return () => {
      canvas.removeEventListener("mousedown", onMouseDown);
      canvas.removeEventListener("mousemove", onMouseMove);
      canvas.removeEventListener("mouseup", onMouseUp);
      canvas.removeEventListener("dblclick", onDoubleClick);
    };
  }, [squares, dragId, setSquares]);

  return (
    <canvas
      ref={canvasRef}
      //   width={2000}
      //   height={1000}
      style={{ border: "1px solid #ccc" }}
    />
  );
};
