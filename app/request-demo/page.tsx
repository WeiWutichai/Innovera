import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import DemoRequestForm from "./components/DemoRequestForm";

export default function RequestDemoPage() {
    return (
        <main className="min-h-screen relative bg-white flex flex-col font-sans">
            <Navbar />
            <div className="pt-20 flex-grow">
                <DemoRequestForm />
            </div>
            <Footer />
        </main>
    );
}
