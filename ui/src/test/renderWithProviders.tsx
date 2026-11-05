import type {ReactElement} from "react"
import {render} from "@testing-library/react"
import {Provider} from "react-redux"
import {configureStore} from "@reduxjs/toolkit"
import {tasksApi} from "../services/generated/tasksApi"

export const createTestStore = () =>
    configureStore({
        reducer: {
            [tasksApi.reducerPath]: tasksApi.reducer
        },
        middleware: (getDefaultMiddleware) =>
            getDefaultMiddleware().concat(tasksApi.middleware)
    })

export function renderWithProviders(ui: ReactElement) {
    const store = createTestStore()

    return {
        store,
        ...render(
            <Provider store={store}>
                {ui}
            </Provider>
        )
    }
}
