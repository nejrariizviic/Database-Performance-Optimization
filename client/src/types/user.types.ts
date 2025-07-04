export interface PopularCommentators {
  id: number;
  displayName: string;
  creationDate: Date;
  commentsCount: number;
  lastCreationDate: Date;
}

export interface UserType {
  displayName: string;
  email?: string | undefined;
  location?: string | undefined;
  aboutMe?: string | undefined;
  age?: number | undefined;
  websiteUrl?: string | undefined;
}
