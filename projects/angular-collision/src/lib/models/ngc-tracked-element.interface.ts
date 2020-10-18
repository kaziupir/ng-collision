import { Subscription } from 'rxjs';

/**
 * Tracked element in library service
 */
export interface NgcTrackedElement {
  id: number;
  subscription: Subscription;
}
