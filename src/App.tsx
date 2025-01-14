import { createSignal } from "solid-js";
import { css } from "styled-system/css";

function App() {
  const [count, setCount] = createSignal(0);

  return (
    <>
      <h1>Vite + Solid</h1>
      <div class={css({ bg: "zinc.400" })}>
        <button
          type="button"
          class={css({ fontSize: "2xl" })}
          onClick={() => setCount((count) => count + 1)}
        >
          count is {count()}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p class="read-the-docs">
        Click on the Vite and Solid logos to learn more
      </p>
    </>
  );
}

export default App;
