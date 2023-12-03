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
        <div className="col-span-2">
          <div className="w-full text-center">
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
