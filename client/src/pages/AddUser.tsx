import { yupResolver } from "@hookform/resolvers/yup";
import { Button, HelperText, Label, Textarea, TextInput } from "flowbite-react";
import { Controller, useForm } from "react-hook-form";
import { profileDataValidationSchema } from "../validations/UserValidation";
import type { UserType } from "../types/user.types";
import { CreateUserAsync } from "../services/userService";
import { useUserPostContext } from "../context/useUserPostContext";

const AddUser = () => {
  const { setUserId } = useUserPostContext();
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(profileDataValidationSchema),
  });

  const onSubmit = async (values: UserType) => {
    const userId = await CreateUserAsync(values);
    setUserId(userId);
    reset();
  };

  return (
    <div className="flex flex-col p-12 gap-4">
      <div className="w-2xl mx-auto flex flex-col gap-4">
        <h6 className="text-2xl font-bold">Add New User</h6>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-wrap gap-2">
            <Controller
              control={control}
              name="displayName"
              defaultValue=""
              render={({ field }) => (
                <div className="flex-grow-1">
                  <div className="mb-2 block">
                    <Label htmlFor="username">Username</Label>
                  </div>
                  <TextInput required id="username" {...field} type="text" />
                  <HelperText>{errors.displayName?.message}</HelperText>
                </div>
              )}
            />

            <Controller
              control={control}
              name="email"
              defaultValue=""
              render={({ field }) => (
                <div className="flex-grow-1">
                  <div className="mb-2 block">
                    <Label htmlFor="email">Email</Label>
                  </div>
                  <TextInput id="email" {...field} type="text" />
                  <HelperText>{errors.email?.message}</HelperText>
                </div>
              )}
            />
          </div>

          <div className="flex gap-2 flex-wrap">
            <Controller
              control={control}
              name="location"
              defaultValue=""
              render={({ field }) => (
                <div className="flex-grow-1">
                  <div className="mb-2 block">
                    <Label htmlFor="location">Location</Label>
                  </div>
                  <TextInput id="location" {...field} type="text" />
                  <HelperText>{errors.location?.message}</HelperText>
                </div>
              )}
            />

            <Controller
              control={control}
              name="age"
              defaultValue={0}
              render={({ field }) => (
                <div className="flex-grow-0">
                  <div className="mb-2 block">
                    <Label htmlFor="age">Age</Label>
                  </div>
                  <TextInput id="age" {...field} type="number" />
                  <HelperText>{errors.age?.message}</HelperText>
                </div>
              )}
            />
          </div>

          <Controller
            control={control}
            name="websiteUrl"
            defaultValue=""
            render={({ field }) => (
              <div className="flex-grow-1">
                <div className="mb-2 block">
                  <Label htmlFor="url">Website URL</Label>
                </div>
                <TextInput id="url" {...field} type="text" />
                <HelperText>{errors.websiteUrl?.message}</HelperText>
              </div>
            )}
          />

          <Controller
            control={control}
            name="aboutMe"
            defaultValue=""
            render={({ field }) => (
              <div className="flex-grow-1">
                <div className="mb-2 block">
                  <Label htmlFor="about">About Me</Label>
                </div>
                <Textarea rows={4} id="about" {...field} />
                <HelperText>{errors.websiteUrl?.message}</HelperText>
              </div>
            )}
          />

          <Button type="submit">Submit</Button>
        </form>
      </div>
    </div>
  );
};

export default AddUser;
