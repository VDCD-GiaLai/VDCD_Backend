import { PartialType } from '@nestjs/swagger';
import { CreateOperationFieldDto } from './create-operation-field.dto';

export class UpdateOperationFieldDto extends PartialType(
  CreateOperationFieldDto,
) {}
