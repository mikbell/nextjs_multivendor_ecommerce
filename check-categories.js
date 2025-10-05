const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function checkCategories() {
  try {
    console.log('Checking existing categories...')

    const categories = await prisma.category.findMany()
    const subcategories = await prisma.subcategory.findMany()
    
    console.log(`\n📁 Found ${categories.length} categories:`)
    categories.forEach(cat => {
      console.log(`- ${cat.name} (ID: ${cat.id})`)
      console.log(`  URL: ${cat.url}`)
      
      const catSubcategories = subcategories.filter(sub => sub.categoryId === cat.id)
      console.log(`  Subcategories: ${catSubcategories.length}`)
      catSubcategories.forEach(sub => {
        console.log(`    - ${sub.name} (ID: ${sub.id})`)
      })
      console.log('')
    })

    // Summary
    console.log('\n--- SUMMARY ---')
    console.log(`✅ Total categories: ${categories.length}`)
    console.log(`✅ Total subcategories: ${subcategories.length}`)
    
    if (categories.length === 0) {
      console.log('\n⚠️ WARNING: No categories found! This explains why the product form shows missing category validation.')
    }
    
    if (subcategories.length === 0) {
      console.log('\n⚠️ WARNING: No subcategories found! This explains why the product form shows missing subcategory validation.')
    }

  } catch (error) {
    console.error('❌ Error checking categories:', error)
  } finally {
    await prisma.$disconnect()
  }
}

checkCategories()