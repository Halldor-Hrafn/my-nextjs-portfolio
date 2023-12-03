import Navbar from "@/components/Navbar";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";

export default async function Page() {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const handleDisplayNameChange = async (formData: FormData) => {
    "use server";

    const cookiesStore = cookies();
    const supabase = createClient(cookiesStore);

    const userId = (await supabase.auth.getUser()).data?.user?.id;

    const displayName = formData.get("displayName") as string;

    const { error } = await supabase
      .from("profiles")
      .update({ user_name: displayName })
      .eq("auth_id", userId);

    console.log(error);
  }

  const handlePasswordReset = async (formData: FormData) => {
    "use server";

    const cookiesStore = cookies();
    const supabase = createClient(cookiesStore);

    const oldPassword = formData.get("oldPassword") as string;
    const newPassword = formData.get("newPassword") as string;

    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });
  };

  return (
    <div className="flex-1 w-full flex flex-col gap-20 items-center">
      <Navbar />
      <main className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div className="col-span-1 bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold mb-4">Display Name</h2>
          <form action={handleDisplayNameChange} className="flex flex-col gap-4">
            <input
              type="text"
              placeholder="New Display Name"
              name="displayName"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              Change
            </button>
          </form>
        </div>
        <div className="col-span-1 bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold mb-4">Change Password</h2>
          <form action={handlePasswordReset} className="flex flex-col gap-4">
            <input
              type="password"
              placeholder="Old Password"
              name="oldPassword"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="password"
              placeholder="New Password"
              name="newPassword"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              Change
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
