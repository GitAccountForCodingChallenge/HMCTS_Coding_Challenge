import { baseApi as api } from "../baseApi";
export const addTagTypes = ["Task"] as const;
const injectedRtkApi = api
  .enhanceEndpoints({
    addTagTypes,
  })
  .injectEndpoints({
    endpoints: (build) => ({
      getTasks: build.query<GetTasksApiResponse, GetTasksApiArg>({
        query: () => ({ url: `/tasks` }),
        providesTags: ["Task"],
      }),
      createTask: build.mutation<CreateTaskApiResponse, CreateTaskApiArg>({
        query: (queryArg) => ({
          url: `/tasks`,
          method: "POST",
          body: queryArg.taskPostBody,
        }),
        invalidatesTags: ["Task"],
      }),
      getTaskById: build.query<GetTaskByIdApiResponse, GetTaskByIdApiArg>({
        query: (queryArg) => ({ url: `/tasks/${queryArg.taskId}` }),
        providesTags: ["Task"],
      }),
      deleteTaskById: build.mutation<
        DeleteTaskByIdApiResponse,
        DeleteTaskByIdApiArg
      >({
        query: (queryArg) => ({
          url: `/tasks/${queryArg.taskId}`,
          method: "DELETE",
        }),
        invalidatesTags: ["Task"],
      }),
      updateTaskById: build.mutation<
        UpdateTaskByIdApiResponse,
        UpdateTaskByIdApiArg
      >({
        query: (queryArg) => ({
          url: `/tasks/${queryArg.taskId}`,
          method: "PATCH",
          body: queryArg.taskPatchBody,
        }),
        invalidatesTags: ["Task"],
      }),
      getTaskSummaries: build.query<
        GetTaskSummariesApiResponse,
        GetTaskSummariesApiArg
      >({
        query: () => ({ url: `/tasks/summaries` }),
        providesTags: ["Task"],
      }),
    }),
    overrideExisting: false,
  });
export { injectedRtkApi as tasksApi };
export type GetTasksApiResponse =
  /** status 200 Success - Returns all tasks */ Task[];
export type GetTasksApiArg = void;
export type CreateTaskApiResponse =
  /** status 201 Task successfully created */ Task;
export type CreateTaskApiArg = {
  taskPostBody: TaskPostBody;
};
export type GetTaskByIdApiResponse =
  /** status 200 Success - Returns single task with given Id */ Task;
export type GetTaskByIdApiArg = {
  taskId: number;
};
export type DeleteTaskByIdApiResponse = unknown;
export type DeleteTaskByIdApiArg = {
  taskId: number;
};
export type UpdateTaskByIdApiResponse =
  /** status 200 Success - Task updated */ Task;
export type UpdateTaskByIdApiArg = {
  taskId: number;
  taskPatchBody: TaskPatchBody;
};
export type GetTaskSummariesApiResponse =
  /** status 200 Task summaries retrieved successfully */ TaskSummary[];
export type GetTaskSummariesApiArg = void;
export type Task = {
  taskId: number;
  title: string;
  description?: string;
  status: "PENDING" | "IN PROGRESS" | "COMPLETED";
  dueDate: string;
};
export type TaskPostBody = {
  title: string;
  description?: string;
  status: "PENDING" | "IN PROGRESS" | "COMPLETED";
  dueDate: string;
};
export type TaskPatchBody = {
  status: "PENDING" | "IN PROGRESS" | "COMPLETED";
};
export type TaskSummary = {
  taskId: number;
  title: string;
};
export const {
  useGetTasksQuery,
  useLazyGetTasksQuery,
  useCreateTaskMutation,
  useGetTaskByIdQuery,
  useLazyGetTaskByIdQuery,
  useDeleteTaskByIdMutation,
  useUpdateTaskByIdMutation,
  useGetTaskSummariesQuery,
  useLazyGetTaskSummariesQuery,
} = injectedRtkApi;
