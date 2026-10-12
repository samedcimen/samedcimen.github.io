import About from "@/components/About";
import Contact from "@/components/Contact";
import Experience from "@/components/Experience";
import Hero from "@/components/Hero";
import Skills from "@/components/Skills";

export default function Home() {
  return (
    <Experience>
      <main className="relative">
        <Hero />
        <About />
        <Skills />
        <Contact />
      </main>
    </Experience>
  );
}
