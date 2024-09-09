import { Injectable } from '@nestjs/common';
import { HealthCheckService, MemoryHealthIndicator, TypeOrmHealthIndicator } from '@nestjs/terminus';

@Injectable()
export class HealthService {
  constructor(
    private health: HealthCheckService,
    private memory: MemoryHealthIndicator,
    private db: TypeOrmHealthIndicator,
  ) { }
  async check() {
    return this.health.check([
      () => this.db.pingCheck('database'),
      () => this.memory.checkHeap('memory', 150 * 1024 * 1024),
    ]);
  }
}
