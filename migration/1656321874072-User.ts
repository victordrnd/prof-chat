import {MigrationInterface, QueryRunner} from "typeorm";

export class User1656321874072 implements MigrationInterface {
    name = 'User1656321874072'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`rooms\` ADD \`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE \`rooms\` ADD \`updated_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`rooms\` DROP COLUMN \`updated_at\``);
        await queryRunner.query(`ALTER TABLE \`rooms\` DROP COLUMN \`created_at\``);
    }

}
