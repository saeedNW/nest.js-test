import { Column, Entity, JoinColumn, OneToMany, OneToOne } from "typeorm";
import { EntityName } from "src/common/enums/entity.enum";
import { TimestampedEntity } from "src/common/abstracts/base.entity";
import { OtpEntity } from "./otp.entity";
import { ProfileEntity } from "./profile.entity";
import { BlogEntity } from "src/modules/blog/entities/blog.entity";

@Entity(EntityName.USER)
export class UserEntity extends TimestampedEntity {
	@Column({ unique: true, nullable: true })
	phone: string;
	@Column({ nullable: true })
	new_phone: string;
	@Column({ nullable: true, default: false })
	verify_phone: boolean;
	@Column({ nullable: true })
	otpId: number;
	@OneToOne(() => OtpEntity, (otp) => otp.user, { nullable: true })
	@JoinColumn()
	otp: OtpEntity;
	@Column({ nullable: true })
	profileId: number;
	@OneToOne(() => ProfileEntity, (profile) => profile.user, { nullable: true })
	@JoinColumn()
	profile: ProfileEntity;
	@OneToMany(() => BlogEntity, (blog) => blog.author)
	blogs: BlogEntity[];
}
