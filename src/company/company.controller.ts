import { Controller, Post, Get, Body } from '@nestjs/common';
import { CompanyService } from './company.service';

@Controller('companies')
export class CompanyController {
  constructor(private companyService: CompanyService) {}

  @Post()
  async create(@Body('name') name: string) {
    return this.companyService.create(name);
  }

  @Get()
  async findAll() {
    return this.companyService.findAll();
  }
}
