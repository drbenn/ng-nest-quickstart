
<!--           -->
<!-- Namecheap -->
<!--           -->

<!-- check that user for postgres has access to the db -->
SELECT grantee, privilege_type 
FROM information_schema.role_table_grants 
WHERE table_name = 'todos';

<!-- Grant Permissions to Future Tables Automatically -->
ALTER DEFAULT PRIVILEGES IN SCHEMA public 
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO danbxdxb_ng_nest_quickstart_db;
ALTER DEFAULT PRIVILEGES IN SCHEMA public 
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO danbxdxb_postgres_dan_rules;

<!-- Grant all priviledges to tables for group and table -->

<!-- for group -->
GRANT ALL PRIVILEGES ON DATABASE danbxdxb_ng_nest_quickstart_db TO danbxdxb_ng_nest_quickstart_db;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO danbxdxb_ng_nest_quickstart_db;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO danbxdxb_ng_nest_quickstart_db;

<!-- for user in group -->
GRANT ALL PRIVILEGES ON DATABASE danbxdxb_ng_nest_quickstart_db TO danbxdxb_postgres_dan_rules;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO danbxdxb_postgres_dan_rules;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO danbxdxb_postgres_dan_rules;

<!-- 
  IN phpPgAdmin, tables -> Owner cannot be the superuser danbxdxb it must be changed to the database group 
  also recognized as the database itself danbxdxb_ng_nest_quickstart_db
 -->

<!-- change owner for one table -->
ALTER TABLE todos OWNER TO danbxdxb_ng_nest_quickstart_db;
