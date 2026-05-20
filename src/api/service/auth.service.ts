import { sql } from "../../db";
import type { RUser } from "../../types";
import bcrypt from "bcrypt"

class AuthService {
    async createUser (user: RUser & {password: string}) {
        const {name, email, age, password, role} = user;

        const passHash = await bcrypt.hash(password, 10)

        const res = await sql`
        INSERT INTO users (name, email, password age, role) 
        VALUES(${name}, ${email}, ${passHash}, ${age}, COALESCE(${role}, 'user'))
        RETURNING name, email, age, role
        ` 
        return res[0]
    }
}

export default new AuthService