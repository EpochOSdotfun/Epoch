import { PrismaClient } from '@prisma/client';
import pino from 'pino';

// Define types locally to avoid Prisma generation dependency
type AlertType = 
  | 'SWAP_FAILURE'
  | 'SLIPPAGE_EXCEEDED'
  | 'FEE_CLAIM_MISSED'
  | 'RPC_ERROR'
  | 'BALANCE_DRIFT'
  | 'SUSPICIOUS_TX'
  | 'CIRCUIT_BREAKER'
  | 'EPOCH_FAILED'
  | 'LOW_TREASURY';

type AlertSeverity = 'INFO' | 'WARNING' | 'ERROR' | 'CRITICAL';

const logger = pino({ name: 'circuit-breaker' });

interface CircuitBreakerConfig {
  maxFailures: number;
  resetTimeout: number; // milliseconds
}

enum State {
  CLOSED = 'CLOSED',     // Normal operation
  OPEN = 'OPEN',         // Blocking requests
  HALF_OPEN = 'HALF_OPEN' // Testing if service recovered
}

export class CircuitBreaker {
  private prisma: PrismaClient;
  private config: CircuitBreakerConfig;
  private state: State = State.CLOSED;
  private failureCount: number = 0;
  private lastFailureTime: number = 0;
  private successCount: number = 0;

  constructor(prisma: PrismaClient, config: CircuitBreakerConfig) {
    this.prisma = prisma;
    this.config = config;
  }

  /**
   * Check if the circuit breaker is open (blocking requests)
   */
  isOpen(): boolean {
    if (this.state === State.OPEN) {
      // Check if we should transition to half-open
      const timeSinceFailure = Date.now() - this.lastFailureTime;
      if (timeSinceFailure >= this.config.resetTimeout) {
        this.state = State.HALF_OPEN;
        logger.info('Circuit breaker transitioning to HALF_OPEN');
        return false;
      }
      return true;
    }
    return false;
  }

  /**
   * Record a successful operation
   */
  recordSuccess(): void {
    if (this.state === State.HALF_OPEN) {
      this.successCount++;
      // Require 3 successes to close
      if (this.successCount >= 3) {
        this.reset();
        logger.info('Circuit breaker CLOSED after successful recovery');
      }
    } else {
      this.failureCount = 0;
    }
  }

  /**
   * Record a failed operation
   */
  async recordFailure(): Promise<void> {
    this.failureCount++;
    this.lastFailureTime = Date.now();
    this.successCount = 0;

    logger.warn({ failureCount: this.failureCount }, 'Circuit breaker recorded failure');

    if (this.failureCount >= this.config.maxFailures && this.state !== State.OPEN) {
      this.state = State.OPEN;
      logger.error('Circuit breaker OPENED due to repeated failures');

      // Create alert
      await this.prisma.alert.create({
        data: {
          type: AlertType.CIRCUIT_BREAKER,
          severity: AlertSeverity.CRITICAL,
          message: `Circuit breaker opened after ${this.failureCount} failures`,
          meta: {
            failureCount: this.failureCount,
            lastFailureTime: new Date(this.lastFailureTime).toISOString(),
          },
        },
      });
    }
  }

  /**
   * Reset the circuit breaker
   */
  reset(): void {
    this.state = State.CLOSED;
    this.failureCount = 0;
    this.successCount = 0;
    this.lastFailureTime = 0;
  }

  /**
   * Get current state
   */
  getState(): State {
    return this.state;
  }

  /**
   * Get metrics
   */
  getMetrics(): {
    state: State;
    failureCount: number;
    successCount: number;
    lastFailureTime: number;
  } {
    return {
      state: this.state,
      failureCount: this.failureCount,
      successCount: this.successCount,
      lastFailureTime: this.lastFailureTime,
    };
  }

  /**
   * Force open the circuit breaker (manual intervention)
   */
  async forceOpen(reason: string): Promise<void> {
    this.state = State.OPEN;
    this.lastFailureTime = Date.now();

    logger.warn({ reason }, 'Circuit breaker force opened');

    await this.prisma.alert.create({
      data: {
        type: AlertType.CIRCUIT_BREAKER,
        severity: AlertSeverity.WARNING,
        message: `Circuit breaker manually opened: ${reason}`,
      },
    });
  }

  /**
   * Force close the circuit breaker (manual intervention)
   */
  async forceClose(reason: string): Promise<void> {
    this.reset();

    logger.info({ reason }, 'Circuit breaker force closed');

    await this.prisma.alert.create({
      data: {
        type: AlertType.CIRCUIT_BREAKER,
        severity: AlertSeverity.INFO,
        message: `Circuit breaker manually closed: ${reason}`,
      },
    });
  }
}

