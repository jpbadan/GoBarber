/* eslint-disable camelcase */
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import User from './User';

@Entity('appointments') // Decorator Typescript -> Relaciona o model e o banco de dados
class Appointment {
  @PrimaryGeneratedColumn('uuid') // Coluna gerada automaticamente
  id: string;

  @Column() // Coluna tradicional -> Varchar por default
  provider_id: string;

  // Abaixo definimos a estrutura para nos permitir acessar os dados de um user a partir de uma instancia
  // de agendamento. Não temos a obrigação de add o caminho inverso no model dos users por enquanto.
  @ManyToOne(() => User) // Documentacao do type orm
  @JoinColumn({ name: 'provider_id' }) // Qual coluna identifica quem é o prestador desse usuário
  provider: User; // Por conta do relacionamento com a classe de usuarios (one to one)

  @Column('timestamp with time zone')
  date: Date;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  // Código antigo -> O typeORM ja possui um constructor builtin quando
  // usamos o metodo @Entity
  //
  // // Estruturação de dados em formato DTO. Omit<'From', 'What?'>
  // constructor({ provider, date }: Omit<Appointment, 'id'>) {
  //   this.id = uuid();
  //   this.provider = provider;
  //   this.date = date;
  // }
}

export default Appointment;
