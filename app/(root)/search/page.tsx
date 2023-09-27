import UserCard from "@/components/cards/UserCard";
import { fetchUser, fetchUsers } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";

const Page = async () => {
  const user = await currentUser();
  if (!user) return null;

  const userInfo = await fetchUser(user.id);
  if (!userInfo?.onboarded) redirect("/onboarding");

  const results = await fetchUsers({
    userId: user.id,
    searchString: "",
    pageNumber: 1,
    pageSize: 25,
  });
  return (
    <section>
      <h1 className="head-text mb-10">Buscar</h1>

      <div className="mt-14 flex flex-col gap-9">
        {results.users.length === 0 ? (
          <p className="no-result">No hay usuarios</p>
        ) : (
          <>
            {results.users.map((u) => (
              <UserCard
                key={u.id}
                id={u.id}
                name={u.name}
                username={u.username}
                imgUrl={u.image}
                personType="User"
              />
            ))}
          </>
        )}
      </div>
    </section>
  );
};

export default Page;
