import { db } from '@repo/database'
import { eq } from '@repo/database'
import { formsTable } from '@repo/database/models/form'
import { createFormInput, listFormsByUserIdInput, type CreateFormInput, type ListFormsByUserIdInput } from './model'

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
}

export default FormService
