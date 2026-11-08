// Two statically rendered pages make the same cached fetch to a URL that cannot be parsed.
// The error is caught, so each page should simply render "fallback".
const URL_TO_FETCH = process.env.REPRO_URL ?? "not-a-url/data.json";

export default async function Page() {
  const res = await fetch(URL_TO_FETCH, { next: { revalidate: 60 } }).catch((e) => {
    console.log(`[repro] fetch failed: ${e}`);
    return null;
  });
  return <p>{res ? "ok" : "fallback"}</p>;
}
