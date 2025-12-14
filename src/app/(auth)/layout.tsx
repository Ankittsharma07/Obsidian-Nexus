export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-[calc(100vh-120px)] items-center justify-center px-4 py-16">
      <div className="w-full max-w-lg">{children}</div>
    </div>
  );
}
