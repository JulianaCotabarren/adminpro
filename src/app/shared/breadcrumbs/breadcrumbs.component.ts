import { Component, OnDestroy } from '@angular/core';
import { ActivationEnd, Router } from '@angular/router';
import { Subscription, filter, map } from 'rxjs';

@Component({
  selector: 'app-breadcrumbs',
  templateUrl: './breadcrumbs.component.html',
  styles: [],
})
export class BreadcrumbsComponent implements OnDestroy {
  title: string = '';
  titleSubs$: Subscription;

  constructor(private router: Router) {
    this.titleSubs$ = this.getRouteData().subscribe(
      ({ title }) => (this.title = title)
    );
  }

  ngOnDestroy(): void {
    this.titleSubs$.unsubscribe();
  }

  getRouteData() {
    return this.router.events.pipe(
      filter<any>((event) => event instanceof ActivationEnd),
      filter((event: ActivationEnd) => event.snapshot.firstChild === null),
      map((event: ActivationEnd) => event.snapshot.data)
    );
  }
}
