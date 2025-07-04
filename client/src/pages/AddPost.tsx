import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";
import { createPostValidationSchema } from "../validations/PostValidation";
import { useParams } from "react-router";
import type { CreatePost } from "../types/posts.types";
import { CreatePostAsync } from "../services/postService";
import {
  Button,
  HelperText,
  Label,
  Select,
  Textarea,
  TextInput,
} from "flowbite-react";
import { useUserPostContext } from "../context/useUserPostContext";

const AddPost = () => {
  const { userId } = useParams();
  const { setPostId } = useUserPostContext();

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(createPostValidationSchema),
  });

  const onSubmit = async (values: CreatePost) => {
    if (userId) {
      const postId = await CreatePostAsync(parseInt(userId), values);
      setPostId(postId);
      reset();
    }
  };

  return (
    <div className="flex flex-col gap-4 p-12">
      <div className="w-2xl mx-auto flex flex-col gap-4">
        <h6 className="text-bold text-2xl">Add new Post</h6>
        <form className="flex flex-col gap-3" onSubmit={handleSubmit(onSubmit)}>
          <div className="flex gap-2 flex-wrap">
            <Controller
              control={control}
              name="title"
              defaultValue=""
              render={({ field }) => (
                <div className="flex-grow-1">
                  <div className="mb-2 block">
                    <Label htmlFor="title">Title</Label>
                  </div>
                  <TextInput required id="title" {...field} type="text" />
                  <HelperText>{errors.title?.message}</HelperText>
                </div>
              )}
            />

            <Controller
              control={control}
              name="postTypeId"
              defaultValue={1}
              render={({ field }) => (
                <div className="flex-grow-1">
                  <div className="mb-2 block">
                    <Label htmlFor="postType">Post Type</Label>
                  </div>
                  <Select required id="postType" {...field}>
                    <option value={1}>Question</option>
                    <option value={2}>Answer</option>
                    <option value={3}>Wiki</option>
                    <option value={4}>TagWikiExerpt</option>
                    <option value={5}>TagWiki</option>
                    <option value={6}>ModeratorNomination</option>
                    <option value={7}>WikiPlaceholder</option>
                    <option value={8}>PrivilegeWiki</option>
                  </Select>
                  <HelperText>{errors.postTypeId?.message}</HelperText>
                </div>
              )}
            />
          </div>
          <Controller
            control={control}
            name="body"
            defaultValue=""
            render={({ field }) => (
              <div className="flex-grow-1">
                <div className="mb-2 block">
                  <Label htmlFor="body">Body</Label>
                </div>
                <Textarea required id="Body" {...field} rows={4} />
                <HelperText>{errors.body?.message}</HelperText>
              </div>
            )}
          />

          <Controller
            control={control}
            name="tags"
            defaultValue=""
            render={({ field }) => (
              <div className="flex-grow-1">
                <div className="mb-2 block">
                  <Label htmlFor="tags">Tags</Label>
                </div>
                <TextInput required id="tags" {...field} type="text" />
                <HelperText>{errors.tags?.message}</HelperText>
              </div>
            )}
          />

          <Button type="submit">Submit</Button>
        </form>
      </div>
    </div>
  );
};

export default AddPost;
