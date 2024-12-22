import {
  patchState,
  signalStore,
  withComputed,
  withHooks,
  withMethods,
  withProps,
  withState,
} from '@ngrx/signals';
import { computed, DestroyRef, inject } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter, tap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

export interface IBreadcrumb {
  label: string;
  path?: string[];
}

interface BreadcrumbState {
  _pageTitle: string;
  params: Record<string, string>;
  _breadcrumbs: IBreadcrumb[];
}

const initialState: BreadcrumbState = {
  _pageTitle: '',
  params: {},
  _breadcrumbs: [],
};
export const BreadcrumbStore = signalStore(
  { providedIn: 'root' },
  withProps(() => ({
    _router: inject(Router),
    _destroyRef: inject(DestroyRef),
    _route: inject(ActivatedRoute),
  })),
  withState(initialState),
  withMethods((store) => ({
    updatePageTitleParams: (values: Record<string, string>) => {
      patchState(store, { params: values });
    },
  })),
  withComputed((store) => {
    const t = (template: string, values: Record<string, string>) =>
      template.replace(/:([a-zA-Z0-9_]+)/g, (_, key) => values[key] || '');
    return {
      pageTitle: computed(() => t(store._pageTitle(), store.params())),
      breadcrumbs: computed(
        () =>
          store._breadcrumbs().map((breadcrumb) => ({
            path: t(
              breadcrumb.path ? '#' + breadcrumb.path.join('/') : '',
              store.params()
            ),
            label: t(breadcrumb.label, store.params()),
          })),
        {}
      ),
    };
  }),

  withHooks((store) => ({
    onInit: () => {
      store._router.events
        .pipe(
          filter((event) => event instanceof NavigationEnd),
          tap(() => {
            let _pageTitle = 'Dashboard';
            let _breadcrumbs = [] as { label: string; link?: string[] }[];
            let currentRoute: ActivatedRoute | null = store._route.root;
            while (currentRoute) {
              if (currentRoute.snapshot.data['routeLabel'])
                _pageTitle = currentRoute.snapshot.data['routeLabel'];
              if (currentRoute.snapshot.data['breadcrumbs'])
                _breadcrumbs = currentRoute.snapshot.data['breadcrumbs'];
              currentRoute = currentRoute.firstChild;
            }
            patchState(store, { _pageTitle, _breadcrumbs });
          }),
          takeUntilDestroyed(store._destroyRef)
        )
        .subscribe();
    },
  }))
);
