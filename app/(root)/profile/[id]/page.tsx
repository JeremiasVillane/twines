import ProfileHeader from "@/components/shared/ProfileHeader";
import ThreadsTab from "@/components/shared/ThreadsTab";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { profileTabs } from "@/constants";
import { fetchUser } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";

const Page = async ({ params }: { params: { id: string } }) => {
  const user = await currentUser();
  if (!user) return null;

  const userInfo = await fetchUser(params.id);
  if (!userInfo?.onboarded) redirect("/onboarding");

  return (
    <section>
      {/* @ts-ignore */}
      <ProfileHeader
        accountId={userInfo.id}
        authUserId={user.id}
        ownerId={params.id}
        name={userInfo.name}
        username={userInfo.username}
        imgUrl={userInfo.image}
        bio={userInfo.bio}
      />

      <div className="mt-9">
        <Tabs defaultValue="threads" className="w-full">
          <TabsList className="tab select-none">
            {profileTabs.map((tab) => (
              <TabsTrigger key={tab.label} value={tab.value} className="tab">
                <div
                  title={tab.label}
                  className="flex items-center justify-center gap-3"
                >
                  {tab.icon}
                </div>
                <p className="max-sm:hidden">{tab.label}</p>

                {/* {tab.label === "Publicaciones" && (
                  <p className="l-1 rounded-sm bg-light-4 px-2 py-1 !text-tiny-medium text-light-2">
                    {userInfo?.threads?.length}
                  </p>
                )} */}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="threads" className="w-full text-light-1">
            {/* @ts-ignore */}
            <ThreadsTab
              currentUserId={user.id}
              accountId={userInfo.id}
              accountType="User"
              data="Publicaciones"
            />
          </TabsContent>

          <TabsContent value="replies" className="w-full text-light-1">
            {/* @ts-ignore */}
            <ThreadsTab
              currentUserId={user.id}
              accountId={userInfo.id}
              accountType="User"
              data="Comentarios"
            />
          </TabsContent>

          <TabsContent value="favs" className="w-full text-light-1">
            {/* @ts-ignore */}
            <ThreadsTab
              currentUserId={user.id}
              accountId={userInfo.id}
              accountType="User"
              data="Favoritos"
            />
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
};

export default Page;
