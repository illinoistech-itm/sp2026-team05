import type { Conversation, User } from "@/types";

export const currentUser: User = {
  id: "1",
  username: "user",
  email: "user@example.com",
  avatar: "",
  followersCount: 12,
  followingCount: 8,
};

export const mockConversations: Conversation[] = [
  {
    id: "conv_2",
    participant: {
      id: "2",
      username: "DolphJoy",
      email: "dolphjoy@example.com",
      avatar: "",
      followersCount: 0,
      followingCount: 0,
    },
    lastMessage: {
      id: "m1",
      text: "Hi!!!",
      senderId: "2",
      createdAt: new Date(Date.now() - 60_000).toISOString(),
    },
    unreadCount: 1,
  },
  {
    id: "conv_3",
    participant: {
      id: "3",
      username: "LensLoop",
      email: "lensloop@example.com",
      avatar: "",
      followersCount: 0,
      followingCount: 0,
    },
    lastMessage: {
      id: "m2",
      text: "Want to shoot this weekend?",
      senderId: "3",
      createdAt: new Date(Date.now() - 3_600_000).toISOString(),
    },
    unreadCount: 0,
  },
];
