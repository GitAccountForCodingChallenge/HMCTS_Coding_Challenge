import {render, screen} from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import ConfirmationDialog from "./ConfirmationDialog"

describe("ConfirmationDialog", () => {
    it("should call the confirmation callback when confirmed", async () => {
        const user = userEvent.setup()
        const onConfirm = jest.fn()

        render(
            <ConfirmationDialog
                show
                title={"Delete Task"}
                text={"Are you sure?"}
                onHideCallback={jest.fn()}
                onConfirmCallback={onConfirm}
                confirmText={"Delete"}
                confirmVariant={"danger"}
            />
        )

        await user.click(screen.getByRole("button", { name: "Delete" }))

        expect(onConfirm).toHaveBeenCalledTimes(1)
    })

    it("should call the hide callback when cancelled", async () => {
        const user = userEvent.setup()
        const onHide = jest.fn()
        const onConfirm = jest.fn()

        render(
            <ConfirmationDialog
                show
                title={"Delete Task"}
                text={"Are you sure?"}
                onHideCallback={onHide}
                onConfirmCallback={onConfirm}
            />
        )

        await user.click(screen.getByRole("button", { name: "Cancel" }))

        expect(onHide).toHaveBeenCalledTimes(1)
        expect(onConfirm).not.toHaveBeenCalled()
    })

    it("should disable confirmation while attempting to delete the task", () => {
        render(
            <ConfirmationDialog
                show
                title={"Delete Task"}
                text={"Are you sure?"}
                onHideCallback={jest.fn()}
                onConfirmCallback={jest.fn()}
                isSubmitting
                loadingText={"Deleting..."}
            />
        )

        expect(screen.getByRole("button", { name: /Deleting/i })).toBeDisabled()
    })
})
