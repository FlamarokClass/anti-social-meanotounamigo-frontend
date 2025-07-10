type EtiquetaFlexible = string | Tag;

export interface User {
  _id?: string;  // opcional porque puede venir como _id
  id?: string;   // opcional porque puede venir como id (por el transform)
  nickname: string;
  email: string;
  followers: string[];
  following: string[];
}

// comentario sin populate (usado en /comments y /comments/:id)
export interface Comment {
  _id?: string;
  id?: string;
  contenido: string;
  fecha: string;
  post: string;
  user: string;
  antiguedad?: number;
}

// comentario con populate (usado en GET /posts/:id/full)
export interface CommentPopulated {
  _id?: string;
  id?: string;
  contenido: string;
  fecha: string;
  post: string;
  user: Pick<User, '_id' | 'id' | 'nickname'>;
  antiguedad?: number;
}

// etiqueta (GET /tag y /tag/:id)
export interface Tag {
  _id?: string;
  id?: string;
  nombre: string;
}
export interface PostPopulated {
  _id?: string;
  id?: string;
  descripcion: string;
  fecha: string;
  imagenes: (string | PostImage)[];
  etiquetas: Tag[];
  user: Pick<User, '_id' | 'id' | 'nickname' | 'email'>;
  comentarios: CommentPopulated[];
}
export interface PostImage {
  _id?: string;
  id?: string;
  url: string;
}

export interface Post {
  _id?: string;
  id?: string;
  descripcion: string;
  fecha: string;
  imagenes: (string | PostImage)[];
  etiquetas: EtiquetaFlexible[];
  user: string;
}
export interface UpdatePostParams {
  postId: string;
  descripcion: string;
  etiquetas: string[]; 
  imagenesExistentes: (string | PostImage)[]; 
  imagenesNuevas: (string | PostImage)[] 
}