"use server";

import { FilterQuery, SortOrder } from "mongoose";
import { revalidatePath } from "next/cache";
import Community from "../models/community.model";
import Like from "../models/like.model";
import Thread from "../models/post.model";
import User from "../models/user.model";
import { connectToDB } from "../mongoose";

interface Params {
  userId: string;
  username: string;
  name: string;
  bio: string;
  image: string;
  path: string;
}

export async function updateUser({
  userId,
  username,
  name,
  bio,
  image,
  path,
}: Params): Promise<void> {
  connectToDB();
  try {
    await User.findOneAndUpdate(
      { id: userId },
      { username: username.toLowerCase(), name, bio, image, onboarded: true },
      { upsert: true }
    );

    if (path === "/profile/edit") {
      revalidatePath(path);
    }
  } catch (error: any) {
    throw new Error(`Failed to create/update user: ${error.message}`);
  }
}

export async function fetchUser(userId: string) {
  try {
    connectToDB();

    return await User.findOne({ id: userId }).populate({
      path: "communities",
      model: Community,
    });
  } catch (error: any) {
    throw new Error(`Failed to fetch user: ${error.message}`);
  }
}

export async function fetchUserPosts(userId: string, type: string) {
  try {
    connectToDB();

    const threadsQuery = User.findOne({ id: userId }).populate({
      path: "threads",
      populate: [
        {
          path: "community",
          model: Community,
          select: "name id image _id",
        },
        {
          path: "children",
          model: Thread,
          populate: {
            path: "author",
            model: User,
            select: "name image id",
          },
        },
      ],
    });

    const userWithThreads = await threadsQuery.exec();

    const filteredThreads = userWithThreads.threads.filter((thread: any) =>
      type === "mainposts"
        ? [null, undefined].includes(thread.parentId)
        : ![null, undefined].includes(thread.parentId)
    );

    userWithThreads.threads = filteredThreads.sort(
      (a: any, b: any) => b.createdAt - a.createdAt
    );

    return userWithThreads;
  } catch (error: any) {
    throw new Error(`Failed to fetch user posts: ${error.message}`);
  }
}

export async function fetchUsers({
  userId,
  searchString = "",
  pageNumber = 1,
  pageSize = 20,
  sortBy = "desc",
}: {
  userId: string;
  searchString?: string;
  pageNumber?: number;
  pageSize?: number;
  sortBy?: SortOrder;
}) {
  try {
    connectToDB();

    const skipAmount = (pageNumber - 1) * pageSize;
    const regex = new RegExp(searchString, "i");
    const query: FilterQuery<typeof User> = {
      id: { $ne: userId },
    };

    if (searchString.trim() !== "") {
      query.$or = [
        { username: { $regex: regex } },
        { name: { $regex: regex } },
      ];
    }

    const sortOptions = { createdAt: sortBy };

    const usersQuery = User.find(query)
      .sort(sortOptions)
      .skip(skipAmount)
      .limit(pageSize);

    const totalUsersCount = await User.countDocuments(query);
    const users = await usersQuery.exec();
    const isNext = totalUsersCount > skipAmount + users.length;

    return { users, isNext };
  } catch (error: any) {
    throw new Error(`Failed to fetch users: ${error.message}`);
  }
}

export async function getActivity(userId: string) {
  try {
    connectToDB();

    const userThreads = await Thread.find({ author: userId });
    const childThreadIds = userThreads.reduce((acc, userThread) => {
      return acc.concat(userThread.children);
    }, []);
    // const userThreadsIds = userThreads.reduce((acc, userThread) => {
    //   return acc.concat(userThread._id);
    // }, []);

    // const usersWhoLikedCurrentUserPosts = await User.find({
    //   likedPosts: { $in: userThreadsIds },
    //   _id: { $ne: userId },
    // })
    //   .select({
    //     _id: true,
    //     name: true,
    //     likedPosts: true,
    //   })
    //   .populate({
    //     path: "threads",
    //     model: Thread,
    //     select: "_id",
    //   })
    //   .exec();

    // const currentUserPostsLiked = JSON.parse(
    //   JSON.stringify(usersWhoLikedCurrentUserPosts)
    // ).map((user) =>
    //   user.likedPosts.filter((post) => JSON.stringify(userThreadsIds).includes(post))
    // );

    // console.log("userThreadsIds: ", JSON.stringify(userThreadsIds));
    // console.log("currentUserPostsLiked: ", currentUserPostsLiked);

    const replies = await Thread.find({
      _id: { $in: childThreadIds },
      author: { $ne: userId },
    }).populate({
      path: "author",
      model: User,
      select: "name image _id",
    });

    return replies;
  } catch (error: any) {
    throw new Error(`Failed to fetch activity: ${error.message}`);
  }
}

export async function getLikedPostsByUser(accountId: string) {
  try {
    connectToDB();

    const { likedPosts } = await User.findOne({ id: accountId });
    const postsLikedByUser = await Thread.find({
      _id: { $in: likedPosts },
    }).populate({
      path: "author",
    });

    return postsLikedByUser;
  } catch (error: any) {
    throw new Error(`Failed to fetch liked posts: ${error.message}`);
  }
}
