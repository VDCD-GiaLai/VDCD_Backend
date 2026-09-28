import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { ReorderSolutionsDto } from '../dto/reorder-solutions.dto';

describe('Solution Reorder Unit Tests', () => {
  it('should validate valid ReorderSolutionsDto', async () => {
    const raw = {
      items: [
        { id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', order: 1 },
        { id: 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', order: 2 },
      ],
    };

    const dto = plainToInstance(ReorderSolutionsDto, raw);
    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });

  it('should fail validation when item id is not a valid UUID', async () => {
    const raw = {
      items: [{ id: 'not-a-uuid', order: 1 }],
    };

    const dto = plainToInstance(ReorderSolutionsDto, raw);
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
  });

  it('should fail validation when order is not a number', async () => {
    const raw = {
      items: [
        {
          id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
          order: 'invalid-number' as any,
        },
      ],
    };

    const dto = plainToInstance(ReorderSolutionsDto, raw);
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
  });
});
