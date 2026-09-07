export default async function RSLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      {/* Header */}
      <div>{children}</div>
    </div>
  );
}