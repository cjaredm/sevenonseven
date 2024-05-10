type PageProps = {
  children: React.ReactNode;
};

export default function PageWrapper({ children }: PageProps) {
  return (
    <main className="flex-1 flex flex-col h-full mx-auto w-full max-w-[420px] bg-gray-200 max-h-[calc(100vh-60px)]">
      {children}
    </main>
  );
}
