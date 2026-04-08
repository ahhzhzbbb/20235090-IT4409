function convertMarkdown() {
  const markdownInput = document.getElementById('markdown-input');
  let html = markdownInput.value;

  // Headings (level 3 to 1 so higher levels are matched first)
  html = html.replace(/^\s*###\s+(.+)$/gm, '<h3>$1</h3>');
  html = html.replace(/^\s*##\s+(.+)$/gm, '<h2>$1</h2>');
  html = html.replace(/^\s*#\s+(.+)$/gm, '<h1>$1</h1>');

  // Blockquotes
  html = html.replace(/^\s*>\s+(.+)$/gm, '<blockquote>$1</blockquote>');

  // Images
  html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img alt="$1" src="$2">');

  // Links
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');

  // Bold (**text** or __text__)
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/__(.+?)__/g, '<strong>$1</strong>');

  // Italic (*text* or _text_)
  html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');
  html = html.replace(/_(.+?)_/g, '<em>$1</em>');

  return html;
}

const markdownInput = document.getElementById('markdown-input');
const htmlOutput = document.getElementById('html-output');
const preview = document.getElementById('preview');

function updateOutput() {
  const converted = convertMarkdown();
  htmlOutput.textContent = converted;
  preview.innerHTML = converted;
}

markdownInput.addEventListener('input', updateOutput);
updateOutput();
