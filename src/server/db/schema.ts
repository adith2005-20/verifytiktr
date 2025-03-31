// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration

import { sql } from "drizzle-orm";
import { pgTable, text, integer, timestamp, boolean, index, pgTableCreator } from "drizzle-orm/pg-core";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = pgTableCreator((name) => `verifytiktr_${name}`);

// auth tables

export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text('name').notNull(),
email: text('email').notNull().unique(),
emailVerified: boolean('email_verified').notNull(),
image: text('image'),
createdAt: timestamp('created_at').notNull(),
updatedAt: timestamp('updated_at').notNull(),
isVerified: boolean('is_verified').notNull().default(false)
});

export const session = pgTable("session", {
  id: text("id").primaryKey(),
  expiresAt: timestamp('expires_at').notNull(),
token: text('token').notNull().unique(),
createdAt: timestamp('created_at').notNull(),
updatedAt: timestamp('updated_at').notNull(),
ipAddress: text('ip_address'),
userAgent: text('user_agent'),
userId: text('user_id').notNull().references(()=> user.id, { onDelete: 'cascade' })
});

export const account = pgTable("account", {
  id: text("id").primaryKey(),
  accountId: text('account_id').notNull(),
providerId: text('provider_id').notNull(),
userId: text('user_id').notNull().references(()=> user.id, { onDelete: 'cascade' }),
accessToken: text('access_token'),
refreshToken: text('refresh_token'),
idToken: text('id_token'),
accessTokenExpiresAt: timestamp('access_token_expires_at'),
refreshTokenExpiresAt: timestamp('refresh_token_expires_at'),
scope: text('scope'),
password: text('password'),
createdAt: timestamp('created_at').notNull(),
updatedAt: timestamp('updated_at').notNull()
});

export const verification = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text('identifier').notNull(),
value: text('value').notNull(),
expiresAt: timestamp('expires_at').notNull(),
createdAt: timestamp('created_at'),
updatedAt: timestamp('updated_at')
});


// core logic tables



// export const host = createTable(
//   "host",
//   (d) => ({
//     id: d.integer().primaryKey().generatedByDefaultAsIdentity(),
//     name: d.varchar({ length: 256}).notNull(),
//     createdAt: d.timestamp({ withTimezone: true }).default(sql`CURRENT_TIMESTAMP`).notNull(),
//     uniqueCode: d.varchar({length:6}).notNull().unique(),
//   })
// )

export const event = createTable(
  "event",
  (d) => ({
    id: d.integer().primaryKey().generatedByDefaultAsIdentity(),
    name: d.varchar({ length: 256 }).notNull(),
    createdAt: d
      .timestamp({ withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: d.timestamp({ withTimezone: true }).$onUpdate(() => new Date()),
    uniqueCode: d.varchar({length:6}).notNull().unique(),
    ownerId: d.text().notNull().references(()=> user.id, {onDelete: 'cascade'})
  }),
  (t) => [index("name_idx").on(t.name)],
);

export const verifiedGuards = createTable(
  "verified_guards",
  (d)=>({
  id: d.integer().primaryKey().generatedByDefaultAsIdentity(),
  userId: d.text().notNull().references(()=> user.id, {onDelete: 'cascade'}).unique(),
  eventId: d.integer().notNull().references(()=> event.id, {onDelete: "cascade"}),
  createdAt: d.timestamp({ withTimezone: true }).default(sql`CURRENT_TIMESTAMP`).notNull(),
}))

export const eventGoer = createTable(
  "event_goer",
  (d)=>({
    id: d.integer().primaryKey().generatedByDefaultAsIdentity(),
    guardId: d.text().notNull().references(() => user.id, { onDelete: 'cascade' }),
    eventId: d.integer().notNull().references(() => event.id, { onDelete: "cascade" }), 
    enteredAt: d.timestamp({ withTimezone: true }).default(sql`CURRENT_TIMESTAMP`).notNull()
  })
)