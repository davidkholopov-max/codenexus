import { PrismaClient } from '@prisma/client'
import { seedAchievements } from './achievements'
import { seedPythonCourse } from './python-course'
import { seedJavaScriptCourse } from './javascript-course'
import { seedSQLCourse } from './sql-course'
import { seedHTMLCSSCourse } from './html-css-course'
import { seedGoCourse } from './go-course'
import { seedJavaCourse } from './java-course'
import { seedCppCourse } from './cpp-course'
import { seedDjangoCourse } from './django-course'
import { seedReactCourse } from './react-course'
import { seedTypeScriptCourse } from './typescript-course'

const db = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  await seedAchievements(db)
  await seedPythonCourse(db)
  await seedJavaScriptCourse(db)
  await seedTypeScriptCourse(db)
  await seedSQLCourse(db)
  await seedHTMLCSSCourse(db)
  await seedGoCourse(db)
  await seedJavaCourse(db)
  await seedCppCourse(db)
  await seedDjangoCourse(db)
  await seedReactCourse(db)

  console.log('✅ Seed complete!')
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(() => db.$disconnect())
