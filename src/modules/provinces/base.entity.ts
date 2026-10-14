import { Exclude } from 'class-transformer';
import { IsPhoneNumber } from 'class-validator';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export abstract class BaseEntity {
  constructor(baseEntity: Partial<BaseEntity>) {
    this.id = baseEntity?.id;
    this.name = baseEntity?.name;
  }
  @PrimaryColumn()
  public id: string;

  @Column()
  public name: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Exclude()
  @DeleteDateColumn()
  deletedAt: Date;
}
