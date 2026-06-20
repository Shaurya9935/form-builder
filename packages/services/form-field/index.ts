import { db, eq, max, asc } from '@repo/database'
import { formFieldTables } from '@repo/database/models/form-field'
import {
    type CreateFieldInputType, createFieldInput,
    type UpdateFieldInputType, updateFieldInput,
    type DeleteFieldInputType, deleteFieldInput,
    type GetFieldsInputType, getFieldsInput,
} from './model'

function toLabelKey(label: string): string {
    return label
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, '_')
        .replace(/^_|_$/g, '')
}

class FormFieldService {

    private async getNextIndex(formId: string): Promise<string> {
        const result = await db
            .select({ maxIndex: max(formFieldTables.index) })
            .from(formFieldTables)
            .where(eq(formFieldTables.formId, formId))

        const current = result[0]?.maxIndex
        const next = current ? parseFloat(current) + 1 : 1
        return next.toFixed(2)
    }

    public async createField(payload: CreateFieldInputType) {
        const { label, type, formId, description, placeholder, isRequired } =
            await createFieldInput.parseAsync(payload)

        const labelKey = toLabelKey(label)
        const index = await this.getNextIndex(formId)

        const result = await db
            .insert(formFieldTables)
            .values({ label, labelKey, type, formId, description, placeholder, isRequired, index })
            .returning({ id: formFieldTables.id })

        if (!result || result.length === 0 || !result[0]?.id)
            throw new Error(`Something went wrong while creating the field`)

        return { id: result[0].id, labelKey, index }
    }

    public async updateField(payload: UpdateFieldInputType) {
        const { fieldId, ...updates } = await updateFieldInput.parseAsync(payload)

        const patch: Partial<typeof formFieldTables.$inferInsert> = {}
        if (updates.label !== undefined) patch.label = updates.label
        if (updates.type !== undefined) patch.type = updates.type
        if ('description' in updates) patch.description = updates.description ?? null
        if ('placeholder' in updates) patch.placeholder = updates.placeholder ?? null
        if (updates.isRequired !== undefined) patch.isRequired = updates.isRequired

        if (Object.keys(patch).length === 0) throw new Error(`No fields provided to update`)

        const result = await db
            .update(formFieldTables)
            .set(patch)
            .where(eq(formFieldTables.id, fieldId))
            .returning({ id: formFieldTables.id })

        if (!result || result.length === 0) throw new Error(`Field with ID ${fieldId} does not exist`)

        return { id: result[0]!.id }
    }

    public async getFields(payload: GetFieldsInputType) {
        const { formId } = await getFieldsInput.parseAsync(payload)

        return db
            .select({
                id: formFieldTables.id,
                label: formFieldTables.label,
                labelKey: formFieldTables.labelKey,
                type: formFieldTables.type,
                description: formFieldTables.description,
                placeholder: formFieldTables.placeholder,
                isRequired: formFieldTables.isRequired,
                index: formFieldTables.index,
            })
            .from(formFieldTables)
            .where(eq(formFieldTables.formId, formId))
            .orderBy(asc(formFieldTables.index))
    }

    public async deleteField(payload: DeleteFieldInputType) {
        const { fieldId } = await deleteFieldInput.parseAsync(payload)

        const result = await db
            .delete(formFieldTables)
            .where(eq(formFieldTables.id, fieldId))
            .returning({ id: formFieldTables.id })

        if (!result || result.length === 0) throw new Error(`Field with ID ${fieldId} does not exist`)

        return { id: result[0]!.id }
    }

}

export default FormFieldService
