import {
  Body,
  Controller,
  DefaultValuePipe,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { ConfigService } from 'src/config/config.service';
import { ApiKeyGuard } from 'src/guards/api-key/api-key.guard';
import { CreateEpisodeDto } from './dto/create-episode.dto';
import { EpisodesService } from './episodes.service';
import { IsPositivePipe } from './pipes/is-positive.pipe';

@Controller('episodes')
export class EpisodesController {
  constructor(
    private configService: ConfigService,
    private episodesService: EpisodesService,
  ) {}

  @Get()
  findAll(
    @Query('sort') sort: 'asc' | 'desc' = 'desc',
    @Query('limit', new DefaultValuePipe(100), ParseIntPipe, IsPositivePipe)
    limit: number,
  ) {
    console.log(sort);
    console.log(limit);

    return this.episodesService.findAll(sort);
  }

  @Get('featured')
  findFeatured() {
    return this.episodesService.findFeatured();
  }

  @Get(':id')
  findOne(@Param() id: string) {
    console.log(id);

    const episode = this.episodesService.findOne(id);

    if (!episode) {
      throw new NotFoundException('Episode not found');
    }
    return episode;
  }

  @UseGuards(ApiKeyGuard)
  @Post()
  create(@Body(ValidationPipe) input: CreateEpisodeDto) {
    console.log(input);

    return this.episodesService.create(input);
  }
}
