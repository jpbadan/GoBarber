import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  TableForeignKey,
} from 'typeorm';

// Migration exemplo do que fazer caso enviemos nosso DB a terceiros ou a produção.
// simplesmente altera o nome da coluna provider da tabela appointments

export default class AlterProviderNameToProviderId1601227558193
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('appointments', 'provider');
    await queryRunner.addColumn(
      'appointments',
      new TableColumn({
        name: 'provider_id',
        type: 'uuid',
        isNullable: true, // Caso o prestador de serviço saia da plataforma -> Usuarios
        // sem prestação de servico (estratégia de cascade -> Nome tecnico do SQL)
      }),
    );

    // Metodo para criar referencia entre as tabelas appointments e users
    await queryRunner.createForeignKey(
      'appointments',
      new TableForeignKey({
        name: 'appointmentProvider', // Para poser ser referenciado no metodo down (está abaixo)
        columnNames: ['provider_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Desfazer todo o acima e na ordem reversa
    await queryRunner.dropForeignKey('appointments', 'appointmentProvider');

    await queryRunner.dropColumn('appointments', 'provider_id');

    await queryRunner.addColumn(
      'appointments',
      new TableColumn({
        name: 'provider',
        type: 'varchar',
      }),
    );
  }
}
