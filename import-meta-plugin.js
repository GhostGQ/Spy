/**
 * Babel plugin: replace `import.meta` with a safe plain object.
 *
 * Some dependencies (e.g. zustand) reference `import.meta.env.MODE` for dev
 * warnings. The `import.meta` token is illegal in a classic (non-module) script
 * and is not supported by Hermes, which breaks the whole bundle at parse time.
 *
 * Expo's own `import.meta` transform does not run over node_modules, so we
 * rewrite it everywhere ourselves: `import.meta` -> `({ env: {}, url: '' })`.
 * That keeps guards like `import.meta.env ? import.meta.env.MODE : void 0`
 * working (they resolve to `void 0`) while removing the offending syntax.
 */
module.exports = function ({ types: t }) {
  return {
    name: 'transform-import-meta-to-object',
    visitor: {
      MetaProperty(path) {
        const { node } = path;
        if (node.meta && node.meta.name === 'import' && node.property.name === 'meta') {
          path.replaceWith(
            t.objectExpression([
              t.objectProperty(t.identifier('env'), t.objectExpression([])),
              t.objectProperty(t.identifier('url'), t.stringLiteral('')),
            ])
          );
        }
      },
    },
  };
};
