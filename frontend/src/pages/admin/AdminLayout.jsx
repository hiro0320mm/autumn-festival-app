import AdminHeader from "./AdminHeader.jsx";
import ScrollTop from "../../components/ScrollTop.jsx";

function AdminLayout({ children }) {
    return (
        <>
            <AdminHeader />

            <main className="admin">
                {children}
            </main>
            <ScrollTop />
        </>
    );
}

export default AdminLayout;