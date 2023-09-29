"use server";

import { revalidatePath } from "next/cache";
import Thread from "../models/thread.model";
import User from "../models/user.model";
import Community from "../models/community.model";
import { connectToDB } from "../mongoose";
import Like from "../models/like.model";
import { ObjectId } from "mongoose";

interface Params {
  text: string;
  author: string;
  communityId: string | null;
  path: string;
}

export async function createPost({ text, author, communityId, path }: Params) {
  try {
    connectToDB();

    const communityIdObject = await Community.findOne(
      { id: communityId },
      { _id: 1 }
    );

    const createdThread = await Thread.create({
      text,
      author,
      community: communityIdObject,
    });

    await User.findByIdAndUpdate(author, {
      $push: { threads: createdThread._id },
    });

    if (communityIdObject) {
      await Community.findByIdAndUpdate(communityIdObject, {
        $push: { threads: createdThread._id },
      });
    }

    revalidatePath(path);
  } catch (error: any) {
    throw new Error(`Error creating post: ${error.message}`);
  }
}

export async function fetchPosts(pageNumber = 1, pageSize = 20) {
  connectToDB();

  const skipAmount = (pageNumber - 1) * pageSize;

  const postsQuery = Thread.find({
    parentId: { $in: [null, undefined] },
  })
    .sort({ createdAt: "desc" })
    .skip(skipAmount)
    .limit(pageSize)
    .populate({
      path: "author",
      model: User,
    })
    .populate({
      path: "community",
      model: Community,
    })
    .populate({
      path: "children",
      populate: {
        path: "author",
        model: User,
        select: "_id name parentId image",
      },
    });

  const totalPostsCount = await Thread.countDocuments({
    parentId: { $in: [null, undefined] },
  });

  const posts = await postsQuery.exec();

  const isNext = totalPostsCount > skipAmount + posts.length;

  return { posts, isNext };
}

export async function fetchPostById(id: string) {
  connectToDB();

  try {
    const thread = await Thread.findById(id)
      .populate({
        path: "author",
        model: User,
        select: "_id id name image",
      })
      .populate({
        path: "community",
        model: Community,
        select: "_id id name image",
      })
      .populate({
        path: "children",
        populate: [
          {
            path: "author",
            model: User,
            select: "_id id name parentId image",
          },
          {
            path: "children",
            model: Thread,
            populate: {
              path: "author",
              model: User,
              select: "_id id name parentId image",
            },
          },
        ],
      })
      .exec();

    return thread;
  } catch (error: any) {
    throw new Error(`Error fetching post: ${error.message}`);
  }
}

async function fetchAllChildThreads(threadId: string): Promise<any[]> {
  const childThreads = await Thread.find({ parentId: threadId });

  const descendantThreads = [];
  for (const childThread of childThreads) {
    const descendants = await fetchAllChildThreads(childThread._id);
    descendantThreads.push(childThread, ...descendants);
  }

  return descendantThreads;
}

export async function deletePost(id: string, path: string): Promise<void> {
  try {
    connectToDB();

    const mainThread = await Thread.findById(id).populate(
      "author community likes"
    );

    if (!mainThread) {
      throw new Error("Post not found");
    }

    const descendantThreads = await fetchAllChildThreads(id);

    const descendantThreadIds = [
      id,
      ...descendantThreads.map((thread) => thread._id),
    ];

    const uniqueAuthorIds = new Set(
      [
        ...descendantThreads.map((thread) => thread.author?._id?.toString()),
        mainThread.author?._id?.toString(),
      ].filter((id) => id !== undefined)
    );

    const uniqueCommunityIds = new Set(
      [
        ...descendantThreads.map((thread) => thread.community?._id?.toString()),
        mainThread.community?._id?.toString(),
      ].filter((id) => id !== undefined)
    );

    const likeIds = [
      ...mainThread.likes.map((like: any) => like?._id?.toString()),
      ...descendantThreads.map((thread) =>
        thread.likes?.map((like: any) => like?._id?.toString())
      ),
    ];

    await Thread.deleteMany({ _id: { $in: descendantThreadIds } });

    await User.updateMany(
      { _id: { $in: Array.from(uniqueAuthorIds) } },
      { $pull: { threads: { $in: descendantThreadIds } } }
    );

    await Community.updateMany(
      { _id: { $in: Array.from(uniqueCommunityIds) } },
      { $pull: { threads: { $in: descendantThreadIds } } }
    );

    await Like.deleteMany({ _id: { $in: likeIds } });

    revalidatePath(path);
  } catch (error: any) {
    throw new Error(`Failed to delete post: ${error.message}`);
  }
}

export async function addCommentToPost(
  threadId: string,
  commentText: string,
  userId: string,
  path: string
) {
  connectToDB();

  try {
    const originalThread = await Thread.findById(threadId);
    if (!originalThread) {
      throw new Error("Post not found");
    }

    const commentThread = new Thread({
      text: commentText,
      author: userId,
      parentId: threadId,
    });

    const savedCommentThread = await commentThread.save();

    originalThread.children.push(savedCommentThread._id);

    await originalThread.save();

    revalidatePath(path);
  } catch (error: any) {
    throw new Error(`Error adding comment to post: ${error.message}`);
  }
}

export async function likePost(threadId: string, userId: string, path: string) {
  connectToDB();

  try {
    const threadToLike = await Thread.findById(threadId);
    const currentUser = await User.findOne({ id: userId });
    let currentLike: any;

    if (!threadToLike) {
      throw new Error("Post not found");
    }

    const { likes } = threadToLike;

    if (likes.length > 0) {
      const likeDocuments = await Like.find({ _id: { $in: likes } });

      const likedByUsers: string[] = likeDocuments.map(
        (like: { likedBy: { toString: () => string } }) =>
          like.likedBy.toString()
      );

      const isCurrentUserAlreadyLiked = likedByUsers.includes(
        currentUser._id.toString()
      );

      if (!isCurrentUserAlreadyLiked) {
        const like = new Like({
          postId: threadId,
          likedBy: currentUser._id,
        });

        currentLike = await like.save();

        threadToLike.likes.push(currentLike._id);
        currentUser.likedPosts.push(threadId);
      } else {
        const likeIndexToRemove = likedByUsers.findIndex(
          (id) => id === currentUser._id.toString()
        );

        if (likeIndexToRemove !== -1) {
          threadToLike.likes.splice(likeIndexToRemove, 1);
        }

        const currentUserLikedPost = likeDocuments.find(
          (like) => like.likedBy.toString() === currentUser._id.toString()
        );

        const likedPostIndexToRemove = currentUser.likedPosts.findIndex(
          (id: ObjectId) =>
            id.toString() === currentUserLikedPost.postId.toString()
        );

        if (likedPostIndexToRemove !== -1) {
          currentUser.likedPosts.splice(likedPostIndexToRemove, 1);
        }

        const currentUserLike = likeDocuments.find(
          (like) => like.likedBy.toString() === currentUser._id.toString()
        );

        await Like.findByIdAndDelete(currentUserLike);
      }
    } else {
      const like = new Like({
        postId: threadId,
        likedBy: currentUser._id,
      });

      currentLike = await like.save();

      threadToLike.likes.push(currentLike._id);
      currentUser.likedPosts.push(threadId);
    }

    await currentUser.save();
    await threadToLike.save();

    revalidatePath(path);
  } catch (error: any) {
    throw new Error(`Error liking post: ${error.message}`);
  }
}

export async function isLiked(threadId: string, userId: string) {
  try {
    connectToDB();

    const threadToLike = await Thread.findById(threadId);
    const currentUser = await User.findOne({ id: userId });

    const { likes } = threadToLike;

    if (likes.length < 1) {
      return false;
    } else {
      const likesFromDB = await Like.find({ _id: { $in: likes } });

      const likedByUsers: string[] = likesFromDB.map(
        (like: { likedBy: { toString: () => string } }) =>
          like.likedBy.toString()
      );

      const isCurrentUserAlreadyLiked = likedByUsers.includes(
        currentUser._id.toString()
      );

      if (isCurrentUserAlreadyLiked) {
        return true;
      } else return false;
    }
  } catch (error: any) {
    throw new Error(`Failed to check like status: ${error.message}`);
  }
}
