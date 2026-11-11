type BasePost = {
  id: string;
  time: string;
  author: string;
  audience: string;
  body: string;
  likes: number;
  comments: number;
  photoCaption?: string;
};

export type PostKind = "achievement" | "activity" | "announcement";

export type Post =
  | (BasePost & { kind: "achievement" | "activity"; child: string })
  | (BasePost & { kind: "announcement" });

export type Teacher = {
  name: string;
  initial: string;
  role: string;
};

export const teacher: Teacher = {
  name: "Caro Giménez",
  initial: "C",
  role: "Maestra · Soles",
};

export const classroom = {
  room: "Sala Soles",
  eyebrow: "GUARDERÍA · SALA SOLES",
  salutation: "Buenas, Caro",
  summary: "12 niños · martes 17 jun",
};

export const posts: Post[] = [
  {
    id: "post-achievement",
    kind: "achievement",
    child: "Mateo",
    time: "14:20",
    author: "publicado por vos",
    audience: "Para: familia de Mateo",
    body: "¡Usó el orinal solito por primera vez! Estaba feliz de contárselo a todos. Un gran paso.",
    likes: 3,
    comments: 1,
  },
  {
    id: "post-activity",
    kind: "activity",
    child: "Mateo",
    time: "09:40",
    author: "publicado por vos",
    audience: "Para: familia de Mateo",
    body: "Pintamos con témperas esta mañana. Mateo eligió el azul para todo y se concentró un montón mezclando colores.",
    likes: 5,
    comments: 2,
    photoCaption: "Foto · pintando con témperas",
  },
  {
    id: "post-announcement",
    kind: "announcement",
    time: "07:50",
    author: "publicado por vos",
    audience: "Para: toda la sala",
    body: "El viernes salimos al parque por la mañana. Recuerden mandar gorra y una botellita de agua.",
    likes: 8,
    comments: 0,
  },
];
