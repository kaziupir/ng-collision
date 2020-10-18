import { Subscription } from 'rxjs';

/**
 * Tracked element in library service
 */
export interface NgcTrackedElement {
  /**
   * Element id
   */
  id: number;

  /**
   * Element changes observable subscription
   */
  subscription: Subscription;
}
