const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient({});

async function main() {
  console.log('Seeding database via standalone script...');

  // 1. Create Admin User
  const hashedPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@praiseimpact.com' },
    update: {},
    create: {
      email: 'admin@praiseimpact.com',
      password: hashedPassword,
      role: 'ADMIN',
    },
  });
  console.log('Admin user created:', admin.email);

  // 2. Create Regular User
  const userPassword = await bcrypt.hash('user123', 10);
  const user = await prisma.user.upsert({
    where: { email: 'member@praiseimpact.com' },
    update: {},
    create: {
      email: 'member@praiseimpact.com',
      password: userPassword,
      role: 'USER',
      pushToken: 'ExponentPushToken[dummy_token]',
    },
  });
  console.log('Regular user created:', user.email);

  // 3. Create Sermons
  await prisma.sermon.deleteMany({});
  
  const sermons = [
    {
      title: 'Faith Over Fear',
      description: 'Trusting God in times of great uncertainty and discovering His peace.',
      video_url: '7VpA6X68_aM',
      source_type: 'YOUTUBE',
      thumbnail_url: 'https://images.unsplash.com/photo-1510915228340-29c85a43dcfe?q=80&w=1470&auto=format&fit=crop',
      duration: 3200,
    },
    {
      title: 'The Power of Unwavering Faith',
      description: 'Discover how to stand firm in your faith during life\'s greatest trials.',
      video_url: 'dQw4w9WgXcQ',
      source_type: 'YOUTUBE',
      thumbnail_url: 'https://images.unsplash.com/photo-1507692049790-de58290a4334?q=80&w=1470&auto=format&fit=crop',
      duration: 2450,
    },
    {
      title: 'Walking in Divine Grace',
      description: 'Understanding the unmerited favor of God in your daily walk.',
      video_url: '9bZkp7q19f0',
      source_type: 'YOUTUBE',
      thumbnail_url: 'https://images.unsplash.com/photo-1438232992991-995b7058bbb3?q=80&w=1473&auto=format&fit=crop',
      duration: 3100,
    },
    {
      title: 'Breaking Generational Chains',
      description: 'A powerful teaching on spiritual deliverance and freedom.',
      video_url: '5NV6Rdv1a3I',
      source_type: 'YOUTUBE',
      thumbnail_url: 'https://images.unsplash.com/photo-1544427928-142ec22aafe6?q=80&w=1471&auto=format&fit=crop',
      duration: 2800,
    },
    {
      title: 'Divine Restoration',
      description: 'God is able to restore all that has been lost or stolen.',
      video_url: 'dQw4w9WgXcQ',
      source_type: 'YOUTUBE',
      thumbnail_url: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?q=80&w=1470&auto=format&fit=crop',
      duration: 2100,
    }
  ];

  for (const s of sermons) {
    await prisma.sermon.create({ data: s });
  }
  console.log('Sermons seeded.');

  // 4. Create Events
  await prisma.event.deleteMany({});
  const events = [
    {
      title: 'Sunday Worship Service',
      description: 'Join us for an atmosphere of miracles and powerful word.',
      location: 'Main Auditorium',
      event_date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000 + 4 * 60 * 60 * 1000),
    },
    {
      title: 'Midweek Power Encounter',
      description: 'A dedicated time for deep intercession and prophetic insights.',
      location: 'Grace Chapel',
      event_date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
    },
    {
      title: 'Youth Ignition Conference',
      description: 'Empowering the next generation for global impact.',
      location: 'Youth Center',
      event_date: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000),
    }
  ];

  for (const e of events) {
    await prisma.event.create({ data: e });
  }
  console.log('Events seeded.');

  // 5. Create Prayer Requests
  await prisma.prayerRequest.deleteMany({});
  const prayerRequests = [
    {
      userId: user.id,
      content: 'I am trusting God for a total healing in my family.',
      status: 'pending',
    },
    {
      userId: user.id,
      content: 'Divine breakthrough in my career and financial stability.',
      status: 'praying',
    },
    {
      userId: user.id,
      content: 'Strength and wisdom for my academic journey.',
      status: 'answered',
    }
  ];

  for (const pr of prayerRequests) {
    await prisma.prayerRequest.create({ data: pr });
  }
  console.log('Prayer requests seeded.');

  // 6. Set Live Session
  await prisma.liveSession.upsert({
    where: { id: 'default' },
    update: { 
      is_live: false,
      next_service_at: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000)
    },
    create: {
      id: 'default',
      is_live: false,
      video_id: '7VpA6X68_aM',
      next_service_at: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000)
    }
  });

  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
