import React from "react";
import sanitizeHtml from "sanitize-html";

interface RenderPostProps {
  htmlContent: string;
}

const RenderPost: React.FC<RenderPostProps> = ({ htmlContent }) => {
  const sanitizedHTML = sanitizeHtml(htmlContent);

  return <div dangerouslySetInnerHTML={{ __html: sanitizedHTML }} />;
};

export default RenderPost;
