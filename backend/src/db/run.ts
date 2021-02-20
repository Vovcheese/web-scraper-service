import path from 'path';
import repos from '@models/index';
import { promises as fs } from 'fs';

export default async (type: string) => {
    const findFiles = await fs.readdir(path.join(__dirname, type))
    for (const file of findFiles) {
        const findMigration = await repos.migrationRepository.findOne({ where: { type, name: file }})

        if(!findMigration) {
            try {
                await import(`@db/${type}/${file}`).then(r => r.up())
                await repos.migrationRepository.create({type, name: file})
                console.log(`${type} ${file} success completed`)
            } catch (error) {
                console.error(`${type} ${file} failed ${error.message}`)
            }
            
        }
    }
}