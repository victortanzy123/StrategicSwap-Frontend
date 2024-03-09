export default function PoolPairLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="p-8 w-full flex flex-col items-center">
      {/* <div
        className={
          "w-100%  flex justify-center  mt-20 mb-10 text-6xl uppercase tracking-widest"
        }
      >
        Strategic Pool
      </div> */}
      {children}
    </div>
  );
}
