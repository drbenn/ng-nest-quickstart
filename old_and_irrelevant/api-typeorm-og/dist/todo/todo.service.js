"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TodoService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const todo_entity_1 = require("./todo.entity");
const nest_winston_1 = require("nest-winston");
let TodoService = class TodoService {
    constructor(todoRepository, logger) {
        this.todoRepository = todoRepository;
        this.logger = logger;
    }
    findAll() {
        try {
            return this.todoRepository.find();
        }
        catch (error) {
            this.logger.log('error', `Error finding all todos: ${error}`);
        }
    }
    findOne(id) {
        try {
            return this.todoRepository.findOne({ where: { id } });
        }
        catch (error) {
            this.logger.log('error', `Error finding one todo: ${error}`);
        }
    }
    create(todo) {
        try {
            const newTodo = this.todoRepository.create(todo);
            return this.todoRepository.save(newTodo);
        }
        catch (error) {
            this.logger.log('error', `Error creating one todo: ${error}`);
        }
    }
    async update(id, todo) {
        try {
            await this.todoRepository.update(id, todo);
            return this.todoRepository.findOne({ where: { id } });
        }
        catch (error) {
            this.logger.log('error', `Error updating one todo: ${error}`);
        }
    }
    async remove(id) {
        try {
            await this.todoRepository.delete(id);
        }
        catch (error) {
            this.logger.log('error', `Error removing one todo: ${error}`);
        }
    }
};
exports.TodoService = TodoService;
exports.TodoService = TodoService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(todo_entity_1.Todo)),
    __param(1, (0, common_1.Inject)(nest_winston_1.WINSTON_MODULE_PROVIDER)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        common_1.Logger])
], TodoService);
//# sourceMappingURL=todo.service.js.map