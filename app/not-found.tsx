import Link from "next/link";

export default function NotFound() {
  return (
    <>
      <p className="section-label">Missing page</p>
      <h1>That page is not part of this sketch.</h1>
      <p className="lede">
        The concept has a home page, three homes, a comparison, and notes on
        cost. None of them is a listing.
      </p>
      <p>
        <Link className="text-link" href="/">
          Back to the concept
        </Link>
      </p>
    </>
  );
}
