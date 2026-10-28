import { Helmet } from "react-helmet-async";

const SITE_URL = "https://quantahire.tech";

export default function SEO({
  title = "Quantahire | Discover Your Next Career Opportunity",
  description = "Find tech jobs, explore career opportunities and discover intelligent job matching with Quantahire.",
  path = "/",
  noindex = false,
  structuredData = null,
}) {
  const canonical = new URL(path, SITE_URL).toString();

  return (
    <Helmet>
      <title>{title}</title>

      <meta name="description" content={description} />

      <meta
        name="robots"
        content={noindex ? "noindex,follow" : "index,follow"}
      />

      <link rel="canonical" href={canonical} />

      <meta property="og:type" content="website" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonical} />

      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData).replace(/</g, "\\u003c")}
        </script>
      )}
    </Helmet>
  );
}