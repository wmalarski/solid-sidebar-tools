import { type Component, ErrorBoundary, Suspense } from "solid-js";
import { ErrorFallback } from "./modules/common/components/error-fallback";
import { I18nContextProvider } from "./modules/common/contexts/i18n";
import { Homepage } from "./modules/home/components/homepage";

export const App: Component = () => {
  return (
    <I18nContextProvider>
      <ErrorBoundary fallback={ErrorFallback}>
        <Suspense>
          <Homepage />
        </Suspense>
      </ErrorBoundary>
    </I18nContextProvider>
  );
};
