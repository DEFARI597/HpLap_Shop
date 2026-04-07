import { MigrationInterface, QueryRunner } from "typeorm";

export class AddOrdersItemsQuery1775527396574 implements MigrationInterface {
    name = 'AddOrdersItemsQuery1775527396574'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`orders\` DROP FOREIGN KEY \`FK_ac832121b6c331b084ecc4121fd\``);
        await queryRunner.query(`CREATE TABLE \`order_items\` (\`id\` int NOT NULL AUTO_INCREMENT, \`quantity\` int NOT NULL, \`price_at_purchase\` decimal(12,2) NOT NULL, \`orderOrderId\` int NULL, \`productProductId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`orders\` DROP COLUMN \`product_id\``);
        await queryRunner.query(`ALTER TABLE \`orders\` DROP COLUMN \`quantity\``);
        await queryRunner.query(`ALTER TABLE \`orders\` DROP COLUMN \`updated_at\``);
        await queryRunner.query(`ALTER TABLE \`orders\` DROP COLUMN \`order_reference\``);
        await queryRunner.query(`ALTER TABLE \`orders\` ADD \`order_reference\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`order_items\` ADD CONSTRAINT \`FK_7fdb8279503d87a8b6a1880e3d4\` FOREIGN KEY (\`orderOrderId\`) REFERENCES \`orders\`(\`order_id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`order_items\` ADD CONSTRAINT \`FK_28bedaa57c26b26f953d27d8df0\` FOREIGN KEY (\`productProductId\`) REFERENCES \`products\`(\`product_id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`order_items\` DROP FOREIGN KEY \`FK_28bedaa57c26b26f953d27d8df0\``);
        await queryRunner.query(`ALTER TABLE \`order_items\` DROP FOREIGN KEY \`FK_7fdb8279503d87a8b6a1880e3d4\``);
        await queryRunner.query(`ALTER TABLE \`orders\` DROP COLUMN \`order_reference\``);
        await queryRunner.query(`ALTER TABLE \`orders\` ADD \`order_reference\` varchar(100) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`orders\` ADD \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE \`orders\` ADD \`quantity\` int NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`orders\` ADD \`product_id\` int NOT NULL`);
        await queryRunner.query(`DROP TABLE \`order_items\``);
        await queryRunner.query(`ALTER TABLE \`orders\` ADD CONSTRAINT \`FK_ac832121b6c331b084ecc4121fd\` FOREIGN KEY (\`product_id\`) REFERENCES \`products\`(\`product_id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
