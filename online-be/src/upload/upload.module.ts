import { Module } from "@nestjs/common";
import { UploadService } from "./upload.service";
import { UploadController } from "./upload.controller";
import { ServeStaticModule } from "@nestjs/serve-static";
import { join } from "path";
import { CategoriesEntity } from "../entities/categories.entities";
import { ProductEntity } from "../entities/products.entities";
import { TypeOrmModule } from "@nestjs/typeorm";

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, "..", "storage", "public"),
      serveRoot: "/storage/public",
    }),
    TypeOrmModule.forFeature([CategoriesEntity, ProductEntity]),
  ],
  controllers: [UploadController],
  providers: [UploadService],
})
export class UploadModule { }
