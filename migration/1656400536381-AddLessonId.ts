import {MigrationInterface, QueryRunner} from "typeorm";

export class AddLessonId1656400536381 implements MigrationInterface {
    name = 'AddLessonId1656400536381'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`rooms\` ADD \`lessonId\` int NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`rooms\` DROP COLUMN \`lessonId\``);
    }

}
