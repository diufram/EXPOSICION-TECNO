export interface CodeDiagnostic {
  errorCode: string;
  line: number;
  message: string;
  severity: 'error' | 'warning';
  highlightToken?: string;
}

export interface RuntimeExecutionResult {
  isSuccess: boolean;
  outputLogs: string[];
  executionTimeMs: number;
  runtimeError?: string;
  errorLine?: number;
  errorColumn?: number;
  errorToken?: string;
}

export function executeRawJavaScript(codeString: string): RuntimeExecutionResult {
  const capturedLogs: string[] = [];
  const originalConsoleLog = console.log;
  const executionStartTime = performance.now();

  try {
    console.log = (...args: unknown[]) => {
      capturedLogs.push(
        args
          .map((arg) => (typeof arg === 'object' ? JSON.stringify(arg) : String(arg)))
          .join(' ')
      );
    };

    const dynamicFunctionRunner = new Function(codeString);
    const returnedValue = dynamicFunctionRunner();

    if (returnedValue !== undefined) {
      capturedLogs.push(`Retorno: ${String(returnedValue)}`);
    }

    const executionEndTime = performance.now();

    return {
      isSuccess: true,
      outputLogs: capturedLogs,
      executionTimeMs: Math.round((executionEndTime - executionStartTime) * 100) / 100,
    };
  } catch (error) {
    const executionEndTime = performance.now();
    const errMessage = (error as Error).message || String(error);
    const sourceLines = codeString.split('\n');
    let errorLine = 1;
    let errorColumn = 1;
    let errorToken = '';

    const readingPropertyMatch = errMessage.match(/reading '([^']+)'/);
    if (readingPropertyMatch) {
      errorToken = readingPropertyMatch[1];
      const matchLineIndex = sourceLines.findIndex((line) => line.includes(`.${errorToken}`));
      if (matchLineIndex !== -1) {
        errorLine = matchLineIndex + 1;
        errorColumn = sourceLines[matchLineIndex].indexOf(`.${errorToken}`) + 2;
      }
    } else {
      const isNotDefinedMatch = errMessage.match(/([a-zA-Z0-9_$]+) is not defined/);
      if (isNotDefinedMatch) {
        errorToken = isNotDefinedMatch[1];
        const matchLineIndex = sourceLines.findIndex((line) => line.includes(errorToken));
        if (matchLineIndex !== -1) {
          errorLine = matchLineIndex + 1;
          errorColumn = sourceLines[matchLineIndex].indexOf(errorToken) + 1;
        }
      }
    }

    return {
      isSuccess: false,
      outputLogs: capturedLogs,
      executionTimeMs: Math.round((executionEndTime - executionStartTime) * 100) / 100,
      runtimeError: errMessage,
      errorLine,
      errorColumn,
      errorToken,
    };
  } finally {
    console.log = originalConsoleLog;
  }
}

export function analyzeTypeScriptSourceCode(sourceCode: string): CodeDiagnostic[] {
  const detectedDiagnostics: CodeDiagnostic[] = [];
  const sourceLines = sourceCode.split('\n');

  sourceLines.forEach((lineText, zeroBasedIndex) => {
    const currentLineNumber = zeroBasedIndex + 1;
    const trimmedLine = lineText.trim();

    const typoInPedidoPropertyMatch = trimmedLine.match(/\.direcion\s*=/);
    if (typoInPedidoPropertyMatch) {
      detectedDiagnostics.push({
        errorCode: 'TS2339',
        line: currentLineNumber,
        severity: 'error',
        message: "Property 'direcion' does not exist on type 'Pedido'. Did you mean 'direccion'?",
        highlightToken: 'direcion',
      });
    }

    const functionPassingStringAsNumberMatch = trimmedLine.match(/\(([^,()]+),\s*(['"`][^'"`]*['"`])\)/);
    if (
      functionPassingStringAsNumberMatch &&
      (trimmedLine.includes('calcularTotal') || trimmedLine.includes('calculateTotal'))
    ) {
      detectedDiagnostics.push({
        errorCode: 'TS2345',
        line: currentLineNumber,
        severity: 'error',
        message: "Argument of type 'string' is not assignable to parameter of type 'number'.",
        highlightToken: functionPassingStringAsNumberMatch[2],
      });
    }

    const invalidEstadoMatch = trimmedLine.match(/procesarEstado\((['"`]pagado['"`])\)/);
    if (invalidEstadoMatch) {
      detectedDiagnostics.push({
        errorCode: 'TS2345',
        line: currentLineNumber,
        severity: 'error',
        message: "Argument of type '\"pagado\"' is not assignable to parameter of type 'EstadoPedido'. Did you mean '\"PAGADO\"'?",
        highlightToken: invalidEstadoMatch[1],
      });
    }

    const undefinedNavigationMatch = trimmedLine.match(/pedido\.envio\.codigoPostal/);
    if (undefinedNavigationMatch && !trimmedLine.includes('?.') && !trimmedLine.includes('if')) {
      detectedDiagnostics.push({
        errorCode: 'TS18048',
        line: currentLineNumber,
        severity: 'error',
        message: "'pedido.envio' is possibly 'undefined'. Use optional chaining '?.' to safely access it.",
        highlightToken: 'envio.codigoPostal',
      });
    }

    const numberAssignedStringMatch = trimmedLine.match(/:\s*number\s*=\s*(['"`][^'"`]*['"`])/);
    if (numberAssignedStringMatch) {
      detectedDiagnostics.push({
        errorCode: 'TS2322',
        line: currentLineNumber,
        severity: 'error',
        message: "Type 'string' is not assignable to type 'number'.",
        highlightToken: numberAssignedStringMatch[1],
      });
    }

    const typoInCustomerPropertyMatch = trimmedLine.match(/\.([a-zA-Z_$][a-zA-Z0-9_$]*)\s*=/);
    if (typoInCustomerPropertyMatch && sourceCode.includes('CustomerAccount')) {
      const propertyName = typoInCustomerPropertyMatch[1];
      const validCustomerProperties = ['accountId', 'fullName', 'emailAddress', 'shippingAddress', 'postalCode'];
      if (!validCustomerProperties.includes(propertyName)) {
        detectedDiagnostics.push({
          errorCode: 'TS2339',
          line: currentLineNumber,
          severity: 'error',
          message: `Property '${propertyName}' does not exist on type 'CustomerAccount'.`,
          highlightToken: propertyName,
        });
      }
    }
  });

  return detectedDiagnostics;
}

export interface PlaygroundPresetTemplate {
  identifier: string;
  title: string;
  javascriptCode: string;
  typescriptCode: string;
}

export const playgroundPresetCollection: PlaygroundPresetTemplate[] = [
  {
    identifier: 'order-contract',
    title: '1. Contratos y Typos',
    javascriptCode: `const pedido = {
  cliente: "Carlos Gomez",
  direccion: "Av. Principal 456",
  total: 250
};

// Typo: JS crea propiedad fantasma sin avisar
pedido.direcion = "Calle Central 789";

console.log("Cliente:", pedido.cliente);
console.log("Direccion original:", pedido.direccion);
console.log("Propiedad con typo:", pedido.direcion);`,
    typescriptCode: `interface Pedido {
  cliente: string;
  direccion: string;
  total: number;
}

const pedido: Pedido = {
  cliente: "Carlos Gomez",
  direccion: "Av. Principal 456",
  total: 250
};

// ERROR: typo 'direcion' -> cambiar a 'direccion'
pedido.direcion = "Calle Central 789";

console.log("Pedido confirmado:", pedido.cliente);`,
  },
  {
    identifier: 'parameters-calculation',
    title: '2. Parametros y Calculos',
    javascriptCode: `function calcularTotal(precio, envio) {
  return precio + envio;
}

// JS concatena texto: 100 + "15" = "10015"
const totalCobrado = calcularTotal(100, "15");

console.log("Total calculado en JS:", totalCobrado);
console.log("Tipo obtenido en JS:", typeof totalCobrado);`,
    typescriptCode: `function calcularTotal(precio: number, envio: number): number {
  return precio + envio;
}

// ERROR: string "15" -> cambiar a numero 15
const totalCobrado = calcularTotal(100, "15");

console.log("Total validado:", totalCobrado);`,
  },
  {
    identifier: 'state-unions',
    title: '3. Control de Estados',
    javascriptCode: `function procesarEstado(estado) {
  if (estado === "PAGADO") {
    return "Pedido despachado a logistica";
  } else if (estado === "CANCELADO") {
    return "Reembolso bancario emitido";
  }
  return "Estado desconocido o no contemplado";
}

// JS no avisa minusculas; caera en default
const resultado = procesarEstado("pagado");
console.log("Resultado en JS:", resultado);`,
    typescriptCode: `type EstadoPedido = "PAGADO" | "CANCELADO" | "PENDIENTE";

function procesarEstado(estado: EstadoPedido): string {
  if (estado === "PAGADO") {
    return "Pedido despachado a logistica";
  } else if (estado === "CANCELADO") {
    return "Reembolso bancario emitido";
  }
  return "Pedido en espera de pago";
}

// ERROR: "pagado" -> cambiar a "PAGADO"
const resultado = procesarEstado("pagado");
console.log("Resultado TS:", resultado);`,
  },
  {
    identifier: 'undefined-protection',
    title: '4. Proteccion ante Undefined',
    javascriptCode: `const pedido = {
  id: "PED-9801",
  cliente: "Mariana Silva"
};

// JS colapsa en runtime: envio es undefined
const codigoPostal = pedido.envio.codigoPostal;
console.log("Codigo postal de entrega:", codigoPostal);`,
    typescriptCode: `interface PedidoConEnvio {
  id: string;
  cliente: string;
  envio?: {
    codigoPostal: string;
  };
}

const pedido: PedidoConEnvio = {
  id: "PED-9801",
  cliente: "Mariana Silva"
};

// ERROR: 'envio' opcional -> usar '?.' (pedido.envio?.codigoPostal)
const codigoPostal = pedido.envio.codigoPostal;
console.log("Codigo postal:", codigoPostal);`,
  },
];
