import type {ConfigFile} from "@rtk-query/codegen-openapi"

const config: ConfigFile = {
    schemaFile: "http://localhost:8080/v3/api-docs",
    apiFile: "./src/services/baseApi.ts",
    apiImport: "baseApi",
    outputFile: "./src/services/generated/tasksApi.ts",
    exportName: "tasksApi",
    hooks: {
        queries: true,
        lazyQueries: true,
        mutations: true
    },
    tag: true,
    filterEndpoints: [
        "getTasks",
        "getTaskById",
        "createTask",
        "updateTaskById",
        "deleteTaskById",
        "getTaskSummaries"
    ]
}

export default config