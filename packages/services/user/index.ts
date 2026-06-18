import {randomBytes, createHmac} from 'node:crypto'
import * as JWT from 'jsonwebtoken'
import {db, eq} from '@repo/database'
import {usersTable} from '@repo/database/models/user'
import {createUserWithEmailAndPasswordInput, generateUserTokenPayload, GenerateUserTokenPayloadType, type CreateUserWithEmailAndPasswordInput} from './model'
import { env } from '../env';


class UserService {

    private async generateUserToken(payload: GenerateUserTokenPayloadType) {
        const {id} = await generateUserTokenPayload.parseAsync(payload)
        const token =JWT.sign({id}, env.JWT_SECRET)
        return { token }
    }

    private async getUserByEmail(email: string){
        const result = await db.select().from(usersTable).where(eq(usersTable.email, email))
        if(!result || result.length === 0) return null
        return result
    }

    public async createUserWithEmailAndPassword(payload: CreateUserWithEmailAndPasswordInput) { 
        const { fullName, email, password} = await createUserWithEmailAndPasswordInput.parseAsync(payload)
        
        // check if user is already existing or not
        const existingUserWithEmail = await this.getUserByEmail(email)
        if(existingUserWithEmail) throw new Error(`User with email ${email} already exists`)

         // calculate salt and hash the password
        const salt=randomBytes(16).toString('hex')
        const hash = createHmac('sha256', salt).update(password).digest('hex')

        // create user in DB 
        const userInsertResult = await db.insert(usersTable).values({email, fullName, password: hash, salt}).returning({
            id: usersTable.id
        })

        if (!userInsertResult || userInsertResult.length === 0 || !userInsertResult[0]?.id) throw new Error('Something went wrong while creating a user')

            const userId = userInsertResult[0].id
            const {token} = await this.generateUserToken({id: userId})

        return {
            id: userId,
            token
        }
    }
}

export default UserService