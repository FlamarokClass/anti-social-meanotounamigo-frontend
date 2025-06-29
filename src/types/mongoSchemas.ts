export interface User {
  _id: string;
  nickname: string;
  email: string;
  followers: string[];
  following: string[];
}

// Comentario sin populate (usado en /comments y /comments/:id)
export interface Comment {
  _id: string;
  contenido: string;
  fecha: string;
  post: string;
  user: string;
  antiguedad?: number;
}

// Comentario con populate (usado en GET /posts/:id/full)
export interface CommentPopulated {
  _id: string;
  contenido: string;
  fecha: string;
  post: string;
  user: Pick<User, '_id' | 'nickname'>;
  antiguedad?: number;
}

// Imagen de post (GET /post-image y /post-image/:id)
export interface PostImage {
  _id: string;
  url: string;
}

// Etiqueta (GET /tag y /tag/:id)
export interface Tag {
  _id: string;
  nombre: string;
}

// Post sin populate (usado en /posts y /posts/:id)
export interface Post {
  _id: string;
  descripcion: string;
  fecha: string;
  imagenes: string[];
  etiquetas: string[];
  user: string;
}

// Post con populate y comentarios (usado en /posts/:id/full)
export interface PostPopulated {
  _id: string;
  descripcion: string;
  fecha: string;
  imagenes: PostImage[];
  etiquetas: Tag[];
  user: Pick<User, '_id' | 'nickname' | 'email'>;
  comentarios: CommentPopulated[];
}
