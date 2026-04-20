// Funciones utilitarias: generateId(), bufferToUuid(), parseIds(), createError()
// src/utils/helpers.js

/**
 * Convierte Buffers de MySQL (BINARY 16) a Strings UUID legibles
 * @param {Buffer} buffer 
 * @returns {string|null}
 */
export const bufferToUUID = (buffer) => {
    if (!buffer || !Buffer.isBuffer(buffer)) return buffer;
    
    const hex = buffer.toString('hex');
    return [
        hex.substring(0, 8),
        hex.substring(8, 12),
        hex.substring(12, 16),
        hex.substring(16, 20),
        hex.substring(20)
    ].join('-');
};