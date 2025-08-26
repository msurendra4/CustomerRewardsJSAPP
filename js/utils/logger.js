
/** Simple logger with levels (INFO/ERROR) */
export const logger = {
  info: (...args)=> console.info('[INFO]', ...args),
  error: (...args)=> console.error('[ERROR]', ...args)
};
