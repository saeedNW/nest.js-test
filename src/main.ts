import { ResponseTransformerInterceptor } from './common/interceptor/response-transformer.interceptor';
import { UnprocessableEntityPipe } from './common/pipe/unprocessable-entity.pipe';
import { HttpExceptionFilter } from './common/filters/exception.filter';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app/app.module';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	// initialize custom response interceptor
	app.useGlobalInterceptors(new ResponseTransformerInterceptor());
	// initialize custom validation pipe
	app.useGlobalPipes(new UnprocessableEntityPipe());
	// initialize custom exception filter
	app.useGlobalFilters(new HttpExceptionFilter());
	await app.listen(process.env.PORT, () => {
		console.log(process.env.SERVER_LINK);
	});
}
bootstrap();
