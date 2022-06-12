import {MigrationInterface, QueryRunner} from "typeorm";

export class Init1655024463572 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`messages\` (\`id\` bigint unsigned NOT NULL AUTO_INCREMENT, \`type\` varchar(255) NOT NULL, \`content\` varchar(255) NOT NULL, \`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`roomId\` bigint unsigned NULL, \`userId\` bigint unsigned NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`rooms\` (\`id\` bigint unsigned NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`users_rooms_rooms\` (\`usersId\` bigint unsigned NOT NULL, \`roomsId\` bigint unsigned NOT NULL, INDEX \`IDX_be046c829cc9f45adfe322e75e\` (\`usersId\`), INDEX \`IDX_df57dc27d23e464abaa467017a\` (\`roomsId\`), PRIMARY KEY (\`usersId\`, \`roomsId\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`rooms_users_users\` (\`roomsId\` bigint unsigned NOT NULL, \`usersId\` bigint unsigned NOT NULL, INDEX \`IDX_cbe951142bc45a33a744256516\` (\`roomsId\`), INDEX \`IDX_6b3c5f4bbfb29a84a57e442af5\` (\`usersId\`), PRIMARY KEY (\`roomsId\`, \`usersId\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`messages\` ADD CONSTRAINT \`FK_aaa8a6effc7bd20a1172d3a3bc8\` FOREIGN KEY (\`roomId\`) REFERENCES \`rooms\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`messages\` ADD CONSTRAINT \`FK_4838cd4fc48a6ff2d4aa01aa646\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`users_rooms_rooms\` ADD CONSTRAINT \`FK_be046c829cc9f45adfe322e75e7\` FOREIGN KEY (\`usersId\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`users_rooms_rooms\` ADD CONSTRAINT \`FK_df57dc27d23e464abaa467017a7\` FOREIGN KEY (\`roomsId\`) REFERENCES \`rooms\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`rooms_users_users\` ADD CONSTRAINT \`FK_cbe951142bc45a33a744256516d\` FOREIGN KEY (\`roomsId\`) REFERENCES \`rooms\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`rooms_users_users\` ADD CONSTRAINT \`FK_6b3c5f4bbfb29a84a57e442af54\` FOREIGN KEY (\`usersId\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`rooms_users_users\` DROP FOREIGN KEY \`FK_6b3c5f4bbfb29a84a57e442af54\``);
        await queryRunner.query(`ALTER TABLE \`rooms_users_users\` DROP FOREIGN KEY \`FK_cbe951142bc45a33a744256516d\``);
        await queryRunner.query(`ALTER TABLE \`users_rooms_rooms\` DROP FOREIGN KEY \`FK_df57dc27d23e464abaa467017a7\``);
        await queryRunner.query(`ALTER TABLE \`users_rooms_rooms\` DROP FOREIGN KEY \`FK_be046c829cc9f45adfe322e75e7\``);
        await queryRunner.query(`ALTER TABLE \`messages\` DROP FOREIGN KEY \`FK_4838cd4fc48a6ff2d4aa01aa646\``);
        await queryRunner.query(`ALTER TABLE \`messages\` DROP FOREIGN KEY \`FK_aaa8a6effc7bd20a1172d3a3bc8\``);
        await queryRunner.query(`DROP INDEX \`IDX_6b3c5f4bbfb29a84a57e442af5\` ON \`rooms_users_users\``);
        await queryRunner.query(`DROP INDEX \`IDX_cbe951142bc45a33a744256516\` ON \`rooms_users_users\``);
        await queryRunner.query(`DROP TABLE \`rooms_users_users\``);
        await queryRunner.query(`DROP INDEX \`IDX_df57dc27d23e464abaa467017a\` ON \`users_rooms_rooms\``);
        await queryRunner.query(`DROP INDEX \`IDX_be046c829cc9f45adfe322e75e\` ON \`users_rooms_rooms\``);
        await queryRunner.query(`DROP TABLE \`users_rooms_rooms\``);
        await queryRunner.query(`DROP TABLE \`rooms\``);
        await queryRunner.query(`DROP TABLE \`messages\``);
    }

}
