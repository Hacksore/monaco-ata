import Editor from "@monaco-editor/react";
import { setupTypeAcquisition } from '@typescript/ata';
import ts from 'typescript';
import * as monacoType from 'monaco-editor';

type CompilerOptions = import("monaco-editor").languages.typescript.CompilerOptions
export const USER_CODE_PATH = 'file:///user.ts';

const CODE = `import isGif from "is-gif"`;
// https://github.com/microsoft/TypeScript-Website/blob/652934679e6d0a46f75bb33677bb81f9eee17ed0/packages/sandbox/src/compilerOptions.ts#L10
const settings: CompilerOptions = {
  strict: true,
  allowJs: true,
  checkJs: true,
  noUncheckedIndexedAccess: true,
  target: monacoType.languages.typescript.ScriptTarget.ESNext,
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

        const model = monaco.editor.createModel(
          CODE,
          "typescript",
          monaco.Uri.parse(USER_CODE_PATH)
        );

        const ata = setupTypeAcquisition({
          projectName: "test-ts-ata",
          typescript: ts,
          delegate: {
            receivedFile: (code: string, _path: string) => {
              const path = `file://${_path}`;
              if (_path.endsWith(".d.ts")) {
                monaco.languages.typescript.typescriptDefaults.addExtraLib(
                  code,
                  path
                );

                // const uri = monaco.Uri.file(_path);
                // if (monaco.editor.getModel(uri) === null) {
                //   monaco.editor.createModel(code, "typescript", uri)
                // }
                console.log(`[ATA] Adding ${path} to runtime`, {
                  code
                });
              }
            },
          },
        });

        editor.getModel()?.onDidChangeContent(() => {
          ata(editor.getValue());

          editor.setModel(model);
        });
      }}
      defaultValue={CODE}
    />
  )
}

export default App;
