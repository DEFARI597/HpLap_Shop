import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { AdminModule } from './admin/admin.module';
import { CategoriesModule } from './categories/categories.module';
import { ProductModule } from './product/product.module';
import { UploadModule } from './upload/upload.module';
import { OrdersModule } from './orders/orders.module';
import { ProductEntity } from './entities/products.entities';
import { OrdersEntity } from './entities/orders.entities';
import { OrdersItemEntity } from './entities/orders-items.entities';
import { CategoriesEntity } from './entities/categories.entities'; 
import { User } from './entities/users.entities';
import { PaymentModule } from './payment/payment.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'mysql',
        connectorPackage: 'mysql2',
        host: config.getOrThrow<string>('DB_HOST'),
        port: Number(config.getOrThrow<number>('DB_PORT')),
        username: config.getOrThrow<string>('DB_USERNAME'),
        password: config.getOrThrow<string>('DB_PASSWORD'),
        database: config.getOrThrow<string>('DB_NAME'),
        autoLoadEntities: true,
        logging: config.getOrThrow<boolean>('DB_LOGGING'),
        entities: [ProductEntity, OrdersEntity, OrdersItemEntity, CategoriesEntity, User],
        synchronize: config.getOrThrow<boolean>('DB_SYNCHRONIZE'),
        ssl: {
              rejectUnauthorized: false, 
          },
      }),
    }),
    UsersModule,
    AuthModule,
    AdminModule,
    CategoriesModule,
    ProductModule,
    UploadModule,
    OrdersModule,
    PaymentModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
