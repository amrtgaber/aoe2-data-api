import { PartialType } from '@nestjs/swagger';
import { CreateDraftDto } from './create-draft.dto';

export class UpdateDraftDto extends PartialType(CreateDraftDto) {}
