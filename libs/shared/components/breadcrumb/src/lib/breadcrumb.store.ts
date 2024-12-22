import {
  patchState,
  signalStore, withComputed,
  withHooks,
  withMethods,
  withProps,
  withState
} from '@ngrx/signals';
import { computed, DestroyRef, inject } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter, tap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

interface Breadcrumb {
  label: string;
  link?: string[];
}

interface BreadcrumbState {
  _pageTitle: string;
  params: Record<string, string>;
  breadcrumbs: Breadcrumb[];
}

const initialState: BreadcrumbState = {
  _pageTitle: '',
  params: {},
  breadcrumbs: [],
};
export const BreadcrumbStore = signalStore(
  { providedIn: 'root' },
  withProps(() => ({
    _router: inject(Router),
    _destroyRef: inject(DestroyRef),
    _route: inject(ActivatedRoute),
  })),
  withState(initialState),
  withComputed((store) => ({
    pageTitle: computed(() => store._pageTitle().replace(/:([a-zA-Z0-9_]+)/g, (_, key) => store.params()[key] || ''))
  })),
  withMethods((store) => {
    const v = (template: string, values: Record<string, string>) =>
      template.replace(/:([a-zA-Z0-9_]+)/g, (_, key) => values[key] || '');

    return {
      updatePageTitleParams: (values: Record<string, string>) => {
        patchState(store, { params: values });
      },
    };
  }),
  withHooks((store) => ({
    onInit: () => {
      store._router.events
        .pipe(
          filter((event) => event instanceof NavigationEnd),
          tap(() => {
            let _pageTitle = 'Dashboard';
            let currentRoute: ActivatedRoute | null = store._route.root;
            while (currentRoute) {
              if (currentRoute.snapshot.data['routeLabel'])
                _pageTitle = currentRoute.snapshot.data['routeLabel'];
              currentRoute = currentRoute.firstChild;
            }
            patchState(store, { _pageTitle });
          }),
          takeUntilDestroyed(store._destroyRef)
        )
        .subscribe();
    },
  }))
);
