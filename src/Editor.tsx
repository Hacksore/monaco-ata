import Editor from "@monaco-editor/react";
import { setupTypeAcquisition } from "@typescript/ata";
import ts from "typescript";
import * as monacoType from "monaco-editor";

type CompilerOptions =
  import("monaco-editor").languages.typescript.CompilerOptions;
export const USER_CODE_PATH = "file:///user.ts";

// https://github.com/microsoft/TypeScript-Website/blob/652934679e6d0a46f75bb33677bb81f9eee17ed0/packages/sandbox/src/compilerOptions.ts#L10
const settings: CompilerOptions = {
  strict: true,
  allowJs: true,
  checkJs: true,
  noUncheckedIndexedAccess: true,
  target: monacoType.languages.typescript.ScriptTarget.ESNext,
  lib: ["es2015", "dom", "dom.iterable", "esnext"],
  declaration: true,
  experimentalDecorators: true,
  emitDecoratorMetadata: true,
  moduleResolution: monacoType.languages.typescript.ModuleResolutionKind.NodeJs,
  module: monacoType.languages.typescript.ModuleKind.ESNext,
  jsx: monacoType.languages.typescript.JsxEmit.React,
  esModuleInterop: true,
  allowNonTsExtensions: true,
};

export const CodeEditor = ({ namespace, code }) => {
  return (
    <Editor
      defaultPath={namespace}
      language="typescript"
      height="40vh"
      theme="vs-dark"
      onMount={async (editor, monaco) => {
        monaco.languages.typescript.typescriptDefaults.setCompilerOptions(
          settings,
        );

        if (monaco.editor.getModel(namespace) === null) {
          const model = monaco.editor.createModel(
            code,
            "typescript",
            monaco.Uri.parse(namespace),
          );

          editor.setModel(model);
        }

        const getTsWorker =
          await monaco.languages.typescript.getTypeScriptWorker();
        const tsWorker = await getTsWorker(monaco.Uri.parse(namespace));

        editor.getModel()?.onDidChangeContent(async () => {
          const mm = monaco.editor.getModel(monaco.Uri.parse(namespace));
          if (!mm) return null;

          const testErrors = await Promise.all([
            tsWorker.getSemanticDiagnostics(namespace),
            tsWorker.getSyntacticDiagnostics(namespace),
            tsWorker.getCompilerOptionsDiagnostics(namespace),
          ] as const);

          console.log(testErrors);
        });
      }}
      defaultValue={code}
    />
  );
};
