import { Route, Router } from "@solidjs/router";
import { type Component, ErrorBoundary, Suspense } from "solid-js";
import { ErrorFallback } from "./modules/common/components/error-fallback";
import { I18nContextProvider } from "./modules/common/contexts/i18n";
import { Homepage } from "./modules/home/components/homepage";
import { ToasterProvider } from "./ui/toaster";

export const App: Component = () => {
  return (
    <Router
      root={(props) => (
        <I18nContextProvider>
          <ErrorBoundary fallback={ErrorFallback}>
            <Suspense>
              <ToasterProvider>{props.children}</ToasterProvider>
            </Suspense>
          </ErrorBoundary>
        </I18nContextProvider>
      )}
    >
      <Route path="/" component={Homepage} />
    </Router>
  );
};
