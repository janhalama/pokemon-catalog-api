import { MikroORM } from '@mikro-orm/core';
import { getDatabaseConfig } from '../config/database';
import { getEnvironmentConfig } from '../config/environment';

export class DatabaseService {
  private orm: MikroORM | null = null;
  private logger?: (msg: string) => void;

  constructor(logger?: (msg: string) => void) {
    this.logger = logger;
  }

  async initialize(): Promise<void> {
    try {
      const env = getEnvironmentConfig();
      const config = getDatabaseConfig(env, this.logger ?? (() => {}));
      
      this.orm = await MikroORM.init(config);

      this.logger?.('Database connection established successfully');
    } catch (error) {
      this.logger?.('Failed to initialize database: ' + (error as Error).message);
      throw error;
    }
  }

  async connect(): Promise<void> {
    if (!this.orm) {
      throw new Error('Database not initialized. Call initialize() first.');
    }

    try {
      await this.orm.connect();
      this.logger?.('Database connected successfully');
    } catch (error) {
      this.logger?.('Failed to connect to database: ' + (error as Error).message);
      throw error;
    }
  }

  async disconnect(): Promise<void> {
    if (this.orm) {
      try {
        await this.orm.close();
        this.logger?.('Database disconnected successfully');
      } catch (error) {
        this.logger?.('Error disconnecting from database: ' + (error as Error).message);
        throw error;
      }
    }
  }

  async runMigrations(): Promise<void> {
    if (!this.orm) {
      throw new Error('Database not initialized. Call initialize() first.');
    }

    try {
      const migrator = this.orm.getMigrator();
      await migrator.up();
      this.logger?.('Migrations completed successfully');
    } catch (error) {
      this.logger?.('Failed to run migrations: ' + (error as Error).message);
      throw error;
    }
  }

  async ping(): Promise<boolean> {
    if (!this.orm) {
      throw new Error('Database not initialized. Call initialize() first.');
    }

    try {
      const connection = this.orm.em.getConnection();
      await connection.execute('SELECT 1');
      return true;
    } catch (error) {
      this.logger?.('Database ping failed: ' + (error as Error).message);
      return false;
    }
  }

  getEntityManager() {
    if (!this.orm) {
      throw new Error('Database not initialized. Call initialize() first.');
    }
    return this.orm.em;
  }

  getOrm(): MikroORM {
    if (!this.orm) {
      throw new Error('Database not initialized. Call initialize() first.');
    }
    return this.orm;
  }
} 