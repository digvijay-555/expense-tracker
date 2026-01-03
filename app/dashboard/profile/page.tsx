// import { getServerSession } from "next-auth";
// import { redirect } from "next/navigation";
// import { authOptions } from "@/lib/auth";
// import UpdateWhatsappForm from "./UpdateWhatsappForm";

// export default async function ProfilePage() {
//   const session = await getServerSession(authOptions);

//   if (!session) redirect("/login");

//   return (
//     <div className="max-w-md mx-auto p-6 space-y-4">
//       <h1 className="text-xl font-bold">Profile</h1>

//       <p className="text-sm text-gray-600">
//         Logged in as {session.user.email}
//       </p>

//       <UpdateWhatsappForm />
//     </div>
//   );
// }


// import { getServerSession } from "next-auth";
// import { redirect } from "next/navigation";
// import { authOptions } from "@/lib/auth";
// import UpdateWhatsappDialog from "./UpdateWhatsappDialog";

// export default async function ProfilePage() {
//   const session = await getServerSession(authOptions);

//   if (!session) redirect("/login");

//   return (
//     <div className="max-w-md mx-auto p-6 space-y-6">
//       <h1 className="text-xl font-bold">Profile</h1>

//       {/* Basic Info */}
//       <div className="space-y-1">
//         <p className="text-sm">
//           <span className="font-medium">Name:</span>{" "}
//           {session.user.name || "—"}
//         </p>

//         <p className="text-sm">
//           <span className="font-medium">Email:</span>{" "}
//           {session.user.email}
//         </p>
//       </div>

//       {/* WhatsApp Update Dialog */}
//       <UpdateWhatsappDialog />
//     </div>
//   );
// }


import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import UpdateWhatsappForm from "./UpdateWhatsappForm";
import UploadProfile from "./UploadProfile";

import { connectDB } from "@/lib/db";
import { User } from "@/models/Users";

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  // 🔌 Connect to DB
  await connectDB();

  // 🔍 Fetch only CID
  const user = await User.findOne(
    { email: session.user.email },
    { cid: 1 }
  ).lean();

  const cid = user?.cid ?? null;

  return (
    <div className="min-h-screen flex items-center justify-center 0">
      <div className="w-full max-w-md  rounded-xl shadow p-6 space-y-6">
        <h1 className="text-2xl font-semibold text-center">Profile</h1>

        {/* Profile picture */}
        <UploadProfile initialCid={cid} />

        {/* User info */}
        <div className="space-y-2 text-sm text-gray-700">
          <p>
            <span className="font-medium">Name:</span>{" "}
            {session.user.name || "—"}
          </p>
          <p>
            <span className="font-medium">Email:</span>{" "}
            {session.user.email}
          </p>
        </div>

        <UpdateWhatsappForm />
      </div>
    </div>
  );
}
