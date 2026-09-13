import MyPageHeader from "./MyPageHeader.jsx";

function MyPageLayout({ children }) {
    return (
        <>
            <MyPageHeader />

            <main id="myPage">
                {children}
            </main>
        </>
    );
}

export default MyPageLayout;