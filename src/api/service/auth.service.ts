import { sql } from "../../db";
import type { RUser, User } from "../../types";
import bcrypt from "bcrypt"

class AuthService {
    async createUser(user: RUser & { password: string }) {
        const { name, email, password, age, role } = user;

        const passHash = await bcrypt.hash(password, 10)

        const res = await sql`
        INSERT INTO users (name, email, password, age, role) 
        VALUES(${name}, ${email}, ${passHash}, ${age}, COALESCE(${role}, 'user'))
        RETURNING id, name, age, role
        `
        return res[0]
    }

    async validateUser(email: string, passwordHash: string) {
        const res = await sql`
        SELECT * FROM users WHERE email=${email}
        `
        if (!res.length) {
            return null
        }

        const { password, ...user } = res[0] as User
        const isValid = await bcrypt.compare(passwordHash, password)

        return isValid ? user : null
    }

    async getUserById(id: string) {
        const res = await sql`
        SELECT id, name, email, age, role FROM users WHERE id = ${id}
        `
        return res[0] as RUser & {id: number}
    }
}

export default new AuthService()