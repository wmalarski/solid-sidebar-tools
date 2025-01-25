import { type Component, ErrorBoundary, Suspense } from "solid-js";
import { ErrorFallback } from "./modules/common/components/error-fallback";
import { CurrentUrlContextProvider } from "./modules/common/contexts/current-url";
import { I18nContextProvider } from "./modules/common/contexts/i18n";
import { Homepage } from "./modules/home/components/homepage";

export const App: Component = () => {
  return (
    <ErrorBoundary fallback={ErrorFallback}>
      <Suspense>
        <I18nContextProvider>
          <CurrentUrlContextProvider>
            <Homepage />
          </CurrentUrlContextProvider>
        </I18nContextProvider>
      </Suspense>
    </ErrorBoundary>
  );
};
