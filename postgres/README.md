TypeORM | Postgres notes

Although when creating a postgres table, you may not indicate a column as NOT NULL, TypeORM will by default set the column as NOT NULL.
Therefore, in the entity, you must add nullable to true  -- @Column({ nullable: true }) --