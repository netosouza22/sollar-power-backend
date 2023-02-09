import { MigrationInterface, QueryRunner } from "typeorm";

export class default1675868901643 implements MigrationInterface {
    name = 'default1675868901643'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`project\` DROP COLUMN \`file\``);
        await queryRunner.query(`ALTER TABLE \`project\` ADD \`file\` varchar(255) NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`project\` DROP COLUMN \`file\``);
        await queryRunner.query(`ALTER TABLE \`project\` ADD \`file\` blob NOT NULL`);
    }

}
