export interface PopularPosts {
  id: number;
  viewCount: number;
  title: string;
  creationDate: Date;
  lastEditDate: Date;
  displayNameAttribute: string;
}

export interface CreatePost {
  title: string;
  body: string;
  postTypeId: number;
  tags?: string | undefined;
}
