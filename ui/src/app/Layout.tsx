import {NavLink, Outlet} from "react-router-dom"
import {Container, Nav, Navbar} from "react-bootstrap"
import {ToastContainer} from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {faHouse, faMagnifyingGlass, faTableColumns} from "@fortawesome/free-solid-svg-icons"

export default function Layout() {
    return (
        <div className={"d-flex flex-column min-vh-100"}>

            <Navbar bg={"primary"} variant={"dark"} expand={"md"} className={"w-100 shadow-sm"}>
                <Container fluid className={"px-4"}>

                    <Navbar.Brand as={NavLink} to={"/"}>
                        <FontAwesomeIcon icon={faTableColumns} className={"me-2"}/>
                        Task Manager
                    </Navbar.Brand>

                    <Navbar.Toggle aria-controls={"main-navbar"} />

                    <Navbar.Collapse id={"main-navbar"}>
                        <Nav className={"ms-auto"}>

                            <Nav.Link as={NavLink} to={"/"} end>
                                <FontAwesomeIcon icon={faHouse} className={"me-2"}/>
                                Home
                            </Nav.Link>

                            <Nav.Link as={NavLink} to={"/search"}>
                                <FontAwesomeIcon icon={faMagnifyingGlass} className={"me-2"}/>
                                Search Tasks
                            </Nav.Link>

                        </Nav>
                    </Navbar.Collapse>

                </Container>
            </Navbar>

            <main className={"flex-grow-1 w-100 py-4"}>
                <Container fluid className={"px-4"}>
                    <Outlet />
                </Container>
            </main>

            <footer className={"bg-light border-top py-3 mt-auto"}>
                <Container fluid className={"px-4"}>
                    <div className={"text-center text-muted small"}>
                        © {new Date().getFullYear()} Task Manager
                    </div>
                </Container>
            </footer>

            <ToastContainer
                position={"top-right"}
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop
                closeOnClick
                pauseOnHover
                theme={"light"}
            />
        </div>
    );
}
