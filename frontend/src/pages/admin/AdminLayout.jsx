import AdminHeader from "./AdminHeader.jsx";

function AdminLayout({ children }) {
    return (
        <>
            <AdminHeader />

            <main className="admin">
                {children}
            </main>
        </>
    );
}

export default AdminLayout;