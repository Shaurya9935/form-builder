import {
  pgTable,
  uuid,
  varchar,
  timestamp,
  boolean,
  text,
  numeric,
  pgEnum,
  unique
} from "drizzle-orm/pg-core";
import { formsTable } from "./form";

export const fieldTypeEnum = pgEnum('field_type', ['TEXT', 'NUMBER', 'EMAIL', 'YES_NO', 'PASSWORD'])

export const formFieldTables = pgTable("form_fields", {
    id: uuid("id").primaryKey().defaultRandom(),

    label: varchar('label', {length: 100}).notNull(),       
    lebelKey: varchar('label_key', {length: 100}).notNull(),

    description: text('description'),

    placeholder: text('placeholder'),

    isRequired: boolean('is_Required').default(false).notNull(),
    
    index: numeric('index', {scale: 2}).notNull(),

    type: fieldTypeEnum('type').notNull(),

    formId: uuid('form_Id').references(()=>formsTable.id),

    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").$onUpdate(() => new Date()),
},(table) => {
    return {
        uniqueFormIdAndIndex: unique().on(table.formId, table.index)
    }
})