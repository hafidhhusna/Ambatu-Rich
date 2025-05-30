const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function createTestUser() {
  try {
    console.log('🔐 Creating test user...');

    // Hash the password
    const hashedPassword = await bcrypt.hash('password123', 10);

    // Create test user
    const user = await prisma.user.create({
      data: {
        email: 'test@example.com',
        username: 'testuser',
        name: 'Test User',
        password: hashedPassword,
        emailVerified: true,
      },
    });

    console.log('✅ Test user created successfully:');
    console.log('📧 Email: test@example.com');
    console.log('👤 Username: testuser');
    console.log('🔑 Password: password123');
    console.log('🆔 User ID:', user.id);
  } catch (error) {
    if (error.code === 'P2002') {
      console.log('ℹ️ Test user already exists');
    } else {
      console.error('❌ Error creating test user:', error);
    }
  } finally {
    await prisma.$disconnect();
  }
}

createTestUser();
