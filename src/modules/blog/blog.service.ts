import { Inject, Injectable, NotFoundException, Scope } from '@nestjs/common';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { BlogEntity } from './entities/blog.entity';
import { Repository } from 'typeorm';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { BlogStatus } from './enums/status.enum';

@Injectable({ scope: Scope.REQUEST })
export class BlogService {
	constructor(
		// Register blog repository
		@InjectRepository(BlogEntity)
		private blogRepository: Repository<BlogEntity>,

		// Register current request
		@Inject(REQUEST) private request: Request,
	) { }

	/**
	 * Create a new blog on user's request
	 * @param createBlogDto - Blog data sent by client
	 */
	async create(createBlogDto: CreateBlogDto) {
		/** Extract user's data from request */
		const user = this.request.user;

		/** Create a new blog */
		let blog: BlogEntity = this.blogRepository.create({
			...createBlogDto,
			status: BlogStatus.DRAFT,
			authorId: user.id,
		});

		/** Save blog data in database */
		blog = await this.blogRepository.save(blog);

		return "Blog saved successfully";
	}

	/**
	 * Retrieve all blogs
	 */
	async findAll() {
		return await this.blogRepository.find({})
	}

	/**
	 * Retrieve single blog by id
	 * @param id - Blog's id
	 */
	async findOne(id: number) {
		const blog = await this.blogRepository.findOneBy({ id });
		if (!blog) {
			throw new NotFoundException("Blog was not found")
		}
		return blog;
	}

	/**
	 * Update blog post
	 * @param id - Blog's id
	 * @param updateBlogDto - Blog's new data
	 */
	async update(id: number, updateBlogDto: UpdateBlogDto) {
		let {
			title,
			content,
			description,
			time_for_study,
		} = updateBlogDto;

		// Retrieve blog data
		const blog = await this.findOne(id);


		// Merge updated fields into the existing blog object
		Object.assign(blog, {
			title: title || blog.title,
			description: description || blog.description,
			content: content || blog.content,
			time_for_study: time_for_study || blog.time_for_study,
		});

		// Save updated blog data
		await this.blogRepository.save(blog);

		return "Blog updated successfully";
	}

	/**
	 * Blog removal process
	 */
	async remove(id: number) {
		// Check blog existence
		await this.findOne(id);
		// Delete blog from database
		await this.blogRepository.delete({ id });

		return "Blog removed successfully";
	}
}
