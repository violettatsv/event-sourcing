import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { socket } from ".";
import "./App.css";
import { Canvas } from "./components/Canvas";
import { HistoryPanel } from "./components/HistoryPanel";
import { SocketEventTypes, TSquare, TVersion } from "./types";

function App() {
  const [squares, setSquares] = useState<Record<string, TSquare>>({});
  const [versions, setVersions] = useState<TVersion[]>([]);

  useEffect(() => {
    console.log('IN USE EFFECT')
    socket.on(SocketEventTypes.connect, () => {
      socket.emit(SocketEventTypes.getStateAt, null);
    });

    socket.on(SocketEventTypes.stateUpdate, setSquares);
    socket.on(SocketEventTypes.versionList, setVersions);
    socket.on(SocketEventTypes.stateAt, ({ state }) => {
      setSquares(state);
    });

    socket.on(SocketEventTypes.backendError, (err: any) => {
      toast.error(`Ошибка от сервера: ${err.message || err}`);
    });

    return () => {
      socket.off(SocketEventTypes.stateUpdate);
      socket.off(SocketEventTypes.versionList);
      socket.off(SocketEventTypes.stateAt);
      socket.off(SocketEventTypes.backendError);
    };
  }, []);

  return (
    <div className="App">
      <div
        style={{
          display: "flex",
          height: "100vh",
          width: "100vw",
          boxSizing: "border-box",
        }}
      >
        <Canvas squares={squares} setSquares={setSquares}/>
        <HistoryPanel versions={versions} />
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          pauseOnHover
        />
      </div>
    </div>
  );
}

export default App;
