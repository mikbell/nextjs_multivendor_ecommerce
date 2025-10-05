const { PrismaClient } = require('@prisma/client')
const { v4: uuidv4 } = require('uuid')

const prisma = new PrismaClient()

async function createCategories() {
  try {
    console.log('Creating categories and subcategories...')

    // Create categories
    const category1 = await prisma.category.create({
      data: {
        id: uuidv4(),
        name: 'Abbigliamento',
        url: 'abbigliamento',
        slug: 'abbigliamento',
        description: 'Abbigliamento e accessori',
        image: 'https://via.placeholder.com/200x200',
        featured: false
      }
    })

    const category2 = await prisma.category.create({
      data: {
        id: uuidv4(),
        name: 'Elettronica',
        url: 'elettronica',
        slug: 'elettronica',
        description: 'Prodotti elettronici',
        image: 'https://via.placeholder.com/200x200',
        featured: false
      }
    })

    const category3 = await prisma.category.create({
      data: {
        id: uuidv4(),
        name: 'Casa e Giardino',
        url: 'casa-giardino',
        slug: 'casa-giardino',
        description: 'Articoli per casa e giardino',
        image: 'https://via.placeholder.com/200x200',
        featured: false
      }
    })

    // Create subcategories
    await prisma.subcategory.create({
      data: {
        id: uuidv4(),
        name: 'Magliette',
        url: 'magliette',
        slug: 'magliette',
        description: 'Magliette per uomo e donna',
        image: 'https://via.placeholder.com/200x200',
        categoryId: category1.id,
        featured: false
      }
    })

    await prisma.subcategory.create({
      data: {
        id: uuidv4(),
        name: 'Pantaloni',
        url: 'pantaloni',
        slug: 'pantaloni',
        description: 'Pantaloni e jeans',
        image: 'https://via.placeholder.com/200x200',
        categoryId: category1.id,
        featured: false
      }
    })

    await prisma.subcategory.create({
      data: {
        id: uuidv4(),
        name: 'Smartphone',
        url: 'smartphone',
        slug: 'smartphone',
        description: 'Telefoni cellulari e accessori',
        image: 'https://via.placeholder.com/200x200',
        categoryId: category2.id,
        featured: false
      }
    })

    await prisma.subcategory.create({
      data: {
        id: uuidv4(),
        name: 'Computer',
        url: 'computer',
        slug: 'computer',
        description: 'Computer e laptop',
        image: 'https://via.placeholder.com/200x200',
        categoryId: category2.id,
        featured: false
      }
    })

    await prisma.subcategory.create({
      data: {
        id: uuidv4(),
        name: 'Mobili',
        url: 'mobili',
        slug: 'mobili',
        description: 'Mobili per casa',
        image: 'https://via.placeholder.com/200x200',
        categoryId: category3.id,
        featured: false
      }
    })

    console.log('✅ Categories and subcategories created successfully!')
    
    // Show what was created
    const categories = await prisma.category.findMany({
      include: {
        subCategories: true
      }
    })
    
    console.log('\n📁 Created categories:')
    categories.forEach(cat => {
      console.log(`- ${cat.name} (${cat.subCategories.length} subcategories)`)
      cat.subCategories.forEach(sub => {
        console.log(`  - ${sub.name}`)
      })
    })

  } catch (error) {
    console.error('❌ Error creating categories:', error)
  } finally {
    await prisma.$disconnect()
  }
}

createCategories()