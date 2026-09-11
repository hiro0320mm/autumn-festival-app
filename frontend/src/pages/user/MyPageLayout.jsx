import MyPageHeader from "./MyPageHeader.jsx";

function MyPageLayout({ children }) {
    return (
        <>
            <MyPageHeader />

            <main>
                {children}
            </main>
        </>
    );
}

export default MyPageLayout;