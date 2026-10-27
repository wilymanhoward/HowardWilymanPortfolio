import { lazy, Suspense } from "react";
import "./App.css";
import { getProjectSlug, isCertificatesPath, usePathname } from "./router";

const CharacterModel = lazy(() => import("./components/Character"));
const MainContainer = lazy(() => import("./components/MainContainer"));
const ProjectPage = lazy(() => import("./components/ProjectPage"));
const CertificatesPage = lazy(() => import("./components/CertificatesPage"));
import { LoadingProvider } from "./context/LoadingProvider";

// A project link opened directly (e.g. shared /project/codu) loads only the
// project page, skipping the 3D intro. Projects opened from the gallery show
// on top of the main page so "Back" returns to the same scroll position.
const openedOnProject = getProjectSlug() !== null || isCertificatesPath();

const App = () => {
  const path = usePathname();
  const slug = getProjectSlug(path);
  const showCertificates = isCertificatesPath(path);

  if (openedOnProject) {
    return (
      <Suspense>
        {slug ? (
          <ProjectPage slug={slug} standalone />
        ) : showCertificates ? (
          <CertificatesPage standalone />
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
      {showCertificates && (
        <Suspense>
          <CertificatesPage standalone={false} />
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
