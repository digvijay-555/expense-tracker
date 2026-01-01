import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import UpdateWhatsappForm from "./UpdateWhatsappForm";

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);

  if (!session) redirect("/login");

  return (
    <div className="max-w-md mx-auto p-6 space-y-4">
      <h1 className="text-xl font-bold">Profile</h1>

      <p className="text-sm text-gray-600">
        Logged in as {session.user.email}
      </p>

      <UpdateWhatsappForm />
    </div>
  );
}
