import { MigrationInterface, QueryRunner } from "typeorm";

export class AddProductsQuery1771775304858 implements MigrationInterface {
    name = 'AddProductsQuery1771775304858'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`products\` DROP FOREIGN KEY \`FK_9a5f6868c96e0069e699f33e124\``);
        await queryRunner.query(`DROP INDEX \`idx_brand\` ON \`products\``);
        await queryRunner.query(`DROP INDEX \`idx_category\` ON \`products\``);
        await queryRunner.query(`DROP INDEX \`idx_is_active\` ON \`products\``);
        await queryRunner.query(`DROP INDEX \`idx_is_active_product\` ON \`products\``);
        await queryRunner.query(`DROP INDEX \`idx_price\` ON \`products\``);
        await queryRunner.query(`ALTER TABLE \`products\` ADD \`product_main_image\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`products\` ADD \`product_additional_images\` text NULL`);
        await queryRunner.query(`ALTER TABLE \`products\` ADD \`is_featured\` tinyint NOT NULL DEFAULT 0`);
        await queryRunner.query(`ALTER TABLE \`products\` ADD \`rating\` decimal(3,2) NOT NULL DEFAULT '0.00'`);
        await queryRunner.query(`ALTER TABLE \`products\` CHANGE \`category_id\` \`category_id\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`products\` CHANGE \`brand\` \`brand\` varchar(100) NULL`);
        await queryRunner.query(`CREATE INDEX \`idx_product_category\` ON \`products\` (\`category_id\`)`);
        await queryRunner.query(`CREATE INDEX \`idx_product_active\` ON \`products\` (\`is_active\`)`);
        await queryRunner.query(`CREATE INDEX \`idx_product_featured\` ON \`products\` (\`is_featured\`)`);
        await queryRunner.query(`ALTER TABLE \`products\` ADD CONSTRAINT \`FK_9a5f6868c96e0069e699f33e124\` FOREIGN KEY (\`category_id\`) REFERENCES \`categories\`(\`category_id\`) ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`products\` DROP FOREIGN KEY \`FK_9a5f6868c96e0069e699f33e124\``);
        await queryRunner.query(`DROP INDEX \`idx_product_featured\` ON \`products\``);
        await queryRunner.query(`DROP INDEX \`idx_product_active\` ON \`products\``);
        await queryRunner.query(`DROP INDEX \`idx_product_category\` ON \`products\``);
        await queryRunner.query(`ALTER TABLE \`products\` CHANGE \`brand\` \`brand\` varchar(100) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`products\` CHANGE \`category_id\` \`category_id\` int NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`products\` DROP COLUMN \`rating\``);
        await queryRunner.query(`ALTER TABLE \`products\` DROP COLUMN \`is_featured\``);
        await queryRunner.query(`ALTER TABLE \`products\` DROP COLUMN \`product_additional_images\``);
        await queryRunner.query(`ALTER TABLE \`products\` DROP COLUMN \`product_main_image\``);
        await queryRunner.query(`CREATE INDEX \`idx_price\` ON \`products\` (\`price\`)`);
        await queryRunner.query(`CREATE INDEX \`idx_is_active_product\` ON \`products\` (\`is_active\`)`);
        await queryRunner.query(`CREATE INDEX \`idx_is_active\` ON \`products\` (\`is_active\`)`);
        await queryRunner.query(`CREATE INDEX \`idx_category\` ON \`products\` (\`category_id\`)`);
        await queryRunner.query(`CREATE INDEX \`idx_brand\` ON \`products\` (\`brand\`)`);
        await queryRunner.query(`ALTER TABLE \`products\` ADD CONSTRAINT \`FK_9a5f6868c96e0069e699f33e124\` FOREIGN KEY (\`category_id\`) REFERENCES \`categories\`(\`category_id\`) ON DELETE RESTRICT ON UPDATE NO ACTION`);
    }

}
