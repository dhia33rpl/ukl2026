// components/admin/AdminFooter.tsx
export default function AdminFooter() {
  return (
    <footer className="w-full h-12 bg-white border-t flex items-center justify-center text-xs text-gray-500">
      © {new Date().getFullYear()} Admin Dashboard
    </footer>
  );
}