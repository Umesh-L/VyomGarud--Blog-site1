import ReactMarkdown from "react-markdown";

interface RichTextProps {
  content: string;
}

export function RichText({ content }: RichTextProps) {
  return (
    <article className="article-content">
      <ReactMarkdown>{content}</ReactMarkdown>
    </article>
  );
}
