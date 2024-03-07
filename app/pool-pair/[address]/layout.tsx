export default function PoolPairLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="p-8 w-full flex flex-col items-center">
      <h1 className="text-6xl font-bold mt-20 mb-10">Strategic Pool</h1>
      {children}
    </div>
  );
}
