/// <reference types="vite/client" />

declare module '*?worker' {
  const workerConstructor: {
    new (): Worker;
  };
  export default workerConstructor;
}

declare module 'monaco-editor/editor/editor.worker?worker' {
  const workerConstructor: {
    new (): Worker;
  };
  export default workerConstructor;
}

declare module 'monaco-editor/language/typescript/ts.worker?worker' {
  const workerConstructor: {
    new (): Worker;
  };
  export default workerConstructor;
}
