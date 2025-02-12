import path from 'path';
import { fileURLToPath } from 'url';

/**
 * Función que retorna la ruta del directorio actual según el archivo que la importe.
 * @param {string} metaUrl - El valor de `import.meta.url` del archivo que lo importa.
 * @returns {string} - La ruta del directorio.
 */
export const getDirname = (metaUrl) => {
    const __filename = fileURLToPath(metaUrl);
    return path.dirname(__filename);
};
