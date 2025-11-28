// routes/events.js - Full events routes with news, leaderboard, expiration, and delete features
const express = require('express');
const { userMiddleware, roleMiddleware } = require('../middlewares/user');
const prisma = require('../prisma-client');

const router = express.Router();

// ========== EVENT ROUTES - AUTO APPROVAL and Expiration ==========

// GET /api/events - Get all approved upcoming events only
router.get('/', async (req, res) => {
    try {
        const { page = 1, limit = 10, type, upcoming = 'true' } = req.query;
        const skip = (page - 1) * limit;

        const where = { status: 'APPROVED' };
        if (type) where.eventType = type.toUpperCase();

        if (upcoming === 'true') {
            // Auto-expiration filter: only events today or after
            const today = new Date();
            today.setHours(0, 0, 0, 0); // midnight start of day
            where.date = { gte: today };
        }

        const events = await prisma.event.findMany({
            where,
            include: {
                organizer: { select: { id: true, name: true, email: true, role: true } }
            },
            orderBy: { date: 'asc' },
            skip: parseInt(skip),
            take: parseInt(limit)
        });

        const total = await prisma.event.count({ where });

        res.status(200).json({
            events,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                pages: Math.ceil(total / limit) || 1
            }
        });
    } catch (error) {
        console.error('❌ Error fetching events:', error);
        res.status(500).json({ error: 'Internal server error', message: error.message });
    }
});

// ================== SPECIAL ROUTES FIRST ==================

// GET /api/events/leaderboard
router.get('/leaderboard', async (req, res) => {
    try {
        const users = await prisma.user.findMany({
            where: { role: { in: ['ALUMNI', 'FACULTY'] } },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                createdAt: true,
                eventsOrganized: { select: { id: true, status: true, createdAt: true } }
            }
        });

        const leaderboard = users
            .map(user => {
                const totalEvents = user.eventsOrganized.length;
                const approvedEvents = user.eventsOrganized.filter(e => e.status === 'APPROVED').length;
                const cancelledEvents = user.eventsOrganized.filter(e => e.status === 'CANCELLED').length;

                const yearsActive = Math.max(
                    1,
                    Math.floor((new Date() - new Date(user.createdAt)) / (1000 * 60 * 60 * 24 * 365))
                );
                const averagePerYear = totalEvents / yearsActive;

                return {
                    id: user.id,
                    name: user.name,
                    role: user.role,
                    totalEvents,
                    approvedEvents,
                    cancelledEvents,
                    yearsActive,
                    averagePerYear: Math.round(averagePerYear * 100) / 100
                };
            })
            .filter(user => user.totalEvents > 0)
            .sort((a, b) => b.totalEvents - a.totalEvents);

        res.status(200).json({ leaderboard });
    } catch (error) {
        console.error('❌ Error fetching leaderboard:', error);
        res.status(500).json({ error: 'Internal server error', message: error.message });
    }
});

// GET /api/events/user/my-events
router.get('/user/my-events', userMiddleware, async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query;
        const skip = (page - 1) * limit;

        const events = await prisma.event.findMany({
            where: { organizerId: req.user.id },
            orderBy: { createdAt: 'desc' },
            skip: parseInt(skip),
            take: parseInt(limit)
        });

        const total = await prisma.event.count({ where: { organizerId: req.user.id } });

        res.status(200).json({
            events,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                pages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        console.error('❌ Error fetching user events:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// GET /api/events/news
router.get('/news', async (req, res) => {
    try {
        const { page = 1, limit = 10, search } = req.query;
        const skip = (page - 1) * limit;

        const where = {
            isPublished: true,
            publishedAt: { lte: new Date() }
        };

        if (search) {
            where.OR = [
                { title: { contains: search, mode: 'insensitive' } },
                { excerpt: { contains: search, mode: 'insensitive' } }
            ];
        }

        const news = await prisma.news.findMany({
            where,
            include: { author: { select: { id: true, name: true, role: true } } },
            orderBy: { publishedAt: 'desc' },
            skip: parseInt(skip),
            take: parseInt(limit)
        });

        const total = await prisma.news.count({ where });

        res.status(200).json({
            news,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                pages: Math.ceil(total / limit) || 1
            }
        });
    } catch (error) {
        console.error('❌ Error fetching news:', error);
        res.status(500).json({ error: 'Internal server error', message: error.message });
    }
});

// POST /api/events/news
router.post(
    '/news',
    userMiddleware,
    roleMiddleware(['ADMIN', 'FACULTY']),
    async (req, res) => {
        try {
            const { title, content, excerpt, image, publishNow = false } = req.body;

            if (!title || !content || !excerpt) {
                return res.status(400).json({ error: 'Title, content, and excerpt are required' });
            }

            const newsData = {
                title,
                content,
                excerpt,
                image,
                authorId: req.user.id,
                isPublished: publishNow,
                publishedAt: publishNow ? new Date() : null
            };

            const news = await prisma.news.create({
                data: newsData,
                include: { author: { select: { id: true, name: true, role: true } } }
            });

            res.status(201).json({ news });
        } catch (error) {
            console.error('❌ Error creating news:', error);
            res.status(500).json({ error: 'Internal server error', message: error.message });
        }
    }
);

// ================== SINGLE EVENT ROUTE LAST ==================

// GET /api/events/:id
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const event = await prisma.event.findUnique({
            where: { id: parseInt(id) },
            include: {
                organizer: { select: { id: true, name: true, email: true, role: true } }
            }
        });

        if (!event) {
            return res.status(404).json({ error: 'Event not found' });
        }

        res.status(200).json({ event });
    } catch (error) {
        console.error('❌ Error fetching event:', error);
        res.status(500).json({ error: 'Internal server error', message: error.message });
    }
});

// POST /api/events - create event
router.post(
  '/',
  userMiddleware,
  roleMiddleware(['ALUMNI', 'FACULTY', 'ADMIN']),
  async (req, res) => {
    try {
      console.log('📝 Creating event with form data:', req.body);

      const {
        eventTitle,
        eventType,
        description,
        date,
        time,
        venue,
        organizer,
        registrationLink,
        imageUrl,
        speaker,
        contactName,
        contactEmail,
        maxParticipants,
        entryFee,
        eligibility,
        tags,
        groupLink
      } = req.body;

      if (!eventTitle || !eventType || !description || !date || !venue) {
        return res.status(400).json({ error: 'All required fields must be filled' });
      }

      const eventDate = new Date(date);
      if (eventDate < new Date()) {
        return res.status(400).json({ error: 'Event date must be in the future' });
      }

      let contactInfo = '';
      if (organizer && contactName) {
        contactInfo = `${organizer} - Contact: ${contactName}`;
      } else if (organizer) {
        contactInfo = organizer;
      } else if (contactName) {
        contactInfo = `Contact: ${contactName}`;
      }

      const event = await prisma.event.create({
        data: {
          title: eventTitle,
          eventType: eventType.toUpperCase().replace(' ', '_'),
          description,
          date: eventDate,
          time: time || null,
          venue,
          duration: null,
          speakerName: speaker || null,
          speakerDetails: null,
          registrationLink: registrationLink || null,
          contactInfo: contactInfo || null,
          contactEmail: contactEmail || null,
          bannerImage: imageUrl || null,
          externalLink: groupLink || null,
          maxParticipants: maxParticipants ? parseInt(maxParticipants) : null,
          entryFee: entryFee || null,
          eligibility: eligibility || null,
          tags: tags || null,
          status: 'APPROVED',
          organizerId: req.user.id
        },
        include: {
          organizer: { select: { id: true, name: true, email: true, role: true } }
        }
      });

      console.log('✅ Event created successfully:', event.title);
      res.status(201).json({ event, message: 'Event created successfully and is now live!' });
    } catch (error) {
      console.error('❌ Error creating event:', error);
      res.status(500).json({ error: 'Internal server error', message: error.message });
    }
  }
);

// PUT /api/events/:id - update event
router.put('/:id', userMiddleware, async (req, res) => {
    try {
        const { id } = req.params;
        const { eventTitle, eventType, description, date, venue } = req.body;

        const existingEvent = await prisma.event.findUnique({ where: { id: parseInt(id) } });
        if (!existingEvent) return res.status(404).json({ error: 'Event not found' });

        if (existingEvent.organizerId !== req.user.id && req.user.role !== 'ADMIN') {
            return res.status(403).json({ error: 'Not authorized to update this event' });
        }

        const eventDate = new Date(date);
        if (eventDate < new Date()) {
            return res.status(400).json({ error: 'Event date must be in the future' });
        }

        const event = await prisma.event.update({
            where: { id: parseInt(id) },
            data: {
                title: eventTitle,
                eventType: eventType.toUpperCase().replace(' ', '_'),
                description,
                date: eventDate,
                venue
            },
            include: { organizer: { select: { id: true, name: true, email: true, role: true } } }
        });

        res.status(200).json({ event });
    } catch (error) {
        console.error('❌ Error updating event:', error);
        res.status(500).json({ error: 'Internal server error', message: error.message });
    }
});

// DELETE /api/events/:id - soft delete (cancel) event (owner or admin)
router.delete('/:id', userMiddleware, async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;
        const userRole = req.user.role;

        const existingEvent = await prisma.event.findUnique({
            where: { id: parseInt(id) }
        });
        if (!existingEvent) return res.status(404).json({ error: 'Event not found' });

        if (existingEvent.organizerId !== userId && userRole !== 'ADMIN') {
            return res.status(403).json({ error: 'Not authorized to cancel this event' });
        }

        await prisma.event.update({
            where: { id: parseInt(id) },
            data: { status: 'CANCELLED', updatedAt: new Date() }
        });

        res.status(200).json({ message: 'Event cancelled successfully' });
    } catch (error) {
        console.error('❌ Error cancelling event:', error);
        res.status(500).json({ error: 'Internal server error', message: error.message });
    }
});

// Additional route - Check ownership for delete button display
router.get('/user/check-ownership/:id', userMiddleware, async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;
        const userRole = req.user.role;

        const event = await prisma.event.findUnique({ where: { id: parseInt(id) }, select: { organizerId: true } });
        if (!event) return res.status(404).json({ error: 'Event not found' });

        const canDelete = event.organizerId === userId || userRole === 'ADMIN';
        res.status(200).json({ canDelete, isOwner: event.organizerId === userId, isAdmin: userRole === 'ADMIN' });
    } catch (error) {
        console.error('❌ Error checking ownership:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
