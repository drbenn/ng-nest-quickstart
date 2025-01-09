import { Entity, PrimaryGeneratedColumn, Column, UpdateDateColumn, CreateDateColumn } from 'typeorm';
import { Exclude } from 'class-transformer';

@Entity('users')
export class User {

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  @Exclude()
  password: string; // Optional for OAuth users

  @Column({ nullable: true })
  oauth_provider: string; // e.g., 'google', 'facebook', 'github'

  @Column({ nullable: true })
  oauth_provider_id: string; // Provider-specific ID

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @Column({ nullable: true })
  first_name: string;

  @Column({ nullable: true })
  last_name: string;

  @Column({ nullable: true })
  full_name: string;

  @Column({ nullable: true })
  img_url: string;

  @Column({ type: 'jsonb', nullable: true })
  settings: Record<string, any>;

  // @PrimaryGeneratedColumn('uuid')
  // id: string;

  // @Column({ nullable: false })
  // first_name: string;

  // @Column({ nullable: false })
  // last_name: string;

  // @Column({ nullable: false })
  // full_name: string;

  // @Column({ unique: true, nullable: false })
  // email: string;

  // @Column({ nullable: false })
  // password: string;

  // @Column({ nullable: true })
  // img_url: string;

  // @Column({ nullable: true })
  // provider: string;

  // @Column('simple-array', { nullable: true })
  // roles: string[];

  // @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  // date_joined: Date;

  // @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  // last_login: Date;

  // @Column({ type: 'jsonb', nullable: true })
  // settings: Record<string, any>;
}