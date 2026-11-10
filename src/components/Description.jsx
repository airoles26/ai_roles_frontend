import DOMPurify from "dompurify";
import parse from "html-react-parser";

export default function Description({ value }) {
  if (!value) {
    return (
      <p className="text-slate-500">
        No detailed description is available for this job yet.
      </p>
    );
  }

  const safeHTML = DOMPurify.sanitize(String(value), {
    USE_PROFILES: { html: true },
    FORBID_TAGS: [
      "script",
      "style",
      "iframe",
      "form",
      "input",
      "button",
    ],
    FORBID_ATTR: ["style", "class", "id"],
  });

  return (
    <article
      className="
        max-w-none break-words
        text-[15px] leading-8 text-slate-600

        [&_h1]:my-6
        [&_h1]:text-2xl
        [&_h1]:font-extrabold
        [&_h1]:text-[#18124A]

        [&_h2]:mb-4
        [&_h2]:mt-9
        [&_h2]:border-b
        [&_h2]:border-slate-100
        [&_h2]:pb-3
        [&_h2]:text-xl
        [&_h2]:font-extrabold
        [&_h2]:text-[#18124A]

        [&_h3]:mb-3
        [&_h3]:mt-6
        [&_h3]:text-lg
        [&_h3]:font-bold
        [&_h3]:text-[#5145E5]

        [&_p]:mb-5
        [&_p]:leading-8

        [&_strong]:font-bold
        [&_strong]:text-[#18124A]

        [&_ul]:my-5
        [&_ul]:list-disc
        [&_ul]:space-y-3
        [&_ul]:pl-6

        [&_ol]:my-5
        [&_ol]:list-decimal
        [&_ol]:space-y-3
        [&_ol]:pl-6

        [&_li]:leading-7
        [&_li]:marker:text-[#5145E5]

        [&_a]:font-semibold
        [&_a]:text-[#5145E5]
        [&_a]:underline
        [&_a]:underline-offset-4
      "
    >
      {parse(safeHTML)}
    </article>
  );
}