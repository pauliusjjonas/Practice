export function buildSrcDoc(html: string, css: string, js: string): string {
  return `<!doctype html>
<html>
<head>
<meta charset="utf-8" />
<style>
  * { box-sizing: border-box; }
  body { margin: 0; font-family: system-ui, sans-serif; }
${css}
</style>
</head>
<body>
${html}
<script>
${js}
</script>
</body>
</html>`;
}
