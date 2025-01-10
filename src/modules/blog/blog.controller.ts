import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, ParseIntPipe } from '@nestjs/common';
import { BlogService } from './blog.service';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { AuthGuard } from '../auth/guard/auth.guard';
import { plainToClass } from 'class-transformer';
import { objectSanitizer } from 'src/common/utils/object-sanitizer.utility';

@Controller('blog')
@UseGuards(AuthGuard)
export class BlogController {
	constructor(private readonly blogService: BlogService) { }

	/**
	 * New blog creation process
	 * @param createBlogDto - Blog data sent by user
	 */
	@Post()
	create(@Body() createBlogDto: CreateBlogDto) {
		createBlogDto = plainToClass(CreateBlogDto, createBlogDto, {
			excludeExtraneousValues: true,
		});

		objectSanitizer(createBlogDto);

		return this.blogService.create(createBlogDto);
	}

	/**
	 * Retrieve all blogs
	 */
	@Get()
	findAll() {
		return this.blogService.findAll();
	}

	/**
	 * Retrieve single blog by id
	 * @param id - Blog's id
	 */
	@Get(':id')
	findOne(@Param('id', ParseIntPipe) id: number) {
		return this.blogService.findOne(id);
	}

	/**
	 * Update blog post
	 * @param id - Blog's id
	 * @param updateBlogDto - Blog's new data
	 */
	@Patch(':id')
	update(@Param("id", ParseIntPipe) id: number, @Body() updateBlogDto: UpdateBlogDto) {
		updateBlogDto = plainToClass(CreateBlogDto, updateBlogDto, {
			excludeExtraneousValues: true,
		});

		objectSanitizer(updateBlogDto);

		return this.blogService.update(id, updateBlogDto);
	}

	/**
	 * Blog removal process
	 */
	@Delete("/:id")
	remove(@Param("id", ParseIntPipe) id: number) {
		return this.blogService.remove(id);
	}
}
