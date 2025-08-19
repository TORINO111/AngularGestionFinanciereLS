import { Injectable } from '@angular/core';
import { Observable, Subject, Subscription } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { LayoutEventType } from '../constants/events';
import { AppEvent } from '../helpers/eventType';

@Injectable({
  providedIn: 'root'
})
export class EventService {

  private handler = new Subject<AppEvent<any>>();
  constructor () { }

  /**
   * Broadcast the event
   * @param type type of event
   * @param payload payload
   */
  broadcast(type: LayoutEventType, payload: any = ""): void {
    this.handler.next({ type, payload });
  }

  /**
   * Subscribe to event
   * @param eventType type of event
   */
  on(eventType: LayoutEventType): Observable<AppEvent<any>> {
    return this.handler.pipe(filter(event => event.type === eventType));
  }
}
