import Editor from "@monaco-editor/react";
import { setupTypeAcquisition } from '@typescript/ata';
import ts from 'typescript';

export const USER_CODE_PATH = 'file:///user.ts';

function App() {
  return (
    <Editor
      language="typescript"
      height="80vh"
      theme="vs-dark"
      onMount={(editor, monaco) => {
        monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
          strict: true,
          noUncheckedIndexedAccess: true,
          target: monaco.languages.typescript.ScriptTarget.ESNext,
          lib: ['es2015', 'dom', 'dom.iterable', 'esnext'],
          moduleResolution:
            monaco.languages.typescript.ModuleResolutionKind.NodeJs,
          module: monaco.languages.typescript.ModuleKind.ESNext,
          allowNonTsExtensions: true,
        });

        // this works
        monaco.languages.typescript.typescriptDefaults.addExtraLib(
          'type Ligma = "balls"',
        );

        const ata = setupTypeAcquisition({
          projectName: "test-ts-ata",
          typescript: ts,
          delegate: {
            receivedFile: (code: string, path: string) => {
              const fileUrl = `file://${path}`;

              console.log("ATA received file", fileUrl );
              monaco.languages.typescript.typescriptDefaults.addExtraLib(
                code,
              );

              // monaco.editor.createModel("", "typescript");
            },
          },
        });

        editor.getModel()?.onDidChangeContent(() => {
          ata(editor.getValue());
        });
      }}
      defaultValue={`import React from "react"`}
    />
  )
}

export default App;
