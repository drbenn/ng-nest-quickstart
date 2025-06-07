"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const users_module_1 = require("./users/users.module");
const auth_module_1 = require("./auth/auth.module");
const typeorm_1 = require("@nestjs/typeorm");
const config_1 = require("@nestjs/config");
const todo_module_1 = require("./todo/todo.module");
const nest_winston_1 = require("nest-winston");
const winston = require("winston");
const throttler_1 = require("@nestjs/throttler");
const email_module_1 = require("./email/email.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                envFilePath: determineEnvFilePath()
            }),
            throttler_1.ThrottlerModule.forRootAsync({
                imports: [config_1.ConfigModule],
                inject: [config_1.ConfigService],
                useFactory: (config) => [
                    {
                        ttl: config.get('THROTTLE_TIME_TO_LIVE'),
                        limit: config.get('THROTTLE_LIMIT'),
                    },
                ],
            }),
            typeorm_1.TypeOrmModule.forRootAsync({
                imports: [config_1.ConfigModule],
                inject: [config_1.ConfigService],
                useFactory: (config) => {
                    return {
                        type: 'postgres',
                        host: config.get('POSTGRES_HOST'),
                        port: config.get('POSTGRES_PORT'),
                        username: config.get('POSTGRES_USER'),
                        password: config.get('POSTGRES_PASSWORD'),
                        database: config.get('POSTGRES_DB'),
                        entities: [__dirname + '/**/*.entity{.ts,.js}'],
                        autoLoadEntities: true,
                        synchronize: false,
                    };
                },
            }),
            nest_winston_1.WinstonModule.forRootAsync({
                useFactory: () => ({
                    transports: [
                        new winston.transports.Console({
                            format: winston.format.combine(winston.format.timestamp(), nest_winston_1.utilities.format.nestLike()),
                        }),
                        new winston.transports.File({
                            filename: 'logs/error.log',
                            level: 'error',
                        }),
                        new winston.transports.File({ filename: 'logs/combined.log' }),
                    ],
                })
            }),
            users_module_1.UsersModule, auth_module_1.AuthModule, todo_module_1.TodoModule, email_module_1.EmailModule
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService],
    })
], AppModule);
function determineEnvFilePath() {
    const envPaths = ['env/.common.env'];
    const env = process.env.NODE_ENV || 'development';
    switch (env) {
        case 'development':
            envPaths.push('env/.development.local.env');
            break;
        case 'namecheap_production':
            envPaths.push('env/.namecheap.production.env');
            break;
        case 'docker-production':
            envPaths.push('env/.docker.production.env');
            break;
        case 'nginx-production':
            envPaths.push('env/.nginx.production.env');
            break;
        default:
            envPaths.push('env/.development.local.env');
    }
    return envPaths;
}
//# sourceMappingURL=app.module.js.map