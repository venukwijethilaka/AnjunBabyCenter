import Link from "next/link";

export default function Home() {
  return (
    <div>
      <Link href="/admin">Go to Admin</Link>
      <Link href="/client">Go to client</Link>
    </div>
  );
}