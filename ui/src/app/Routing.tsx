import {BrowserRouter, Route, Routes,} from "react-router-dom"
import Layout from "./Layout"
import HomePage from "../pages/HomePage"
import SearchPage from "../pages/SearchPage"

export default function AppRouter() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path={"/"} element={<Layout />}>
                    <Route index element={<HomePage />} />
                    <Route path="/search" element={<SearchPage />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}
