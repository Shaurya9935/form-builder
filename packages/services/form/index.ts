import { asc, db } from '@repo/database'
import { eq } from '@repo/database'
import { formsTable } from '@repo/database/models/form'
import { createFormInput, getFormByIdInput, GetFormByIdInputType, listFormsByUserIdInput, type CreateFormInput, type ListFormsByUserIdInput } from './model'
import { formFieldTables } from '@repo/database/schema';

class FormService {
	public async createForm(payload: CreateFormInput) {
		const { title, description, createdBy } = await createFormInput.parseAsync(payload)

		const formInsertResult = await db
			.insert(formsTable)
			.values({
				title,
				description,
				createdBy,
			})
			.returning({
				id: formsTable.id,
				
			})

		if (!formInsertResult || formInsertResult.length === 0 || !formInsertResult[0]?.id) {
			throw new Error('Something went wrong while creating a form')
		}

		return {id: formInsertResult[0].id}
	}

	public async listFormsByUserId(payload: ListFormsByUserIdInput) {
		const { id } = await listFormsByUserIdInput.parseAsync(payload)

		const forms = await db
			.select({
				id: formsTable.id,
				title: formsTable.title,
				description: formsTable.description,
				createdBy: formsTable.createdBy,
				createdAt: formsTable.createdAt,
				updatedAt: formsTable.updatedAt,
			})
			.from(formsTable)
			.where(eq(formsTable.createdBy, id))

		return forms.map((form) => ({
			...form,
			createdAt: form.createdAt ? new Date(form.createdAt).toISOString() : null,
			updatedAt: form.updatedAt ? new Date(form.updatedAt).toISOString() : null,
		}))
	}
	public async getFormById(payload: GetFormByIdInputType) {
        const { formId } = await getFormByIdInput.parseAsync(payload)

        const rows = await db
            .select({
                id: formsTable.id,
                title: formsTable.title,
                description: formsTable.description,
                createdAt: formsTable.createdAt,
                updatedAt: formsTable.updatedAt,
                field: {
                    id: formFieldTables.id,
                    label: formFieldTables.label,
                    labelKey: formFieldTables.labelKey,
                    type: formFieldTables.type,
                    description: formFieldTables.description,
                    placeholder: formFieldTables.placeholder,
                    isRequired: formFieldTables.isRequired,
                    index: formFieldTables.index,
                },
            })
            .from(formsTable)
            .leftJoin(formFieldTables, eq(formFieldTables.formId, formsTable.id))
            .where(eq(formsTable.id, formId))
            .orderBy(asc(formFieldTables.index))

        if (rows.length === 0) return null

        const { id, title, description, createdAt, updatedAt } = rows[0]!
        const fields = rows
            .filter(r => r.field?.id !== null)
            .map(r => r.field as NonNullable<typeof r.field>)

        return { id, title, description, createdAt, updatedAt, fields }
    }

}

export default FormService
