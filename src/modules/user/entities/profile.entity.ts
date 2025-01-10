import { BaseEntity } from "src/common/abstracts/base.entity";
import { EntityName } from "src/common/enums/entity.enum";
import { Column, Entity, OneToOne } from "typeorm";
import { UserEntity } from "./user.entity";

@Entity(EntityName.PROFILE)
export class ProfileEntity extends BaseEntity {
	@Column()
	fullname: string;
	@Column()
	nickname: string;
	@Column({ nullable: true })
	bio: string;
	@Column({ unique: true, nullable: true })
	email: string;
	@Column({ nullable: true })
	new_email: string;
	@Column({ nullable: true, default: false })
	verify_email: boolean;
	@Column({ nullable: true })
	gender: string;
	@Column({ nullable: true })
	birthday: Date;
	@Column({ nullable: true })
	linkedin_profile: string;
	@Column()
	userId: number;
	@OneToOne(() => UserEntity, (user) => user.profile, { onDelete: "CASCADE" })
	user: UserEntity;
}
