import {act, renderHook} from "@testing-library/react"
import {useDebouncedValue} from "./useDebouncedValue"

describe("useDebouncedValue", () => {
    beforeEach(() => {
        jest.useFakeTimers()
    })

    afterEach(() => {
        jest.useRealTimers()
    })

    it("should update the value after 300ms", () => {
        const { result, rerender } = renderHook(
            ({ value }) => useDebouncedValue(value, 300),
            { initialProps: { value: "" } }
        )

        rerender({ value: "review" })

        expect(result.current).toBe("")

        act(() => {
            jest.advanceTimersByTime(299)
        })

        expect(result.current).toBe("")

        act(() => {
            jest.advanceTimersByTime(1)
        })

        expect(result.current).toBe("review")
    })

    it("should reset the timer when the value changes", () => {
        const { result, rerender } = renderHook(
            ({ value }) => useDebouncedValue(value, 300),
            { initialProps: { value: "" } }
        )

        rerender({ value: "rev" })

        act(() => {
            jest.advanceTimersByTime(200)
        })

        rerender({ value: "review" })

        act(() => {
            jest.advanceTimersByTime(100)
        })

        expect(result.current).toBe("")

        act(() => {
            jest.advanceTimersByTime(200)
        })

        expect(result.current).toBe("review")
    })
})