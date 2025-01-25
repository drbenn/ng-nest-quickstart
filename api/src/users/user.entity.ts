import { Entity, PrimaryGeneratedColumn, Column, UpdateDateColumn, CreateDateColumn, Index } from 'typeorm';
import { Exclude } from 'class-transformer';

@Entity('users')
export class User {

  @PrimaryGeneratedColumn('uuid')
  id: string;

  /**
   * When you run your TypeORM migrations or synchronize the schema with your database, the @Index decorator
   * will automatically create an index on the email column. If you set unique: true in the @Column decorator,
   * it will enforce the uniqueness constraint at the database level. No adjustments required in the database 
   * creation bash/sql, typeORM will take care of everything.
   */
  @Column({ nullable: true })
  @Index() // This creates an index on the email column
  email: string;

  @Column({ nullable: true })
  @Exclude()                      // exclude from responses
  password: string;               // Optional for OAuth users

  @Column({ nullable: true })
  @Index() // This creates an index on the refresh_token column
  refresh_token: string;

  @Column({ nullable: true })
  oauth_provider: string;         // e.g., 'google', 'facebook', 'github'

  @Column({ nullable: true })
  @Exclude()                      // exclude from responses
  oauth_provider_user_id: string; // Provider-specific ID
  
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

  @Column({ nullable: true })
  @Exclude()                      // exclude from responses
  reset_id: string;               // reset id used as additional verification on standard user resetting password

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