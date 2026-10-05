# Sistema de admisión para eventos

Sistema web que se usó en **Culture Videolab**, un evento audiovisual por invitación con **120 asistentes**, para registrar invitados, recibir sus comprobantes de pago y controlar el ingreso.

🔗 **Demo:** https://www.culture-videolab.org/

## Cómo funciona
1. **Registro:** el invitado completa el formulario y sus datos se guardan en Google Sheets.
2. **Comprobante:** envía el comprobante de su transferencia.
3. **Aprobación:** el organizador verifica el pago en su cuenta y cambia el estado a `ACEPTADO` en la hoja.
4. **Consulta:** el invitado ingresa su DNI y ve si su ingreso fue aceptado.

## Arquitectura
| Parte | Tecnología |
|---|---|
| 4 páginas (registro, comprobante, consulta) | HTML, CSS, JavaScript |
| Backend | Google Apps Script (web app) |
| Datos y panel de aprobación | Google Sheets |
| Hosting | Vercel |

Sin servidor propio ni base de datos tradicional: el diseño prioriza la herramienta más simple que resuelve el problema.

## Decisión de diseño
La aprobación del pago es manual a propósito: el organizador confirma en su cuenta bancaria que el dinero llegó antes de aceptar a cada invitado.

