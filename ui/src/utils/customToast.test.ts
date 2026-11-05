import {toast} from "react-toastify"
import {customToast} from "./customToast"

jest.mock("react-toastify", () => ({
    toast: {
        success: jest.fn(),
        error: jest.fn()
    }
}))

describe("customToast", () => {
    beforeEach(() => {
        jest.clearAllMocks()
    })

    it("should display a created success message", () => {
        customToast.success.created("Task")
        expect(toast.success).toHaveBeenCalledWith("Task created successfully.")
    })

    it("should display an updated success message", () => {
        customToast.success.updated("Task")
        expect(toast.success).toHaveBeenCalledWith("Task updated successfully.")
    })

    it("should display a deleted success message", () => {
        customToast.success.deleted("Task")
        expect(toast.success).toHaveBeenCalledWith("Task deleted successfully.")
    })

    it("should display a custom success message", () => {
        customToast.success.custom("Task moved to Completed.")
        expect(toast.success).toHaveBeenCalledWith("Task moved to Completed.")
    })

    it("should display a custom error message", () => {
        customToast.error("Failed to delete task.")
        expect(toast.error).toHaveBeenCalledWith("Failed to delete task.")
    })
})
