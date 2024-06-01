import Footer from "@/components/footer";
import Navbar from "@/components/navbar";
import { getSession } from "@/lib/action";
import { redirect } from "next/navigation";
import { SessionProvider } from "../session-context";

export default async function mainLayout({
    children }: {
        children: React.ReactNode;
    }) {

    const session = await getSession();

    if (!session.isLoggedIn) {
        redirect('/auth-page');
    }

    return (
        <SessionProvider session={session}>
            <div className="h-full w-full">
                <Navbar />
                {children}
                <Footer />
            </div>
        </SessionProvider>
    )
}