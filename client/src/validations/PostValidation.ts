import * as Yup from "yup";

export const createPostValidationSchema = Yup.object({
  title: Yup.string()
    .required("Title is required.")
    .max(250, "Title cannot exceed 250 characters.")
    .min(5, "Title must be at least 5 characters long."),
  body: Yup.string().required("Body is required"),
  postTypeId: Yup.number().required("Post Type is required."),
  tags: Yup.string().optional(),
});
