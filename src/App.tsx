import { useCallback, useEffect, useState } from "react";
import { Cursor } from "./components/Cursor";
import { Header } from "./components/Header";
import { Preloader } from "./components/Preloader";
import { ScrollShovel } from "./components/ScrollShovel";
import { WhatsAppFab } from "./components/WhatsAppFab";
import { Coverage } from "./sections/Coverage";
import { Fleet } from "./sections/Fleet";
import { Footer } from "./sections/Footer";
import { Hero } from "./sections/Hero";
import { Leveling } from "./sections/Leveling";
import { Numbers } from "./sections/Numbers";
import { Process } from "./sections/Process";
import { Quote } from "./sections/Quote";
import { Services } from "./sections/Services";
import { Social } from "./sections/Social";
import { useReveal } from "./lib/useReveal";
import { useSmoothScroll } from "./lib/useSmoothScroll";
import { prefersReducedMotion } from "./lib/env";

const preloadHeavyModules = (): Promise<unknown> =>
  Promise.all([
    import("./three/SceneCanvas"),
    import("./three/HeroScene"),
    import("./three/FleetScene"),
    import("./three/LevelingScene"),
    document.fonts.ready,
  ]);

export const App = () => {
  const [assetsReady, setAssetsReady] = useState(false);
  const [introDone, setIntroDone] = useState(false);

  useEffect(() => {
    document.body.classList.add("is-loading");
    let cancelled = false;
    const minimumWait = new Promise((resolve) => window.setTimeout(resolve, prefersReducedMotion() ? 0 : 900));
    void Promise.all([preloadHeavyModules(), minimumWait])
      .catch(() => undefined)
      .then(() => {
        if (!cancelled) setAssetsReady(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const handleIntroDone = useCallback(() => {
    document.body.classList.remove("is-loading");
    document.body.classList.add("has-cursor");
    setIntroDone(true);
  }, []);

  useSmoothScroll({ enabled: introDone });
  useReveal(introDone);

  return (
    <>
      <Preloader ready={assetsReady} onDone={handleIntroDone} />
      <Cursor />
      <div className="grain" aria-hidden="true" />
      <Header />
      <main>
        <Hero introDone={introDone} />
        <Numbers />
        <Services />
        <Fleet />
        <Leveling />
        <Process />
        <Coverage />
        <Quote />
        <Social />
      </main>
      <Footer />
      <WhatsAppFab />
      <ScrollShovel visible={introDone} />
    </>
  );
};
