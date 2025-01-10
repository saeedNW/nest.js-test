import { TimestampedEntity } from "src/common/abstracts/base.entity";
import { EntityName } from "src/common/enums/entity.enum";
import { Column, Entity, ManyToOne, OneToMany } from "typeorm";
import { BlogStatus } from "../enums/status.enum";
import { UserEntity } from "src/modules/user/entities/user.entity";

@Entity(EntityName.BLOG)
export class BlogEntity extends TimestampedEntity {
	@Column()
	title: string;
	@Column()
	description: string;
	@Column()
	content: string;
	@Column({ default: BlogStatus.DRAFT })
	status: string;
	@Column()
	time_for_study: string;
	@Column()
	authorId: number;
	@ManyToOne(() => UserEntity, (user) => user.blogs, { onDelete: "CASCADE" })
	author: UserEntity;
}
