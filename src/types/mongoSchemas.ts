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
  _id?: string;  // opcional porque puede venir como _id
  id?: string;   // opcional porque puede venir como id (por el transform)
  nombre: string;
}

// post sin populate (usado en /posts y /posts/:id)
type EtiquetaFlexible = string | Tag;

export interface Post {
  _id?: string;  // cambié de solo 'id' a opcional _id/id
  id?: string;
  descripcion: string;
  fecha: string;
  imagenes: string[];
  etiquetas: EtiquetaFlexible[];
  user: string;
}

// post con populate y comentarios (usado en /posts/:id/full)
export interface PostPopulated {
  _id?: string;
  id?: string;
  descripcion: string;
  fecha: string;
  etiquetas: Tag[];
  user: Pick<User, '_id' | 'id' | 'nickname' | 'email'>;
  comentarios: CommentPopulated[];
}