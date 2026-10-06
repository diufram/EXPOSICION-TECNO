# Guia Maestra de Exposicion: TypeScript vs JavaScript (TECNOWEB)

**Materia:** TECNOWEB  
**Duracion sugerida:** 5 a 7 minutos  
**Objetivo:** Brindar una presentacion fluida, solida y profesional que explique el origen de TypeScript, sus diferencias con JavaScript, sus bondades en la industria y culmine con un caso practico interactivo de deteccion de errores.

---

## Estructura de la Exposicion

| Tiempo | Seccion | Accion en la Aplicacion Web |
| :--- | :--- | :--- |
| **0:00 - 1:00** | 1. ¿Que es TypeScript? | Pestaña **"1. ¿Que es TypeScript?"** |
| **1:00 - 2:15** | 2. Diferencias con JavaScript | Pestaña **"2. Diferencias con JS"** |
| **2:15 - 3:30** | 3. Bondades del Lenguaje | Pestaña **"3. Bondades del Lenguaje"** |
| **3:30 - 6:00** | 4. Caso Practico | Pestaña **"4. Caso Practico"** |
| **6:00 - 7:00** | 5. Conclusion y Cierre | Resumen de impacto y preguntas |

> **Tip de manejo en la exposicion:** Puedes avanzar de seccion haciendo clic en las pestañas superiores, usando los botones **"Continuar"** al pie de cada tarjeta o presionando las **flechas izquierda / derecha** del teclado.

---

## Guion Paso a Paso para el Expositor

### Paso 1: ¿Que es TypeScript? (Minuto 0:00 a 1:00)

* **Que dices al iniciar:**
  > "Buenas tardes profesor y compañeros. Hoy vamos a analizar **TypeScript vs JavaScript**: por que nacio este lenguaje, que problemas resuelve en el desarrollo web moderno y por que se ha convertido en el estandar de la industria."

* **Puntos clave a señalar en pantalla:**
  1. **Es un Superset Tipado:**
     > "TypeScript fue creado por Microsoft y liderado por Anders Hejlsberg (el mismo creador de C#). No busca reemplazar a JavaScript, sino construir una capa de tipos estaticos sobre el. Esto significa que **todo codigo JavaScript valido es codigo TypeScript valido**."
  2. **El Proceso de Transpilacion:**
     > "Navegadores como Chrome o Firefox y motores como Node.js ejecutan unicamente JavaScript. El compilador de TypeScript (`tsc`) analiza el codigo en tiempo de desarrollo y luego lo transpila a JavaScript estandar y limpio."
  3. **Cero Costo en Tiempo de Ejecucion:**
     > "Los tipos existen unicamente en nuestro editor. Al compilar para produccion, los tipos se eliminan por completo, por lo que la aplicacion final corre a la maxima velocidad nativa de JavaScript sin sobrecarga."

---

### Paso 2: ¿En que se diferencian en el dia a dia? (Minuto 1:00 a 2:15)

* **Avanza a la pestaña 2:** Haz clic en **"Continuar a Diferencias con Codigo"** (o presiona flecha derecha).

* **Que dices frente a las tarjetas comparativas con codigo:**
  > "Veamoslo de forma muy simple con tres situaciones cotidianas al programar:"
  
  1. **Cambiar numero por texto (Señala la tarjeta 1):**
     > "Miren el primer ejemplo: en JavaScript guardamos `edad = 'veinte'` y no nos dice nada, lo que puede arruinar una cuenta mas adelante. En TypeScript, el editor no te deja mezclar texto con numeros y te avisa al instante."
  2. **¿Cuando descubres los errores? (Señala la tarjeta 2):**
     > "En el segundo caso: si un dato viene vacio (`null`), en JavaScript la aplicacion se cuelga cuando el usuario final ya la esta usando. En TypeScript, el editor te subraya en rojo el error mientras estas escribiendo el codigo, antes de publicar."
  3. **Ayuda al escribir - Autocompletado (Señala la tarjeta 3):**
     > "Y en el tercer caso: en JavaScript tienes que acordarte de memoria como se llamaba cada dato. En TypeScript, apenas pones el punto (`pedido.`), el editor te despliega la lista con las opciones exactas para que no te equivoques."

---

### Paso 3: Las 4 Grandes Bondades de TypeScript (Minuto 2:15 a 3:30)

* **Avanza a la pestaña 3:** Haz clic en **"Ver las Bondades con Codigo"**.

* **Que dices al recorrer las 4 tarjetas comparativas:**
  > "Veamos ahora las 4 grandes ventajas que convirtieron a TypeScript en el estandar de la industria, tambien comparando que pasa en JavaScript frente a TypeScript:"
  
  1. **Modelos Claros (Señala la tarjeta 1):** *"A la izquierda, en JavaScript cada programador puede inventar nombres distintos como 'nom' o 'nombre'. A la derecha, con TypeScript la interfaz fija los campos obligatorios para todo el equipo."*
  2. **Escribir mas rapido con sugerencias (Señala la tarjeta 2):** *"En JavaScript no hay sugerencias y perdemos tiempo buscando en otros archivos. En TypeScript, el editor te autocompleta las opciones exactas con un solo clic."*
  3. **Modificar codigo sin romper el proyecto (Señala la tarjeta 3):** *"En JavaScript renombrar una propiedad en un sistema grande da miedo porque puede romper partes ocultas. En TypeScript, el compilador te marca en rojo exactamente que archivos debes actualizar."*
  4. **Evitar fallas en calculos (Señala la tarjeta 4):** *"En JavaScript, si sumamos `'100' + 20` se unen como texto dando `'10020'`. En TypeScript, el compilador nos detiene de inmediato antes de que el cobro erroneo llegue al usuario."*

---

### Paso 4: Caso Practico - Deteccion de Errores (Minuto 3:30 a 6:00)

* **Avanza a la pestaña 4:** Haz clic en **"Ir al Caso Practico"**.
* **Introduce el escenario:**
  > "Para ver esto en accion, utilizaremos este entorno interactivo con dos **consolas integradas reales**: una terminal con `$ node demo.js` en JavaScript y el compilador oficial `$ npx tsc --noEmit` en TypeScript."

#### Caso 1: Contratos y Prevencion de Typos
1. Haz clic en **"1. Contratos y Typos"**.
2. **En la terminal JavaScript:** Presiona el boton **`node demo.js`**:
   > "Observen la terminal inferior: JavaScript corrio el script sin chistar y creo la propiedad `pedido.direcion`. La direccion original nunca se actualizo. En produccion, la mercaderia se enviaria a la direccion vieja sin que nadie lo note."
3. **En la terminal TypeScript:**
   > "Miren la terminal de TypeScript: el compilador oficial `tsc` inmediatamente emitio el error `demo.ts:16:8 - error TS2339: Property 'direcion' does not exist on type 'Pedido'`. Noten como subraya exactamente el error con virgulillas `~~~~~~~~`. Si en el editor cambio 'direcion' por 'direccion', la terminal pasa de inmediato a `[tsc] Compiled successfully. Found 0 errors.` y ejecuta `node dist/demo.js` con exito."

#### Caso 2: Parametros de Funciones y Calculos
1. Haz clic en **"2. Parametros y Calculos"**.
2. **En JavaScript:** Presiona **`node demo.js`**:
   > "La terminal imprime: `Total calculado en JS: 10015`. Al recibir `'15'` como texto, sumo `100 + '15'` por concatenacion. Le cobramos diez mil dolares a un cliente por una falla de tipos."
3. **En TypeScript:**
   > "En la consola `tsc`, TypeScript bloquea la ejecucion con `error TS2345: Argument of type 'string' is not assignable to parameter of type 'number'`. Al quitar las comillas a `15` en el editor, el error desaparece y la consola muestra el total validado `115`."

#### Caso 3: Control Seguro de Estados
1. Haz clic en **"3. Control de Estados"**.
2. **En JavaScript:** Presiona **`node demo.js`**:
   > "Se paso `'pagado'` en minusculas. La terminal muestra `Resultado en JS: Estado desconocido o no contemplado`."
3. **En TypeScript:**
   > "La terminal `tsc` nos avisa: `error TS2345: Argument of type '"pagado"' is not assignable to parameter of type 'EstadoPedido'. Did you mean '"PAGADO"'?`. Al corregirlo a mayusculas, el compilador aprueba y se ejecuta el despacho."

#### Caso 4: Proteccion ante Undefined (Caida de Servidor)
1. Haz clic en **"4. Proteccion ante Undefined"**.
2. **En JavaScript:** Presiona **`node demo.js`**:
   > "¡Explosion en vivo! Miren la traza real de Node.js: `TypeError: Cannot read properties of undefined (reading 'codigoPostal')` con el puntero `^` en la linea exacta. Caida total en produccion."
3. **En TypeScript:**
   > "En TypeScript, el compilador no nos deja ni compilar: `error TS18048: 'pedido.envio' is possibly 'undefined'`. Si agregamos el operador de encadenamiento opcional `pedido.envio?.codigoPostal`, la terminal compila limpiamente a 0 errores."

---

### Paso 5: Conclusion y Cierre (Minuto 6:00 a 7:00)

* **Frase final de impacto:**
  > "En conclusion: JavaScript es rapido y dinamico, pero a medida que los sistemas crecen, la falta de tipos se traduce en errores costosos y perdida de tiempo. TypeScript traslada la deteccion de errores desde el navegador del usuario hacia el editor del desarrollador, brindando calidad de ingenieria, contratos claros y cero sobrecarga de rendimiento. Muchas gracias."
