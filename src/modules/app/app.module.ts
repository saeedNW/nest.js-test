import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { resolve } from 'path';
import { TypeOrmConfig } from 'src/configs/typeorm.config';
import { AuthModule } from '../auth/auth.module';
import { UserModule } from '../user/user.module';
import { BlogModule } from '../blog/blog.module';

@Module({
	imports: [
		// Load .env
		ConfigModule.forRoot({
			envFilePath: resolve('.env'),
			isGlobal: true,
		}),

		// Load TypeOrm configs
		TypeOrmModule.forRoot(TypeOrmConfig()),

		AuthModule,
		UserModule,
		BlogModule
	],
	controllers: [],
	providers: [],
})
export class AppModule { }
