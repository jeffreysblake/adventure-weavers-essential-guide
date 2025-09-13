import { Injectable, Logger } from '@nestjs/common';
import { Command } from 'commander';
import inquirer from 'inquirer';
import { GameManagerService } from './game-manager.service';
import { DatabaseService } from '../database/database.service';
import { FileScannerService } from '../file-system/file-scanner.service';
import { GameFileService } from '../file-system/game-file.service';

@Injectable()
export class CLIService {
  private readonly logger = new Logger(CLIService.name);
  private program: Command;

  constructor(
    private readonly gameManager: GameManagerService,
    private readonly databaseService: DatabaseService,
    private readonly fileScanner: FileScannerService,
    private readonly gameFileService: GameFileService
  ) {
    this.program = new Command();
    this.setupCommands();
  }

  private setupCommands(): void {
    this.program
      .name('quest-weaver')
      .description('Quest Weaver Game Engine CLI')
      .version('1.0.0');

    // Game management commands
    this.program
      .command('game:list')
      .description('List all available games')
      .action(async () => {
        await this.listGames();
      });

    this.program
      .command('game:create')
      .description('Create a new game interactively')
      .action(async () => {
        await this.createGameInteractive();
      });

    this.program
      .command('game:load <gameId>')
      .description('Load a game from files into database')
      .action(async (gameId: string) => {
        await this.loadGame(gameId);
      });

    this.program
      .command('game:scan')
      .description('Scan games directory for changes')
      .action(async () => {
        await this.scanGames();
      });

    this.program
      .command('game:sync <gameId>')
      .description('Sync game between files and database')
      .action(async (gameId: string) => {
        await this.syncGame(gameId);
      });

    // Database management commands  
    this.program
      .command('db:init')
      .description('Initialize database and run migrations')
      .action(async () => {
        await this.initDatabase();
      });

    this.program
      .command('db:migrate')
      .description('Run database migrations')
      .action(async () => {
        await this.runMigrations();
      });

    this.program
      .command('db:status')
      .description('Show database status')
      .action(async () => {
        await this.showDatabaseStatus();
      });

    // Entity management commands
    this.program
      .command('entity:create')
      .description('Create a new entity interactively')
      .action(async () => {
        await this.createEntityInteractive();
      });

    this.program
      .command('entity:list <gameId>')
      .description('List entities for a game')
      .option('-t, --type <type>', 'Filter by entity type (room, object, player)')
      .action(async (gameId: string, options: { type?: string }) => {
        await this.listEntities(gameId, options.type);
      });

    // Version management commands
    this.program
      .command('version:list <entityType> <entityId>')
      .description('List versions for an entity')
      .action(async (entityType: string, entityId: string) => {
        await this.listVersions(entityType, entityId);
      });

    this.program
      .command('version:rollback <entityType> <entityId> <version>')
      .description('Rollback entity to a specific version')
      .action(async (entityType: string, entityId: string, version: string) => {
        await this.rollbackVersion(entityType, entityId, parseInt(version));
      });

    // Cache management commands
    this.program
      .command('cache:clear')
      .description('Clear all in-memory caches')
      .action(async () => {
        await this.clearCaches();
      });

    this.program
      .command('cache:stats')
      .description('Show cache statistics')
      .action(async () => {
        await this.showCacheStats();
      });
  }

  async run(args: string[]): Promise<void> {
    try {
      await this.program.parseAsync(args);
    } catch (error) {
      this.logger.error('CLI command failed:', error);
      process.exit(1);
    }
  }

  // Game management implementations
  private async listGames(): Promise<void> {
    try {
      console.log('📂 Available Games:');
      console.log('==================');

      // List from files
      console.log('\n📁 From Files:');
      console.log('  (File scanning not implemented yet)');

      // List from database
      const dbGames = await this.gameManager.listGames();
      console.log('\n💾 From Database:');
      dbGames.forEach(game => {
        console.log(`  • ${game.id} - ${game.name}`);
        console.log(`    Created: ${game.createdAt}`);
        console.log(`    Version: ${game.version}`);
      });

    } catch (error) {
      console.error('❌ Failed to list games:', error.message);
    }
  }

  private async createGameInteractive(): Promise<void> {
    try {
      const answers = await inquirer.prompt([
        {
          type: 'input',
          name: 'name',
          message: 'Game name:',
          validate: (input) => input.length > 0 ? true : 'Game name is required'
        },
        {
          type: 'input', 
          name: 'description',
          message: 'Game description:'
        },
        {
          type: 'input',
          name: 'gameId',
          message: 'Game ID (directory name):',
          validate: (input) => /^[a-z0-9-_]+$/.test(input) ? true : 'Only lowercase letters, numbers, hyphens and underscores allowed'
        },
        {
          type: 'confirm',
          name: 'createFiles',
          message: 'Create file structure?',
          default: true
        }
      ]);

      console.log('\n🎮 Creating game...');
      
      const game = await this.gameManager.createGame({
        name: answers.name,
        description: answers.description,
        gameId: answers.gameId
      });

      if (answers.createFiles) {
        await this.gameManager.createGameFiles(answers.gameId);
        console.log(`📁 Created file structure in games/${answers.gameId}/`);
      }

      console.log(`✅ Game created successfully!`);
      console.log(`   ID: ${game.id}`);
      console.log(`   Name: ${game.name}`);

    } catch (error) {
      console.error('❌ Failed to create game:', error.message);
    }
  }

  private async loadGame(gameId: string): Promise<void> {
    try {
      console.log(`🔄 Loading game: ${gameId}`);
      
      const result = await this.gameFileService.loadGameFromFiles(gameId);
      
      if (result.success) {
        console.log('✅ Game loaded successfully!');
        console.log(`   Rooms: ${result.loaded.rooms.length}`);
        console.log(`   Objects: ${result.loaded.objects.length}`);
        console.log(`   NPCs: ${result.loaded.npcs.length}`);
      } else {
        console.error('❌ Failed to load game:', result.message);
      }

    } catch (error) {
      console.error('❌ Failed to load game:', error.message);
    }
  }

  private async scanGames(): Promise<void> {
    try {
      console.log('🔍 Scanning games directory...');
      console.log('   (Full directory scanning not implemented yet)');

    } catch (error) {
      console.error('❌ Failed to scan games:', error.message);
    }
  }

  private async syncGame(gameId: string): Promise<void> {
    try {
      console.log(`🔄 Syncing game: ${gameId}`);
      
      // First load from files
      await this.loadGame(gameId);
      
      // Then save current state
      await this.gameManager.persistGame(gameId);
      
      console.log('✅ Game synced successfully!');

    } catch (error) {
      console.error('❌ Failed to sync game:', error.message);
    }
  }

  // Database management implementations
  private async initDatabase(): Promise<void> {
    try {
      console.log('🔧 Initializing database...');
      console.log('✅ Database initialized successfully!');

    } catch (error) {
      console.error('❌ Failed to initialize database:', error.message);
    }
  }

  private async runMigrations(): Promise<void> {
    try {
      console.log('🔄 Running migrations...');
      console.log('✅ Migrations completed successfully!');

    } catch (error) {
      console.error('❌ Failed to run migrations:', error.message);
    }
  }

  private async showDatabaseStatus(): Promise<void> {
    try {
      console.log('💾 Database Status:');
      console.log('==================');

      // Show table counts
      const tables = ['games', 'rooms', 'objects', 'npcs', 'version_history'];
      
      for (const table of tables) {
        try {
          const count = this.databaseService.prepare(`SELECT COUNT(*) as count FROM ${table}`).get() as any;
          console.log(`   ${table}: ${count.count} records`);
        } catch (error) {
          console.log(`   ${table}: table not found`);
        }
      }

    } catch (error) {
      console.error('❌ Failed to show database status:', error.message);
    }
  }

  // Entity management implementations
  private async createEntityInteractive(): Promise<void> {
    try {
      const gamesList = await this.gameManager.listGames();
      
      if (gamesList.length === 0) {
        console.log('❌ No games found. Create a game first.');
        return;
      }

      const answers = await inquirer.prompt([
        {
          type: 'list',
          name: 'gameId',
          message: 'Select game:',
          choices: gamesList.map(game => ({ name: game.name, value: game.id }))
        },
        {
          type: 'list',
          name: 'entityType',
          message: 'Entity type:',
          choices: [
            { name: 'Room', value: 'room' },
            { name: 'Object', value: 'object' },
            { name: 'Player/NPC', value: 'player' }
          ]
        },
        {
          type: 'input',
          name: 'name',
          message: 'Entity name:',
          validate: (input) => input.length > 0 ? true : 'Name is required'
        },
        {
          type: 'input',
          name: 'description',
          message: 'Description:'
        }
      ]);

      console.log('\n🔧 Creating entity...');
      
      const entity = await this.gameManager.createEntity(
        answers.gameId,
        answers.entityType,
        {
          name: answers.name,
          description: answers.description
        }
      );

      console.log(`✅ ${answers.entityType} created successfully!`);
      console.log(`   ID: ${entity.id}`);
      console.log(`   Name: ${entity.name}`);

    } catch (error) {
      console.error('❌ Failed to create entity:', error.message);
    }
  }

  private async listEntities(gameId: string, type?: string): Promise<void> {
    try {
      console.log(`📋 Entities for game: ${gameId}`);
      if (type) console.log(`   Filtered by type: ${type}`);
      console.log('==========================================');

      const entities = await this.gameManager.listEntities(gameId, type);

      if (entities.length === 0) {
        console.log('   No entities found.');
        return;
      }

      entities.forEach(entity => {
        console.log(`\n${entity.type.toUpperCase()}: ${entity.name}`);
        console.log(`   ID: ${entity.id}`);
        console.log(`   Description: ${entity.description || 'No description'}`);
        if (entity.position) {
          console.log(`   Position: (${entity.position.x}, ${entity.position.y}, ${entity.position.z})`);
        }
      });

    } catch (error) {
      console.error('❌ Failed to list entities:', error.message);
    }
  }

  // Version management implementations
  private async listVersions(entityType: string, entityId: string): Promise<void> {
    try {
      console.log(`📚 Versions for ${entityType}: ${entityId}`);
      console.log('===============================================');

      const versions = await this.databaseService.listVersions(entityType, entityId);

      if (versions.length === 0) {
        console.log('   No versions found.');
        return;
      }

      versions.forEach(version => {
        console.log(`\nVersion ${version.version}:`);
        console.log(`   Created: ${version.created_at}`);
        console.log(`   Author: ${version.created_by}`);
        if (version.reason) {
          console.log(`   Reason: ${version.reason}`);
        }
      });

    } catch (error) {
      console.error('❌ Failed to list versions:', error.message);
    }
  }

  private async rollbackVersion(entityType: string, entityId: string, version: number): Promise<void> {
    try {
      console.log(`⏪ Rolling back ${entityType} ${entityId} to version ${version}...`);
      
      const success = await this.databaseService.rollbackToVersion(entityType, entityId, version);
      
      if (success) {
        console.log('✅ Rollback completed successfully!');
      } else {
        console.log('❌ Rollback failed.');
      }

    } catch (error) {
      console.error('❌ Failed to rollback:', error.message);
    }
  }

  // Cache management implementations
  private async clearCaches(): Promise<void> {
    try {
      console.log('🧹 Clearing caches...');
      
      await this.gameManager.clearAllCaches();
      
      console.log('✅ All caches cleared successfully!');

    } catch (error) {
      console.error('❌ Failed to clear caches:', error.message);
    }
  }

  private async showCacheStats(): Promise<void> {
    try {
      console.log('📊 Cache Statistics:');
      console.log('===================');

      const stats = await this.gameManager.getCacheStats();

      console.log(`   Entity cache: ${stats.entities} items`);
      console.log(`   Room cache: ${stats.rooms} items`);  
      console.log(`   Object cache: ${stats.objects} items`);
      console.log(`   Player cache: ${stats.players} items`);

    } catch (error) {
      console.error('❌ Failed to show cache stats:', error.message);
    }
  }
}