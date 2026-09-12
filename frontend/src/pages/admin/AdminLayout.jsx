import AdminHeader from "./AdminHeader.jsx";

function AdminLayout({ children }) {
    return (
        <>
            <AdminHeader />

            <main>
                {children}
            </main>
        </>
    );
}

export default AdminLayout;