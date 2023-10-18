import { CodeEditor } from "./Editor";

function App() {
  return (
    // make its flex vertical split
    <div style={{ display: "flex", flexDirection: "column" }}>
      <CodeEditor code="type Foo = number"  namespace="file:///user.ts"/>
      <CodeEditor code="const a: Foo = 'cringe'" namespace="file:///test.ts"/>
    </div>
  );
}

export default App;
