import ProfileHeader from "@/components/shared/ProfileHeader";
import PostsTab from "@/components/shared/PostsTab";
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
      {/* @ts-expect-error Async Server Component */}
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
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="threads" className="w-full text-light-1">
            {/* @ts-expect-error Async Server Component */}
            <PostsTab
              currentUserId={user.id}
              accountId={userInfo.id}
              accountType="User"
              data="Publicaciones"
            />
          </TabsContent>

          <TabsContent value="replies" className="w-full text-light-1">
            {/* @ts-expect-error Async Server Component */}
            <PostsTab
              currentUserId={user.id}
              accountId={userInfo.id}
              accountType="User"
              data="Comentarios"
            />
          </TabsContent>

          <TabsContent value="favs" className="w-full text-light-1">
            {/* @ts-expect-error Async Server Component */}
            <PostsTab
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
