import Link from "next/link";

export default function SectionHead({
  label,
  dotColor,
  seeAllHref,
}: {
  label: string;
  dotColor: string;
  seeAllHref?: string;
}) {
  return (
    <div className="mb-5 flex items-baseline justify-between border-b-2 border-ink pb-3">
      <h2 className="flex items-center gap-2.5 font-display text-[22px] font-semibold text-ink">
        <span className="inline-block h-[9px] w-[9px] rounded-full" style={{ background: dotColor }} />
        {label}
      </h2>
      {seeAllHref && (
        <Link href={seeAllHref} className="font-mono text-xs text-teal hover:text-amber-deep">
          See all →
        </Link>
      )}
    </div>
  );
}
