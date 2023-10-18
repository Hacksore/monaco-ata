import Editor from "@monaco-editor/react";
import { setupTypeAcquisition } from '@typescript/ata';
import ts from 'typescript';
import * as monacoType from 'monaco-editor';

type CompilerOptions = import("monaco-editor").languages.typescript.CompilerOptions
export const USER_CODE_PATH = 'file:///user.ts';

// https://github.com/microsoft/TypeScript-Website/blob/652934679e6d0a46f75bb33677bb81f9eee17ed0/packages/sandbox/src/compilerOptions.ts#L10
const settings: CompilerOptions = {
  strict: true,
  noUncheckedIndexedAccess: true,
  target: monacoType.languages.typescript.ScriptTarget.ES2017,
  lib: ['es2015', 'dom', 'dom.iterable', 'esnext'],
  declaration: true,
  experimentalDecorators: true,
  emitDecoratorMetadata: true,
  moduleResolution:
    monacoType.languages.typescript.ModuleResolutionKind.NodeJs,
  module: monacoType.languages.typescript.ModuleKind.ESNext,
  jsx: monacoType.languages.typescript.JsxEmit.React,
  esModuleInterop: true,
  allowNonTsExtensions: true,
}

function App() {
  return (
    <Editor
      language="typescript"
      height="80vh"
      theme="vs-dark"
      onMount={(editor, monaco) => {
        monaco.languages.typescript.typescriptDefaults.setCompilerOptions(settings);

        // this works
        monaco.languages.typescript.typescriptDefaults.addExtraLib(
          'type Ligma = "balls"',
        );

        const ata = setupTypeAcquisition({
          projectName: "test-ts-ata",
          typescript: ts,
          delegate: {
            receivedFile: (code: string, path: string) => {

              if (path.endsWith(".d.ts")) {

                const fileUrl = `file://${path}`;
                console.log("ATA received file", fileUrl);
                monaco.languages.typescript.typescriptDefaults.addExtraLib(
                  code,
                );
              }

              // monaco.editor.createModel("", "typescript");
            },
          },
        });

        editor.getModel()?.onDidChangeContent(() => {
          ata(editor.getValue());
        });
      }}
      defaultValue={`import { isEven } from "is-even"`}
    />
  )
}

export default App;
