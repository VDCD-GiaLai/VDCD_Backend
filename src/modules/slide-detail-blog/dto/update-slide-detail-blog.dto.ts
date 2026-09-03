// src/modules/slide-detail-blog/dto/update-slide-detail-blog.dto.ts
import { PartialType, OmitType } from '@nestjs/swagger';
import { CreateSlideDetailBlogDto } from './create-slide-detail-blog.dto';

/** All fields optional. slideId is NOT updatable. */
export class UpdateSlideDetailBlogDto extends PartialType(
  OmitType(CreateSlideDetailBlogDto, ['slideId'] as const),
) {}
