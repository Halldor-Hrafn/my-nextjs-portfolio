import Navbar from "@/components/Navbar";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";

export default async function Page() {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const handlePasswordReset = async (formData: FormData) => {
    "use server";

    const cookiesStore = cookies();
    const supabase = createClient(cookiesStore);

    const viewUserId = (await supabase.auth.getUser()).data?.user?.id;
    const userId = (await supabase.auth.getUser()).data!.user!.email

    const oldPassword = formData.get("oldPassword") as string;
    const newPassword = formData.get("newPassword") as string;

    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    })
  }

  return (
    <div className="flex-1 w-full flex flex-col gap-20 items-center">
      <Navbar />
      <main className="w-full grid grid-cols-3 gap-8">
        <div className="col-span-1">
          {/* Profile Picture Section */}
          <div className="flex flex-col items-center">
            <img
              src="https://i.imgur.com/0DTlT5W.png"
              alt="Profile Image"
              className="w-32 h-32 rounded-full mb-4"
            />
            <h1 className="text-3xl font-bold">Halldór Hrafn Reynisson</h1>
            <p className="text-gray-500">I am a 17 year old developer from Iceland.</p>
            
          </div>
        </div>
        <div className="col-span-2">
          {/* Post History */}
          <div>
            <h2 className="text-2xl font-bold mb-4">Change Password</h2>
            <form action={handlePasswordReset}>
              <input type="password" placeholder="Old Password" name="oldPassword" />
              <input type="password" placeholder="New Password" name="newPassword" />
              <button formAction={handlePasswordReset}>Submit</button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
