import { Route, Router } from "@solidjs/router";
import { ErrorBoundary, Suspense } from "solid-js";
import { ErrorFallback } from "./modules/common/components/error-fallback";
import { I18nContextProvider } from "./modules/common/contexts/i18n";
import { Homepage } from "./modules/home/components/homepage";

export const App = () => {
  return (
    <Router
      root={(props) => (
        <I18nContextProvider>
          <ErrorBoundary fallback={ErrorFallback}>
            <Suspense>{props.children}</Suspense>
          </ErrorBoundary>
        </I18nContextProvider>
      )}
    >
      <Route path="/" component={Homepage} />
    </Router>
  );
};
