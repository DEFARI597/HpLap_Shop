import { MigrationInterface, QueryRunner } from "typeorm";

export class MakeCategoriesQuery1770975609991 implements MigrationInterface {
    name = 'MakeCategoriesQuery1770975609991'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`categories\` DROP FOREIGN KEY \`categories_ibfk_1\``);
        await queryRunner.query(`DROP INDEX \`idx_active\` ON \`categories\``);
        await queryRunner.query(`DROP INDEX \`idx_parent\` ON \`categories\``);
        await queryRunner.query(`ALTER TABLE \`categories\` CHANGE \`parent_category_id\` \`parent_category_id\` int NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`categories\` CHANGE \`is_active\` \`is_active\` tinyint NOT NULL DEFAULT 1`);
        await queryRunner.query(`ALTER TABLE \`categories\` CHANGE \`created_at\` \`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE \`categories\` CHANGE \`updated_at\` \`updated_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE \`categories\` CHANGE \`parent_category_id\` \`parent_category_id\` int NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`categories\` CHANGE \`is_active\` \`is_active\` tinyint NOT NULL DEFAULT 1`);
        await queryRunner.query(`ALTER TABLE \`categories\` CHANGE \`created_at\` \`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE \`categories\` CHANGE \`updated_at\` \`updated_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`categories\` CHANGE \`updated_at\` \`updated_at\` timestamp(0) NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE \`categories\` CHANGE \`created_at\` \`created_at\` timestamp(0) NULL DEFAULT CURRENT_TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE \`categories\` CHANGE \`is_active\` \`is_active\` tinyint NULL DEFAULT '1'`);
        await queryRunner.query(`ALTER TABLE \`categories\` CHANGE \`parent_category_id\` \`parent_category_id\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`categories\` CHANGE \`updated_at\` \`updated_at\` timestamp(0) NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE \`categories\` CHANGE \`created_at\` \`created_at\` timestamp(0) NULL DEFAULT CURRENT_TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE \`categories\` CHANGE \`is_active\` \`is_active\` tinyint NULL DEFAULT '1'`);
        await queryRunner.query(`ALTER TABLE \`categories\` CHANGE \`parent_category_id\` \`parent_category_id\` int NULL`);
        await queryRunner.query(`CREATE INDEX \`idx_parent\` ON \`categories\` (\`parent_category_id\`)`);
        await queryRunner.query(`CREATE INDEX \`idx_active\` ON \`categories\` (\`is_active\`)`);
        await queryRunner.query(`ALTER TABLE \`categories\` ADD CONSTRAINT \`categories_ibfk_1\` FOREIGN KEY (\`parent_category_id\`) REFERENCES \`categories\`(\`category_id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
