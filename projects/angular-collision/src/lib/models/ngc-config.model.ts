/**
 * Optional module config
 */
export class NgcConfig {
  constructor(
    /**
     * Disable interval position checking
     */
    public disableInterval: boolean = false,
    /**
     * Interval time for position checking
     */
    public intervalTime: number = 100
  ) {}
}
