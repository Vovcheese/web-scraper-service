import path from 'path';
import sequelize from '@db/index';
import MigrationModel from '@db/models/Migration.model';
import { promises as fs } from 'fs';

export default async (type: string) => {
    const migrationRepo = sequelize.getRepository(MigrationModel);
    const findFiles = await fs.readdir(path.join(__dirname, type))
    for (const file of findFiles) {
        const findMigration = await migrationRepo.findOne({ where: { type, name: file }})

        if(!findMigration) {
            try {
                await import(`@db/${type}/${file}`).then(r => r.up())
                await migrationRepo.create({type, name: file})
                console.log(`${type} ${file} success completed`)
            } catch (error) {
                console.error(`${type} ${file} failed ${error.message}`)
            }
            
        }
    }
}