/// <reference types="vite/client" />

interface ImportMeta {
  compileTime: <T>(id: string) => T;
}
