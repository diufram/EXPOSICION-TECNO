import './style.css';
import * as monaco from 'monaco-editor';
import editorWorker from 'monaco-editor/editor/editor.worker?worker';
import tsWorker from 'monaco-editor/language/typescript/ts.worker?worker';
import {
  createIcons,
  Zap,
  ShieldCheck,
  Terminal,
  Target,
  FileCode2,
  Play,
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  Layers,
  Cpu,
  Sparkles,
  RefreshCw,
  ArrowRight,
  ArrowLeft,
  Sun,
  Moon,
} from 'lucide';
import {
  executeRawJavaScript,
  analyzeTypeScriptSourceCode,
  playgroundPresetCollection,
  CodeDiagnostic,
  RuntimeExecutionResult,
} from './playground-engine';

// Configurar workers de Monaco para Vite
(self as unknown as { MonacoEnvironment: { getWorker: (workerId: string, label: string) => Worker } }).MonacoEnvironment = {
  getWorker(_: string, label: string): Worker {
    if (label === 'typescript' || label === 'javascript') {
      return new tsWorker();
    }
    return new editorWorker();
  },
};

function renderLucideIcons(): void {
  createIcons({
    icons: {
      Zap,
      ShieldCheck,
      Terminal,
      Target,
      FileCode2,
      Play,
      CheckCircle2,
      AlertCircle,
      AlertTriangle,
      Layers,
      Cpu,
      Sparkles,
      RefreshCw,
      ArrowRight,
      ArrowLeft,
      Sun,
      Moon,
    },
  });
}

renderLucideIcons();

import { typescript } from 'monaco-editor';

typescript.typescriptDefaults.setDiagnosticsOptions({
  noSemanticValidation: false,
  noSyntaxValidation: false,
});

typescript.typescriptDefaults.setCompilerOptions({
  target: typescript.ScriptTarget.ESNext,
  allowNonTsExtensions: true,
  moduleResolution: typescript.ModuleResolutionKind.NodeJs,
  module: typescript.ModuleKind.CommonJS,
  noEmit: true,
  strict: true,
  strictNullChecks: true,
  noImplicitAny: true,
});

typescript.javascriptDefaults.setDiagnosticsOptions({
  noSemanticValidation: true,
  noSyntaxValidation: false,
});

// Temas de Monaco (Oscuro cálido y Claro cálido)
monaco.editor.defineTheme('warm-stone-dark', {
  base: 'vs-dark',
  inherit: true,
  rules: [
    { token: 'comment', foreground: '78716c', fontStyle: 'italic' },
    { token: 'keyword', foreground: 'fb7185', fontStyle: 'bold' },
    { token: 'type', foreground: '38bdf8' },
    { token: 'string', foreground: '86efac' },
    { token: 'number', foreground: 'fb923c' },
    { token: 'identifier', foreground: 'f5f5f4' },
    { token: 'delimiter', foreground: 'a8a29e' },
  ],
  colors: {
    'editor.background': '#0f0d0c',
    'editor.foreground': '#f5f5f4',
    'editorCursor.foreground': '#38bdf8',
    'editor.lineHighlightBackground': '#1c1917',
    'editorLineNumber.foreground': '#57534e',
    'editorLineNumber.activeForeground': '#a8a29e',
    'editor.selectionBackground': '#292524',
    'editorWidget.background': '#1c1917',
    'editorWidget.border': '#292524',
  },
});

monaco.editor.defineTheme('warm-stone-light', {
  base: 'vs',
  inherit: true,
  rules: [
    { token: 'comment', foreground: '78716c', fontStyle: 'italic' },
    { token: 'keyword', foreground: 'e11d48', fontStyle: 'bold' },
    { token: 'type', foreground: '0284c7' },
    { token: 'string', foreground: '16a34a' },
    { token: 'number', foreground: 'ea580c' },
    { token: 'identifier', foreground: '1c1917' },
    { token: 'delimiter', foreground: '78716c' },
  ],
  colors: {
    'editor.background': '#f9f8f6',
    'editor.foreground': '#1c1917',
    'editorCursor.foreground': '#0284c7',
    'editor.lineHighlightBackground': '#f0eeec',
    'editorLineNumber.foreground': '#a8a29e',
    'editorLineNumber.activeForeground': '#44403c',
    'editor.selectionBackground': '#cbd5e1',
    'editorWidget.background': '#ffffff',
    'editorWidget.border': '#d6d3d1',
  },
});

let activeTheme: 'dark' | 'light' = (localStorage.getItem('tecnoweb-theme') as 'dark' | 'light') || 'dark';

function applyTheme(theme: 'dark' | 'light'): void {
  activeTheme = theme;
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('tecnoweb-theme', theme);

  const monacoThemeName = theme === 'light' ? 'warm-stone-light' : 'warm-stone-dark';
  monaco.editor.setTheme(monacoThemeName);

  const themeToggleBtn = document.getElementById('theme-toggle-btn');
  if (themeToggleBtn) {
    themeToggleBtn.innerHTML = theme === 'light'
      ? '<i data-lucide="moon"></i><span>Oscuro</span>'
      : '<i data-lucide="sun"></i><span>Claro</span>';
    renderLucideIcons();
  }
}

const themeToggleBtn = document.getElementById('theme-toggle-btn');
if (themeToggleBtn) {
  themeToggleBtn.addEventListener('click', () => {
    const nextTheme = activeTheme === 'dark' ? 'light' : 'dark';
    applyTheme(nextTheme);
  });
}

let currentStepIndex = 0;

function switchToSection(targetStepIndex: number): void {
  if (targetStepIndex < 0 || targetStepIndex > 3) return;
  currentStepIndex = targetStepIndex;

  const sections = document.querySelectorAll<HTMLElement>('.presentation-section');
  const stepButtons = document.querySelectorAll<HTMLButtonElement>('.step-btn');

  sections.forEach((sec, idx) => {
    sec.classList.toggle('active', idx === targetStepIndex);
  });

  stepButtons.forEach((btn, idx) => {
    btn.classList.toggle('active', idx === targetStepIndex);
  });

  if (targetStepIndex === 3) {
    setTimeout(() => {
      jsEditor.layout();
      tsEditor.layout();
    }, 60);
  }

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

document.querySelectorAll<HTMLButtonElement>('.step-btn').forEach((btn) => {
  btn.addEventListener('click', () => {
    const step = Number(btn.dataset.step);
    switchToSection(step);
  });
});

document.querySelectorAll<HTMLButtonElement>('.next-step-btn').forEach((btn) => {
  btn.addEventListener('click', () => {
    const nextStep = Number(btn.dataset.next);
    switchToSection(nextStep);
  });
});

document.querySelectorAll<HTMLButtonElement>('.prev-step-btn').forEach((btn) => {
  btn.addEventListener('click', () => {
    const prevStep = Number(btn.dataset.prev);
    switchToSection(prevStep);
  });
});

window.addEventListener('keydown', (event) => {
  if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
    return;
  }
  if (event.key === 'ArrowRight' && currentStepIndex < 3) {
    switchToSection(currentStepIndex + 1);
  } else if (event.key === 'ArrowLeft' && currentStepIndex > 0) {
    switchToSection(currentStepIndex - 1);
  }
});

const presetButtonsContainer = document.getElementById('preset-buttons-container') as HTMLDivElement;
const jsContainer = document.getElementById('js-monaco-editor') as HTMLElement;
const tsContainer = document.getElementById('ts-monaco-editor') as HTMLElement;

const runLiveJavaScriptButton = document.getElementById('btn-run-js-live') as HTMLButtonElement;
const runLiveTypeScriptButton = document.getElementById('btn-run-ts-live') as HTMLButtonElement;
const liveJavaScriptConsole = document.getElementById('js-live-console-output') as HTMLDivElement;
const liveTypeScriptConsole = document.getElementById('ts-live-console-output') as HTMLDivElement;
const tsTermBadge = document.getElementById('ts-term-badge') as HTMLElement;

const initialPreset = playgroundPresetCollection[0];
let activePresetIdentifier = initialPreset.identifier;

const jsModelUri = monaco.Uri.parse('file:///demo-javascript.js');
const tsModelUri = monaco.Uri.parse('file:///demo-typescript.ts');

const jsModel = monaco.editor.createModel(initialPreset.javascriptCode, 'javascript', jsModelUri);
const tsModel = monaco.editor.createModel(initialPreset.typescriptCode, 'typescript', tsModelUri);

const commonEditorOptions: monaco.editor.IStandaloneEditorConstructionOptions = {
  theme: activeTheme === 'light' ? 'warm-stone-light' : 'warm-stone-dark',
  fontSize: 13,
  fontFamily: "'Fira Code', Menlo, Monaco, 'Courier New', monospace",
  fontLigatures: true,
  lineNumbers: 'on',
  minimap: { enabled: false },
  scrollBeyondLastLine: false,
  automaticLayout: true,
  tabSize: 2,
  wordWrap: 'on',
  renderLineHighlight: 'all',
  overviewRulerBorder: false,
  fixedOverflowWidgets: true,
  scrollbar: {
    vertical: 'auto',
    horizontal: 'auto',
    verticalScrollbarSize: 8,
    horizontalScrollbarSize: 8,
  },
};

const jsEditor = monaco.editor.create(jsContainer, {
  ...commonEditorOptions,
  model: jsModel,
});

const tsEditor = monaco.editor.create(tsContainer, {
  ...commonEditorOptions,
  model: tsModel,
});

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function renderNodeTerminal(result?: RuntimeExecutionResult, codeContent?: string): void {
  if (!result) {
    liveJavaScriptConsole.innerHTML = `
      <div class="term-line term-prompt"><span class="term-cwd">~/proyecto</span> <span class="term-dollar">$</span> <span class="term-cmd">node demo.js</span></div>
      <div class="term-line term-dim">Presiona 'node demo.js' para ejecutar el script...</div>
    `;
    return;
  }

  if (result.isSuccess) {
    const logsHtml = result.outputLogs.length > 0
      ? result.outputLogs.map((log: string) => `<div class="term-line term-stdout">${escapeHtml(log)}</div>`).join('')
      : '<div class="term-line term-dim">(Script finalizado sin salida en consola)</div>';

    liveJavaScriptConsole.innerHTML = `
      <div class="term-line term-prompt"><span class="term-cwd">~/proyecto</span> <span class="term-dollar">$</span> <span class="term-cmd">node demo.js</span></div>
      ${logsHtml}
    `;
  } else {
    const sourceLines = (codeContent || '').split('\n');
    const errLine = result.errorLine || 1;
    const errCol = result.errorColumn || 1;
    const codeLineText = sourceLines[errLine - 1] || '';
    const pointerSpaces = ' '.repeat(Math.max(0, errCol - 1));

    liveJavaScriptConsole.innerHTML = `
      <div class="term-line term-prompt"><span class="term-cwd">~/proyecto</span> <span class="term-dollar">$</span> <span class="term-cmd">node demo.js</span></div>
      <div class="term-line term-file">/workspace/demo.js:${errLine}</div>
      <div class="term-line term-code-snippet"><span class="term-gutter">${errLine}</span> ${escapeHtml(codeLineText)}</div>
      <div class="term-line term-squiggle-line"><span class="term-gutter"> </span> ${pointerSpaces}^</div>
      <div class="term-line term-blank"></div>
      <div class="term-line term-error-head">TypeError: ${escapeHtml(result.runtimeError || 'Runtime error')}</div>
      <div class="term-line term-dim">    at Object.&lt;anonymous&gt; (/workspace/demo.js:${errLine}:${errCol})</div>
      <div class="term-line term-dim">    at Module._compile (node:internal/modules/cjs/loader:1376:14)</div>
    `;
  }
}

function renderTypeScriptTerminal(diagnostics: CodeDiagnostic[], sourceCode: string): void {
  if (diagnostics.length > 0) {
    if (tsTermBadge) {
      tsTermBadge.textContent = String(diagnostics.length);
      tsTermBadge.style.display = 'inline-block';
    }

    const sourceLines = sourceCode.split('\n');
    const diagBlocks = diagnostics.map((diag) => {
      const lineIdx = diag.line - 1;
      const lineText = sourceLines[lineIdx] || '';
      let col = 1;
      let tokenLen = 8;

      if (diag.highlightToken && lineText.includes(diag.highlightToken)) {
        col = lineText.indexOf(diag.highlightToken) + 1;
        tokenLen = diag.highlightToken.length;
      } else {
        const firstNonSpace = lineText.search(/\S/);
        col = firstNonSpace !== -1 ? firstNonSpace + 1 : 1;
      }

      const indent = ' '.repeat(Math.max(0, col - 1));
      const squiggles = '~'.repeat(Math.max(2, tokenLen));

      return `
        <div class="term-line term-error-head"><span class="term-file">demo.ts</span>:<span class="term-num">${diag.line}</span>:<span class="term-num">${col}</span> - <span class="term-error-code">error ${diag.errorCode}</span>: ${escapeHtml(diag.message)}</div>
        <div class="term-line term-blank"></div>
        <div class="term-line term-code-snippet"><span class="term-gutter">${diag.line}</span> ${escapeHtml(lineText)}</div>
        <div class="term-line term-squiggle-line"><span class="term-gutter"> </span> ${indent}<span class="term-error-code">${squiggles}</span></div>
      `;
    }).join('<div class="term-line term-blank"></div>');

    liveTypeScriptConsole.innerHTML = `
      <div class="term-line term-prompt"><span class="term-cwd">~/proyecto</span> <span class="term-dollar">$</span> <span class="term-cmd">npx tsc --noEmit</span></div>
      ${diagBlocks}
      <div class="term-line term-blank"></div>
      <div class="term-line term-summary">Found ${diagnostics.length} error${diagnostics.length > 1 ? 's' : ''} in demo.ts:${diagnostics[0].line}</div>
    `;
  } else {
    if (tsTermBadge) {
      tsTermBadge.style.display = 'none';
    }

    const executionResult = executeRawJavaScript(sourceCode);
    const logsHtml = executionResult.outputLogs.length > 0
      ? executionResult.outputLogs.map((log: string) => `<div class="term-line term-stdout">${escapeHtml(log)}</div>`).join('')
      : '<div class="term-line term-stdout">Compilacion e integracion exitosa.</div>';

    liveTypeScriptConsole.innerHTML = `
      <div class="term-line term-prompt"><span class="term-cwd">~/proyecto</span> <span class="term-dollar">$</span> <span class="term-cmd">npx tsc --noEmit</span></div>
      <div class="term-line term-success">[tsc] Compiled successfully. Found 0 errors.</div>
      <div class="term-line term-blank"></div>
      <div class="term-line term-prompt"><span class="term-cwd">~/proyecto</span> <span class="term-dollar">$</span> <span class="term-cmd">node dist/demo.js</span></div>
      ${logsHtml}
    `;
  }
}

function updateDiagnosticsDisplay(): CodeDiagnostic[] {
  const monacoMarkers = monaco.editor.getModelMarkers({ resource: tsModelUri });
  const errorMarkers = monacoMarkers.filter((m) => m.severity === monaco.MarkerSeverity.Error);
  const fallbackDiagnostics = analyzeTypeScriptSourceCode(tsModel.getValue());

  const diagnosticsToDisplay: CodeDiagnostic[] = errorMarkers.length > 0
    ? errorMarkers.map((marker) => {
        let codeString = 'TS_ERROR';
        if (typeof marker.code === 'object' && marker.code !== null) {
          codeString = marker.code.value;
        } else if (marker.code) {
          codeString = String(marker.code).startsWith('TS') ? String(marker.code) : `TS${marker.code}`;
        }
        return {
          errorCode: codeString,
          line: marker.startLineNumber,
          message: marker.message,
          severity: 'error' as const,
        };
      })
    : fallbackDiagnostics;

  renderTypeScriptTerminal(diagnosticsToDisplay, tsModel.getValue());
  return diagnosticsToDisplay;
}

monaco.editor.onDidChangeMarkers((uris) => {
  const isTsAffected = uris.some((u) => u.toString() === tsModelUri.toString());
  if (isTsAffected) {
    updateDiagnosticsDisplay();
  }
});

tsModel.onDidChangeContent(() => {
  updateDiagnosticsDisplay();
});

function loadPresetByIdentifier(presetIdentifier: string): void {
  activePresetIdentifier = presetIdentifier;
  const targetPreset = playgroundPresetCollection.find((p) => p.identifier === presetIdentifier);
  if (!targetPreset) return;

  jsModel.setValue(targetPreset.javascriptCode);
  tsModel.setValue(targetPreset.typescriptCode);

  renderNodeTerminal();
  updateDiagnosticsDisplay();

  const allPresetButtons = presetButtonsContainer.querySelectorAll<HTMLButtonElement>('.preset-btn');
  allPresetButtons.forEach((btn) => {
    btn.classList.toggle('active', btn.dataset.presetId === presetIdentifier);
  });
}

playgroundPresetCollection.forEach((preset) => {
  const presetButton = document.createElement('button');
  presetButton.className = `preset-btn ${preset.identifier === activePresetIdentifier ? 'active' : ''}`;
  presetButton.dataset.presetId = preset.identifier;
  presetButton.innerHTML = `
    <i data-lucide="file-code-2"></i>
    <span>${preset.title}</span>
  `;
  presetButton.addEventListener('click', () => {
    loadPresetByIdentifier(preset.identifier);
  });
  presetButtonsContainer.appendChild(presetButton);
});

runLiveJavaScriptButton.addEventListener('click', () => {
  const codeContent = jsEditor.getValue();
  const executionResult = executeRawJavaScript(codeContent);
  renderNodeTerminal(executionResult, codeContent);
});

runLiveTypeScriptButton.addEventListener('click', () => {
  updateDiagnosticsDisplay();
});

applyTheme(activeTheme);
renderNodeTerminal();
updateDiagnosticsDisplay();
