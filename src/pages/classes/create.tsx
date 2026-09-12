import { Breadcrumb } from "@/components/refine-ui/layout/breadcrumb";
import { CreateView } from "@/components/refine-ui/views/create-view";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useBack } from "@refinedev/core";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { classSchema } from "@/lib/schema";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
  FormLabel,
} from "@/components/ui/form";
import * as z from "zod";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { subjects, teachers } from "@/constants";
import UploadWidget from "@/components/upload-widget";

const ClassesCreate = () => {
  const back = useBack();
  const form = useForm({
    resolver: zodResolver(classSchema),
    refineCoreProps: {
      resource: "classes",
      action: "create",
    },
    defaultValues: {
      status: "active",
    },
  });

  const {
    handleSubmit,
    control,
    formState: { isSubmitting, errors },
  } = form;

  const bannerPublicId = form.watch("bannerCldPubId");

  const setBannerImage = (file, field) => {
    if (file) {
      field.onChange(file.url);
      form.setValue("bannerCldPubId", file.publicId, {
        shouldValidate: true,
        shouldDirty: true,
      });
    } else {
      field.onChange("");
      form.setValue("bannerCldPubId", "", {
        shouldValidate: true,
        shouldDirty: true,
      });
    }
  };

  const onSubmit = (values: z.infer<typeof classSchema>) => {
    try {
      console.log(values);
    } catch (error) {
      console.log(`Failed to create class: ${error}`);
    }
  };

  return (
    <CreateView className="class-view">
      <Breadcrumb />
      <h1 className="page-title">Create a class</h1>
      <div className="intro-row">
        <p>Provided required information below to add a class </p>
        <Button className="mt-5" onClick={back}>
          Go back
        </Button>
      </div>
      <Separator />
      <div className="flex items-center my-4">
        <Card className="class-form-card w-full">
          <CardHeader className="relative z-10">
            <CardTitle className="text-2xl pb-0 font-bold">
              fill out the field
            </CardTitle>
          </CardHeader>
          <Separator />
          <CardContent className="mt-6">
            <Form {...form}>
              <form
                className="space-y-9"
                onSubmit={handleSubmit(onSubmit)}
                action=""
              >
                <FormField
                  control={control}
                  name="bannerUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>banner image uploader</FormLabel>
                      <FormControl>
                        <UploadWidget
                          onChange={(file: any, field: any) =>
                            setBannerImage(file, field)
                          }
                          value={
                            field.value
                              ? {
                                  url: field.value,
                                  publicId: bannerPublicId ?? "",
                                }
                              : null
                          }
                        />
                      </FormControl>
                      <FormMessage>
                        {errors?.bannerCldPubId && !errors.bannerUrl && (
                          <p className="text-destructive">
                            {errors.bannerCldPubId.message.toString()}
                          </p>
                        )}
                      </FormMessage>
                    </FormItem>
                  )}
                />
                <FormField
                  name="name"
                  control={control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Class name</FormLabel>
                      <FormControl>
                        <Input placeholder="introduction to CS" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid sm:grid-cols-2 gap-4">
                  <FormField
                    control={control}
                    name="subjectId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Subject <span className="text-orange-600">*</span>
                        </FormLabel>
                        <Select
                          onValueChange={(value) =>
                            field.onChange(Number(value))
                          }
                          value={field.value?.toString()}
                          // disabled={subjectsLoading}
                        >
                          <FormControl>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select a subject" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {subjects.map((subject) => (
                              <SelectItem
                                key={subject.id}
                                value={subject.id.toString()}
                              >
                                {subject.name} ({subject.code})
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={control}
                    name="teacherId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Teacher <span className="text-orange-600">*</span>
                        </FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value?.toString()}
                          // disabled={teachersLoading}
                        >
                          <FormControl>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select a teacher" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {teachers.map((teacher) => (
                              <SelectItem key={teacher.id} value={teacher.id}>
                                {teacher.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <Button className="cursor-pointer" type="submit">
                  Submit
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </CreateView>
  );
};

export default ClassesCreate;
