type JsonLdProps = {
  data: Record<string, unknown> | Record<string, unknown>[];
};

export default function SeoJsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}
