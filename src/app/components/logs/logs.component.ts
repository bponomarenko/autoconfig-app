import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Subscription } from 'rxjs/Rx';

@Component({
  selector: 'ac-logs',
  templateUrl: './logs.component.html',
  styleUrls: ['./logs.component.css']
})
export class LogsComponent implements OnDestroy {
  private routeSubscription: Subscription;

  constructor(private route: ActivatedRoute) {
    this.routeSubscription = this.route.params.subscribe((params: Params) => {
      // Display logs based on the name || first item
    });
  }

  ngOnDestroy() {
    this.routeSubscription.unsubscribe();
  }

}
