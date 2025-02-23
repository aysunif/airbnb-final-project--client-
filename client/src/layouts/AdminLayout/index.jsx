import { Outlet } from "react-router-dom"
import Header from "../Header"
import Footer from "../Footer"

const AdminLayout = () => {
    return (
        <>
            <Header />
            <Outlet />
            <Footer />
        </>
    )
}

export default AdminLayout;