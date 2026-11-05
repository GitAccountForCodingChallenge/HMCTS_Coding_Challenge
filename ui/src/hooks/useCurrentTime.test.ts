import {act, renderHook} from "@testing-library/react"
import {useCurrentTime} from "./useCurrentTime"

describe("useCurrentTime", () => {
    const initialTime = new Date("2026-11-05T12:00:00Z")

    beforeEach(() => {
        jest.useFakeTimers()
        jest.setSystemTime(initialTime)
    })

    afterEach(() => {
        jest.useRealTimers();
    })

    it("should return the current time initially", () => {
        const {result} = renderHook(() => useCurrentTime())
        expect(result.current).toBe(initialTime.getTime())
    })

    it("should update the time after 60 seconds", () => {
        const {result} = renderHook(() => useCurrentTime())

        act(() => {
            jest.advanceTimersByTime(60000)
        })

        expect(result.current).toBe(initialTime.getTime() + 60000)
    })

    it("should clear the interval when unmounted", () => {
        const clearIntervalSpy = jest.spyOn(globalThis, "clearInterval")

        const {unmount} = renderHook(
            () => useCurrentTime()
        )

        unmount()

        expect(clearIntervalSpy).toHaveBeenCalled()

        clearIntervalSpy.mockRestore()
    })
})
