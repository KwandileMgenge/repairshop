import Header from "@/components/Header";

export default async function RSLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="animate-slide">
      <Header />
      <div>{children}</div>
    </div>
  );
}