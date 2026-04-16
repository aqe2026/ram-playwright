import { useState } from 'react';

// ---------------------------------------------------------
// CodeBlock — Syntax-highlighted code display with copy
// Supports TypeScript, bash, and diff highlighting
// ---------------------------------------------------------

interface CodeBlockProps {
  code: string;
  language?: 'typescript' | 'bash' | 'javascript' | 'html';
  title?: string;
  showLineNumbers?: boolean;
}

export default function CodeBlock({
  code,
  language = 'typescript',
  title,
  showLineNumbers = true,
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const lines = code.split('\n');

  // Basic syntax highlighting via regex
  const highlightLine = (line: string): string => {
    if (language === 'bash') {
      return line
        .replace(/^(#.*)$/gm, '<span class="code-comment">$1</span>')
        .replace(/(npx|npm|node|cd|git)\b/g, '<span class="code-keyword">$1</span>')
        .replace(/--[\w-]+/g, '<span class="code-string">$&</span>');
    }

    return line
      // Comments
      .replace(/(\/\/.*)$/gm, '<span class="code-comment">$1</span>')
      // Strings
      .replace(/('[^']*')/g, '<span class="code-string">$1</span>')
      .replace(/(`[^`]*`)/g, '<span class="code-string">$1</span>')
      // Keywords
      .replace(/\b(import|from|export|const|let|var|function|return|async|await|new|if|else|test|expect|describe|page|class|extends|constructor|this|typeof|interface|type)\b/g, '<span class="code-keyword">$1</span>')
      // Methods/functions
      .replace(/\.(goto|click|fill|getByTestId|getByRole|getByText|getByLabel|getByPlaceholder|toBeVisible|toHaveText|toContainText|toHaveURL|toHaveTitle|toHaveValue|toHaveAttribute|toHaveCount|toBeEnabled|toBeDisabled|toBeHidden|toBeChecked|not|waitForURL|waitForSelector|locator|beforeEach|afterEach|route|evaluate|screenshot|toHaveScreenshot)\b/g, '.<span class="code-method">$1</span>')
      // Numbers
      .replace(/\b(\d+)\b/g, '<span class="code-number">$1</span>')
      // Decorators/special
      .replace(/@(playwright\/test)/g, '<span class="code-decorator">@$1</span>');
  };

  return (
    <div className="code-block-wrapper" data-testid="code-block">
      {/* Header */}
      <div className="code-block-header">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <span className="w-3 h-3 rounded-full bg-red-400/80" />
            <span className="w-3 h-3 rounded-full bg-yellow-400/80" />
            <span className="w-3 h-3 rounded-full bg-green-400/80" />
          </div>
          {title && <span className="code-block-title">{title}</span>}
        </div>
        <div className="flex items-center gap-2">
          <span className="code-block-lang">{language}</span>
          <button onClick={handleCopy} className="code-copy-btn" aria-label="Copy code">
            {copied ? '✅ Copied!' : '📋 Copy'}
          </button>
        </div>
      </div>

      {/* Code Content */}
      <div className="code-block-content">
        <pre>
          <code>
            {lines.map((line, idx) => (
              <div key={idx} className="code-line">
                {showLineNumbers && (
                  <span className="code-line-number">{idx + 1}</span>
                )}
                <span
                  className="code-line-content"
                  dangerouslySetInnerHTML={{ __html: highlightLine(line) || '&nbsp;' }}
                />
              </div>
            ))}
          </code>
        </pre>
      </div>
    </div>
  );
}
