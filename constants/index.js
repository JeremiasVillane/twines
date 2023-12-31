import {
  Bell,
  Heart,
  HomeIcon,
  MessageSquare,
  MessageSquarePlusIcon,
  MessagesSquare,
  Search,
  Tag,
  User,
  UserPlus,
  Users,
} from "lucide-react";

export const sidebarLinks = [
  {
    icon: <HomeIcon size={24} color="white" />,
    route: "/",
    label: "Inicio",
  },
  {
    icon: <Search size={24} color="white" />,
    route: "/search",
    label: "Buscar",
  },
  {
    icon: <Bell size={24} color="white" />,
    route: "/activity",
    label: "Actividad",
  },
  {
    icon: <MessageSquarePlusIcon size={24} color="white" />,
    route: "/create-thread",
    label: "Publicar",
  },
  {
    icon: <Users size={24} color="white" />,
    route: "/communities",
    label: "Comunidades",
  },
  {
    icon: <User size={24} color="white" />,
    route: "/profile",
    label: "Perfil",
  },
];

export const profileTabs = [
  { value: "threads", label: "Publicaciones", icon: <MessageSquare /> },
  { value: "replies", label: "Comentarios", icon: <MessagesSquare /> },
  { value: "favs", label: "Favoritos", icon: <Heart /> },
];

export const communityTabs = [
  { value: "threads", label: "Publicaciones", icon: <MessageSquare /> },
  { value: "members", label: "Integrantes", icon: <Users /> },
  { value: "requests", label: "Solicitudes", icon: <UserPlus /> },
];
