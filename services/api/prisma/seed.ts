import prisma from '../src/config/database';
import bcrypt from 'bcryptjs';

async function main() {
  console.log('Seeding database...');

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
  // Clear existing to avoid unique conflicts if re-run
  await prisma.sermon.deleteMany({});
  
  const sermons = [
    {
      title: 'The Power of Unwavering Faith',
      description: 'Discover how to stand firm in your faith during life\'s greatest trials.',
      video_url: 'dQw4w9WgXcQ',
      source_type: 'YOUTUBE' as const,
      thumbnail_url: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
      duration: 2450,
    },
    {
      title: 'Walking in Divine Grace',
      description: 'Understanding the unmerited favor of God in your daily walk.',
      video_url: '9bZkp7q19f0',
      source_type: 'YOUTUBE' as const,
      thumbnail_url: 'https://img.youtube.com/vi/9bZkp7q19f0/maxresdefault.jpg',
      duration: 3100,
    },
    {
      title: 'Breaking Generational Chains',
      description: 'A powerful teaching on spiritual deliverance and freedom.',
      video_url: '5NV6Rdv1a3I',
      source_type: 'YOUTUBE' as const,
      thumbnail_url: 'https://img.youtube.com/vi/5NV6Rdv1a3I/maxresdefault.jpg',
      duration: 2800,
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
      event_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Next week
    },
    {
      title: 'Midweek Power Encounter',
      description: 'A dedicated time for deep intercession and prophetic insights.',
      location: 'Grace Chapel',
      event_date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // In 3 days
    }
  ];

  for (const e of events) {
    await prisma.event.create({ data: e });
  }
  console.log('Events seeded.');

  // 5. Create Prayer Requests
  await prisma.prayerRequest.deleteMany({});
  await prisma.prayerRequest.create({
    data: {
      userId: user.id,
      content: 'I am trusting God for a total healing in my family.',
      status: 'pending',
    }
  });
  console.log('Prayer requests seeded.');

  // 6. Set Live Session
  await prisma.liveSession.upsert({
    where: { id: 'default' },
    update: { is_live: false },
    create: {
      id: 'default',
      is_live: false,
      video_id: 'dQw4w9WgXcQ'
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
