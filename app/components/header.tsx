import { createClient } from "../utils/server";
import SignOutButton from "./signout-button";

export default async function Header() {
  // Server component: read session from server-side Supabase client
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();

  const nav = [
    { text: "Home", link: "/" },
    { text: "Question", link: "/question" },
    { text: "History", link: "/history" },
  ];

  return (
    <div className="bg-red-50">


      {!session ? (
        <div>
        </div>
      ) : (
        <div>
                <h1>SumOne2</h1>
          {nav.map((item, index) => (
            <a key={index} href={item.link}>
              {item.text}
            </a>
          ))}
          <SignOutButton />
        </div>
      )}
    </div>
  );
}
