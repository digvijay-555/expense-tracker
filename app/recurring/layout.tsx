import Navbar from "@/components/Navbar";

export default function RecurringLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <main className="p-6">{children}</main>
    </>
  );
}
