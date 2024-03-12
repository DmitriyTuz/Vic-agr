import { plainToInstance } from 'class-transformer';
import { CreateUserDto } from './create-user.dto';
import { validate } from 'class-validator';

describe('create-task.dto', () => {
  it('task пустая', async () => {
    let dto: CreateUserDto = {
      name: '',
      password: '11111',
      phone: '',
      type: '',
      // companyId: 1,
    };
    const ofImportDto = plainToInstance(CreateUserDto, dto);
    const errors = await validate(ofImportDto);
    expect(errors.map((err) => err.property).includes('name')).toBeTruthy();
  });
});
