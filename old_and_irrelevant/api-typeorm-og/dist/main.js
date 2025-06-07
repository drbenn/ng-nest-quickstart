"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const cookieParser = require("cookie-parser");
const config_1 = require("@nestjs/config");
const common_1 = require("@nestjs/common");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const configService = app.get(config_1.ConfigService);
    const port = configService.get('APP_PORT') || 3000;
    app.use(cookieParser());
    app.setGlobalPrefix(configService.get('URL_GLOBAL_PREFIX'));
    app.enableCors({
        origin: [
            process.env.FRONTEND_URL
        ],
        credentials: true,
    });
    app.useGlobalPipes(new common_1.ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }));
    await app.listen(port ?? 3000);
}
bootstrap();
//# sourceMappingURL=main.js.map