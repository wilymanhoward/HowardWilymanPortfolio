import { lazy, Suspense } from "react";
import "./App.css";
import { getProjectSlug, useProjectSlug } from "./router";

const CharacterModel = lazy(() => import("./components/Character"));
const MainContainer = lazy(() => import("./components/MainContainer"));
const ProjectPage = lazy(() => import("./components/ProjectPage"));
import { LoadingProvider } from "./context/LoadingProvider";

// A project link opened directly (e.g. shared /project/codu) loads only the
// project page, skipping the 3D intro. Projects opened from the gallery show
// on top of the main page so "Back" returns to the same scroll position.
const openedOnProject = getProjectSlug() !== null;

const App = () => {
  const slug = useProjectSlug();

  if (openedOnProject) {
    return (
      <Suspense>
        {slug ? (
          <ProjectPage slug={slug} standalone />
        ) : (
          <RedirectHome />
        )}
      </Suspense>
    );
  }

  return (
    <>
      <LoadingProvider>
        <Suspense>
          <MainContainer>
            <Suspense>
              <CharacterModel />
            </Suspense>
          </MainContainer>
        </Suspense>
      </LoadingProvider>
      {slug && (
        <Suspense>
          <ProjectPage slug={slug} standalone={false} />
        </Suspense>
      )}
    </>
  );
};

// Navigating back to "/" from a directly opened project page needs a full
// load so the main page (3D model, scroll setup) starts fresh.
const RedirectHome = () => {
  window.location.replace("/");
  return null;
};

export default App;
