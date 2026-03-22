import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { CategoriesEntity } from "../entities/categories.entities";
import { ProductEntity } from "../entities/products.entities";
import { InjectRepository } from "@nestjs/typeorm";


@Injectable()
export class UploadService {
    constructor(
        @InjectRepository(CategoriesEntity)
        private readonly categoryRepository: Repository<CategoriesEntity>,
        @InjectRepository(ProductEntity)
        private readonly productRepository: Repository<ProductEntity>,
    ) { }

    async uploadFile(file: Express.Multer.File, targetFolder: string, entityId: number) {
        if (!file) {
            throw new Error('No file uploaded');
        }

        const feUrl = process.env.FE_URL || 'http://localhost:3000';
        const folder = targetFolder || "others";
        const fileUrl = `${feUrl}/storage/${targetFolder}/${file.filename}`;

        if (folder === 'products') {
            await this.productRepository.update(entityId, {
                product_main_image: fileUrl,
            });
        } else if (folder === 'categories') {
            await this.categoryRepository.update(entityId, {
                category_image: fileUrl,
            });
        } else {
            throw new Error('Invalid target folder specified');
        }

        return {
            filename: file.filename,
            originalname: file.originalname,
            path: file.path,
            mimetype: file.mimetype,
            size: file.size,
            url: fileUrl,
            folder: folder,
        }
    }
}
