import { MigrationInterface, QueryRunner } from "typeorm";

export class AddOrdersQuery1775453273436 implements MigrationInterface {
    name = 'AddOrdersQuery1775453273436'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`orders\` (\`order_id\` int NOT NULL AUTO_INCREMENT, \`order_reference\` varchar(100) NOT NULL, \`quantity\` int NOT NULL, \`total_price\` decimal(12,2) NOT NULL, \`status\` varchar(255) NOT NULL DEFAULT 'pending', \`product_id\` int NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`order_id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`orders\` ADD CONSTRAINT \`FK_ac832121b6c331b084ecc4121fd\` FOREIGN KEY (\`product_id\`) REFERENCES \`products\`(\`product_id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`orders\` DROP FOREIGN KEY \`FK_ac832121b6c331b084ecc4121fd\``);
        await queryRunner.query(`DROP TABLE \`orders\``);
    }

}
