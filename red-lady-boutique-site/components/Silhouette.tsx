const PATHS: Record<string, string> = {
  dress:
    "M60 10c-7 0-12 5-12 12 0 4 2 8 5 10l-16 20c-6 8-9 17-9 28v90c0 3 2 5 5 5h54c3 0 5-2 5-5V80c0-11-3-20-9-28l-16-20c3-2 5-6 5-10 0-7-5-12-12-12z M50 34l-8 24 M70 34l8 24 M60 34v22",
  coat: "M40 14h40l6 18-14 8v128H48V40l-14-8z M46 32l14 10 14-10 M60 60v92",
  skirt: "M45 40h30l16 128H29z M45 40l-4 128 M60 40v128 M75 40l4 128",
  blouse: "M60 14l-19 15 6 13 13-9 13 9 6-13z M42 42v122h36V42",
  bag: "M30 60c0-14 12-26 26-26h8c14 0 26 12 26 26v70c0 8-6 14-14 14H44c-8 0-14-6-14-14V60z M30 68l-10 10 10 12 M90 68l10 10-10 12",
};

export function Silhouette({
  kind,
  width = 90,
  height = 138,
  stroke = "rgba(248,242,233,0.85)",
}: {
  kind: string;
  width?: number;
  height?: number;
  stroke?: string;
}) {
  const d = PATHS[kind] || PATHS.dress;
  return (
    <svg width={width} height={height} viewBox="0 0 120 180" fill="none" stroke={stroke} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
      <path d={d} />
    </svg>
  );
}
