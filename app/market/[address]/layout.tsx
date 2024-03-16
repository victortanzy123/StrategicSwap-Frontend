export default function PoolPairLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="p-8 w-full flex flex-col items-center">{children}</div>
  );
}
