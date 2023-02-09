import { MigrationInterface, QueryRunner } from "typeorm";

export class default1675632133105 implements MigrationInterface {
    name = 'default1675632133105'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`project\` (\`cep\` varchar(255) NOT NULL, \`state\` varchar(255) NOT NULL, \`city\` varchar(255) NOT NULL, \`neighborhood\` varchar(255) NOT NULL, \`address\` varchar(255) NOT NULL, \`number\` int NULL, \`id\` int NOT NULL AUTO_INCREMENT, \`company_distribution\` varchar(50) NOT NULL, \`total_potency\` float NOT NULL, \`file\` blob NOT NULL, \`client_name\` varchar(100) NOT NULL, \`client_cellphone\` varchar(255) NOT NULL, \`user_id\` int NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`user\` (\`cep\` varchar(255) NOT NULL, \`state\` varchar(255) NOT NULL, \`city\` varchar(255) NOT NULL, \`neighborhood\` varchar(255) NOT NULL, \`address\` varchar(255) NOT NULL, \`number\` int NULL, \`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(100) NOT NULL, \`email\` varchar(100) NOT NULL, \`password\` varchar(255) NOT NULL, \`cellphone\` varchar(15) NOT NULL, \`cpf\` varchar(14) NOT NULL, UNIQUE INDEX \`IDX_a6235b5ef0939d8deaad755fc8\` (\`cpf\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`project\` ADD CONSTRAINT \`FK_1cf56b10b23971cfd07e4fc6126\` FOREIGN KEY (\`user_id\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`project\` DROP FOREIGN KEY \`FK_1cf56b10b23971cfd07e4fc6126\``);
        await queryRunner.query(`DROP INDEX \`IDX_a6235b5ef0939d8deaad755fc8\` ON \`user\``);
        await queryRunner.query(`DROP TABLE \`user\``);
        await queryRunner.query(`DROP TABLE \`project\``);
    }

}
