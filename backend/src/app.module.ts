import {Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';

import {ConfigModule, ConfigService} from "@nestjs/config";

// Контроллеры
import { CategoryController } from './controllers/category.controller';
import { PlantController } from './controllers/plant.controller';
import { WeekController } from './controllers/week.controller';
import { DayController } from './controllers/day.controller';
import { TagController } from './controllers/tag.controller';
import { WeekNameController } from './controllers/weekname.controller';
import { DocController} from "./controllers/doc.controller";

// Сервисы
import { CategoryService } from './services/category.service';
import { PlantService } from './services/plant.service';
import { WeekService } from './services/week.service';
import { DayService } from './services/day.service';
import { TagService } from './services/tag.service';
import { WeekNameService } from './services/weekname.service';
import { DocService } from './services/doc.service';

// Сущности
import { Category } from './entities/category.entity';
import { Plant } from './entities/plant.entity';
import { Week } from './entities/week.entity';
import { Day } from './entities/day.entity';
import { Tag } from './entities/tag.entity';
import { WeekName } from './entities/weekname.entity';
import { Doc } from "./entities/doc.entity";

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: (configService: ConfigService) => ({
                type: 'postgres',
                host: configService.get('DB_HOST'),
                port: +configService.get('DB_PORT'),
                username: configService.get('DB_USERNAME'),
                password: configService.get('DB_PASSWORD'),
                database: configService.get('DB_DATABASE'),
                entities: [__dirname + '/**/*.entity{.ts,.js}'],
                synchronize: true, // False for production
                logging: true,
            }),
            inject: [ConfigService],
        }),
        TypeOrmModule.forFeature([Category, Plant, Week, Day, Tag, WeekName, Doc])
    ],
    controllers: [
        CategoryController,
        PlantController,
        WeekController,
        DayController,
        TagController,
        WeekNameController,
        DocController
    ],
    providers: [
        CategoryService,
        PlantService,
        WeekService,
        DayService,
        TagService,
        WeekNameService,
        DocService
    ],
})
export class AppModule {
}