import { createContext, useContext } from "react";

const AdminContext = createContext(null);

export function useAdmin() {
    return useContext(AdminContext);
}

export default AdminContext;